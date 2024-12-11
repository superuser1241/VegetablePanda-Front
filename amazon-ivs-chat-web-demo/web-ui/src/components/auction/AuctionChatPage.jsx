import React, { useState, useEffect } from 'react';
import Chat from '../chat/Chat';
import AuctionStock from './AuctionStock';
import BiddingSection from './BiddingSection';
import BidHistoryModal from './BidHistoryModal';
import PriceCheckModal from './PriceCheckModal';
import SalesHistoryModal from './SalesHistoryModal';
import axios from 'axios';
import './AuctionChatPage.css';
import { Client } from "@stomp/stompjs";

const AuctionChatPage = ({ streamingRoom, handleExitChat }) => {
    const [showRegister, setShowRegister] = useState(false);
    const [auctionData, setAuctionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bidHistory, setBidHistory] = useState([]);
    const currentUserSeq = localStorage.getItem('userSeq');
    const isFarmer = currentUserSeq === String(streamingRoom?.farmerSeq);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [showSalesModal, setShowSalesModal] = useState(false);
    const [priceInfo, setPriceInfo] = useState(null);
    const [salesHistory, setSalesHistory] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const serverIp = process.env.REACT_APP_SERVER_IP;
    const userRole = localStorage.getItem('userRole');
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const checkAuctionStatus = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                console.log('Checking auction status for farmer:', streamingRoom.farmerSeq);
                console.log('Current user is farmer:', isFarmer);
                console.log('Token:', token);

                const response = await axios.get(
                    `${serverIp}/auction/${streamingRoom.farmerSeq}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );
                
                console.log('Auction status response:', response.data);
                
                if (!response.data || response.data.state === 0) {
                    console.log('No active auction found, showing register:', isFarmer);
                    setShowRegister(isFarmer);
                    setAuctionData(response.data);
                } else {
                    console.log('Active auction found:', response.data);
                    setAuctionData(response.data);
                    setShowRegister(false);
                }
            } catch (error) {
                console.error('경매 상태 확인 실패:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (streamingRoom?.farmerSeq) {
            checkAuctionStatus();
        } else {
            console.log('No farmer user seq available');
        }
    }, [streamingRoom, isFarmer]);

   
    const handleAuctionRegister = (newAuction) => {
        console.log('New auction registered:', newAuction);
        setAuctionData(newAuction);
        setShowRegister(false);
    };

    const handleAuctionEnd = async () => {
        if (isFarmer) {
            try {
                const token = localStorage.getItem('token');
                // PATCH로 변경하여 상태값만 업데이트
                await axios.patch(
                    `${serverIp}/auction/${auctionData.auctionSeq}/${streamingRoom.farmerSeq}`,
                    {},
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                setShowRegister(true);
                setAuctionData(null);
                alert('경매가 종료되었습니다.');
            } catch (error) {
                console.error('경매 종료 실패:', error);
                alert('경매 종료에 실패했습니다.');
            }
        }
    };

    const handleOpenModal = (bid) => {
        setBidHistory(bid);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCheckPrice = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${serverIp}/price/${streamingRoom.productName}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            setPriceInfo(response.data);
            setShowPriceModal(true);
        } catch (error) {
            console.error('가격 정보 조회 실패:', error);
            alert('가격 정보를 가져오는데 실패했습니다.');
        }
    };

    const handleCheckSalesHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${serverIp}/buy/${streamingRoom.stockSeq}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            setSalesHistory(response.data);
            setShowSalesModal(true);
        } catch (error) {
            console.error('판매 기록 조회 실패:', error);
            alert('판매 기록을 가져오는데 실패했습니다.');
        }
    };

    // 컴포넌트 언마운트 시 세션 스토리지 정리
    useEffect(() => {
        return () => {
            // 농부가 아닌 경우에만 세션 스토리지 정리
            if (!isFarmer) {
                sessionStorage.removeItem('streamingRoom');
            }
        };
    }, [isFarmer]);

    // 페이지 이동 시 세션 스토리지 정리를 위한 핸들러
    const handleBeforeUnload = () => {
        if (!isFarmer) {
            sessionStorage.removeItem('streamingRoom');
        }
    };

    // 페이지 이동 이벤트 리스너 등록
    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isFarmer]);

    // Chat 컴포넌트에 전달할 핸들러
    const handleUserExit = async () => {
        if (!isFarmer) {
            sessionStorage.removeItem('streamingRoom');
        }
        if (handleExitChat) {
            await handleExitChat();
        }
    };

    if (isLoading) {
        return <div>경매 정를 불러오는 중...</div>;
    }

    return (
        <div className="auction-chat-container">
            <div className="page-layout">
                <div className="chat-section">
                    <Chat 
                        streamingRoom={streamingRoom}
                        handleExitChat={handleUserExit}
                    />
                </div>
                
                <div className="bottom-section">
                    <div className="auction-info-section">
                        <AuctionStock streamingRoom={streamingRoom} />
                    </div>
                    
                    <button 
                        className="auction-sidebar-toggle" 
                        onClick={toggleSidebar}
                    >
                        {isSidebarOpen ? '닫기' : '메뉴'}
                    </button>

                    <div className={`auction-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                        <div className="auction-sidebar-content">
                            <BiddingSection 
                                auctionData={auctionData}
                                isFarmer={isFarmer}
                                streamingRoom={streamingRoom}
                                onOpenModal={handleOpenModal}
                                onEndAuction={handleAuctionEnd}
                                onCheckPrice={handleCheckPrice}
                                onCheckSalesHistory={handleCheckSalesHistory}
                                onRegisterSuccess={handleAuctionRegister}
                                userRole={userRole}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <BidHistoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                bidHistory={bidHistory}
            />
            <PriceCheckModal 
                isOpen={showPriceModal}
                onClose={() => setShowPriceModal(false)}
                priceInfo={priceInfo}
            />
            
            <SalesHistoryModal 
                isOpen={showSalesModal}
                onClose={() => setShowSalesModal(false)}
                salesHistory={salesHistory}
            />
        </div>
    );
};

export default AuctionChatPage; 