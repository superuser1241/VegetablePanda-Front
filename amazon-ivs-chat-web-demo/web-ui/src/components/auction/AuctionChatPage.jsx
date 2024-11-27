import React from 'react';
import Chat from '../chat/Chat';
import BidPage from './BidPage';
import Auction from './Auction';
import './AuctionChatPage.css';

const AuctionChatPage = ({ streamingRoom, handleExitChat }) => {
    return (
        <div className="auction-chat-container">
            <div className="page-layout">
                {/* 상단: 채팅과 비디오 */}
                <div className="chat-section">
                    <Chat 
                        streamingRoom={streamingRoom}
                        handleExitChat={handleExitChat}
                    />
                </div>
                
                {/* 하단: 경매 정보와 입찰 정보 */}
                <div className="bottom-section">
                    <div className="auction-info-section">
                        <Auction 
                          streamingRoom={streamingRoom}
                        />
                    </div>
                    <div className="bidding-section">
                        <BidPage 
                            streamingRoom={streamingRoom}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionChatPage; 