import React, { useState, useEffect } from 'react';
import Chat from '../chat/Chat';
import BidPage from './BidPage';
import AuctionStock from './AuctionStock';
import AuctionRegisterPage from './AuctionRegisterPage';
import AuctionStatusPage from './AuctionStatusPage';
import BidHistoryModal from './BidHistoryModal';
import axios from 'axios';
import './AuctionChatPage.css';

const AuctionChatPage = ({ streamingRoom, handleExitChat }) => {
    const [showRegister, setShowRegister] = useState(false);
    const [auctionData, setAuctionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bidHistory, setBidHistory] = useState([]);
    const currentUserSeq = localStorage.getItem('userSeq');
    const isFarmer = currentUserSeq === String(streamingRoom?.farmerSeq);

    useEffect(() => {
        const checkAuctionStatus = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                console.log('Checking auction status for farmer:', streamingRoom.farmerSeq);
                console.log('Current user is farmer:', isFarmer);
                console.log('Token:', token);

                const response = await axios.get(
                    `http://localhost:9001/auction/${streamingRoom.farmerSeq}`,
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
        setAuctionData(newAuction);
        setShowRegister(false);
    };

    const handleAuctionEnd = async () => {
        if (isFarmer) {
            try {
                const token = localStorage.getItem('token');
                // PATCH로 변경하여 상태값만 업데이트
                await axios.patch(
                    `http://localhost:9001/auction/${auctionData.auctionSeq}`,
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

    if (isLoading) {
        return <div>경매 정를 불러오는 중...</div>;
    }

    return (
        <div className="auction-chat-container">
            <div className="page-layout">
                <div className="chat-section">
                    <Chat 
                        streamingRoom={streamingRoom}
                        handleExitChat={handleExitChat}
                    />
                </div>
                
                <div className="bottom-section">
                    <div className="auction-info-section">
                        <AuctionStock streamingRoom={streamingRoom} />
                    </div>
                    <div className="bidding-section">
                        {auctionData && auctionData.auctionSeq ? (
                            isFarmer ? (
                                <AuctionStatusPage 
                                    streamingRoom={streamingRoom}
                                    auctionData={auctionData}
                                    onOpenModal={handleOpenModal}
                                    onEndAuction={handleAuctionEnd}
                                />
                            ) : (
                                <BidPage 
                                    streamingRoom={streamingRoom}
                                    auctionData={auctionData}
                                    onAuctionEnd={handleAuctionEnd}
                                    onOpenModal={handleOpenModal}
                                />
                            )
                        ) : (
                            isFarmer ? (
                                <AuctionRegisterPage 
                                    streamingRoom={streamingRoom}
                                    onRegisterSuccess={handleAuctionRegister}
                                    stockSeq={streamingRoom.stockSeq}
                                />
                            ) : (
                                <div className="waiting-message">
                                    <p>경매 시작을 기다리는 중입니다...</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <BidHistoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                bidHistory={bidHistory}
            />
        </div>
    );
};

export default AuctionChatPage; 