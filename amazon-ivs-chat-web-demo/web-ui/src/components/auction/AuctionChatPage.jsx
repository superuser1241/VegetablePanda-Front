import React, { useState, useEffect } from 'react';
import Chat from '../chat/Chat';
import BidPage from './BidPage';
import AuctionStock from './AuctionStock';
import AuctionRegisterPage from './AuctionRegisterPage';
import axios from 'axios';
import './AuctionChatPage.css';

const AuctionChatPage = ({ streamingRoom, handleExitChat }) => {
    const [showRegister, setShowRegister] = useState(false);
    const [auctionData, setAuctionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const currentUserSeq = localStorage.getItem('userSeq');
    const isFarmer = currentUserSeq === String(streamingRoom?.farmerUser?.userSeq);

    useEffect(() => {
        const checkAuctionStatus = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                console.log('Checking auction status for farmer:', streamingRoom.farmerUser.userSeq);
                console.log('Current user is farmer:', isFarmer);
                console.log('Token:', token);

                const response = await axios.get(
                    `http://localhost:9001/auction/${streamingRoom.farmerUser.userSeq}`,
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

        if (streamingRoom?.farmerUser?.userSeq) {
            checkAuctionStatus();
        } else {
            console.log('No farmer user seq available');
        }
    }, [streamingRoom, isFarmer]);

    const handleAuctionRegister = (newAuction) => {
        setAuctionData(newAuction);
        setShowRegister(false);
    };

    const handleAuctionEnd = () => {
        if (isFarmer) {
            setShowRegister(true);
            setAuctionData(null);
        }
    };

    if (isLoading) {
        return <div>경매 정보를 불러오는 중...</div>;
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
                            <BidPage 
                                streamingRoom={streamingRoom}
                                auctionData={auctionData}
                                onAuctionEnd={handleAuctionEnd}
                            />
                        ) : (
                            isFarmer ? (
                                <AuctionRegisterPage 
                                    streamingRoom={streamingRoom}
                                    onRegisterSuccess={handleAuctionRegister}
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
        </div>
    );
};

export default AuctionChatPage; 