import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chat from '../chat/Chat.jsx';
import AuctionStock from './AuctionStock.jsx';
import BiddingModal from './BiddingModal.jsx';
import axios from 'axios';
import './AuctionChatPage.css';

const AuctionChatPage = ({ streamingRoom, handleExitChat }) => {
    const navigate = useNavigate();
    const [showBiddingModal, setShowBiddingModal] = useState(false);
    const [auctionData, setAuctionData] = useState(null);
    const [bidHistory, setBidHistory] = useState([]);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [showSalesModal, setShowSalesModal] = useState(false);
    const [priceInfo, setPriceInfo] = useState(null);
    const [salesHistory, setSalesHistory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const currentUserSeq = localStorage.getItem('userSeq');
    const isFarmer = currentUserSeq === String(streamingRoom?.farmerSeq);
    const [userWallet, setUserWallet] = useState(null);

    useEffect(() => {
        const checkAccessPermission = () => {
            const currentHour = new Date().getHours();
            const userRole = localStorage.getItem('userRole');
            const currentUserSeq = localStorage.getItem('userSeq');
            
            const isUserTime = currentHour >= 12 && currentHour < 18;
            const isCompanyTime = currentHour >= 18 && currentHour < 24;
            const isUser = userRole === 'ROLE_USER';
            const isCompany = userRole === 'ROLE_COMPANY';
            // 판매자인 경우 항상 접근 가능
            if (currentUserSeq === String(streamingRoom?.farmerSeq)) {
                return;
            }

            if (isUserTime) {
                if (!isUser) {
                    alert('오후 12시부터 오후 6시까지는 일반 회원만 참여 가능합니다.');
                    navigate('/');
                    return;
                }
            } else if (isCompanyTime) {
                if (!isCompany) {
                    alert('오후 6시부터 오후 12시까지는 사업자 회원만 참여 가능합니다.');
                    navigate('/');
                    return;
                }
            } else {
                alert('경매는 오후 12시부터 오후 12시까지만 참여 가능합니다.');
                navigate('/');
                return;
            }
        };

        checkAccessPermission();
        const timeCheckInterval = setInterval(checkAccessPermission, 60000);
        return () => clearInterval(timeCheckInterval);
    }, [navigate, streamingRoom?.farmerSeq]);  // dependency에 farmerSeq 추가

    const handleOpenBiddingModal = () => {
        setShowBiddingModal(true);
    };

    const handleCloseBiddingModal = () => {
        setShowBiddingModal(false);
    };

    if (isLoading) {
        return <div>경매 정보를 불러오는 중...</div>;
    }

    return (
        <div className="auction-chat-container">
            <button 
                className="fixed-bid-button"
                onClick={handleOpenBiddingModal}
            >
                입찰하기
            </button>
            
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
                
                </div>
            </div>

            <div className="modal-container">
                <BiddingModal 
                    isOpen={showBiddingModal}
                    onClose={handleCloseBiddingModal}
                    streamingRoom={streamingRoom}
                    auctionData={auctionData}
                    setAuctionData={setAuctionData}
                    bidHistory={bidHistory}
                    setBidHistory={setBidHistory}
                    showPriceModal={showPriceModal}
                    setShowPriceModal={setShowPriceModal}
                    showSalesModal={showSalesModal}
                    setShowSalesModal={setShowSalesModal}
                    priceInfo={priceInfo}
                    setPriceInfo={setPriceInfo}
                    salesHistory={salesHistory}
                    setSalesHistory={setSalesHistory}
                    isFarmer={isFarmer}
                    userWallet={userWallet}
                />
            </div>
        </div>
    );
};

export default AuctionChatPage; 