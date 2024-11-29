import React from 'react';
import BidPage from './BidPage.jsx';
import AuctionRegisterPage from './AuctionRegisterPage.jsx';
import './BiddingSection.css';

const BiddingSection = ({ 
    streamingRoom, 
    auctionData, 
    isFarmer,
    userWallet,
    handleAuctionRegister,
    handleAuctionEnd,
    handleCheckPrice,
    handleCheckSalesHistory,
    handleOpenModal 
}) => {
    return (
        <div className="bidding-section">
            {auctionData && auctionData.auctionSeq ? (
                !isFarmer ? (
                    <BidPage 
                        streamingRoom={streamingRoom}
                        auctionData={auctionData}
                        onAuctionEnd={handleAuctionEnd}
                        onOpenModal={handleOpenModal}
                        onCheckPrice={handleCheckPrice}
                        onCheckSalesHistory={handleCheckSalesHistory}
                        userWallet={userWallet}
                    />
                ) : (
                    <div className="waiting-message">
                        <p>현재 진행 중인 경매입니다.</p>
                    </div>
                )
            ) : (
                isFarmer ? (
                    <AuctionRegisterPage 
                        streamingRoom={streamingRoom}
                        onRegisterSuccess={handleAuctionRegister}
                        onCheckPrice={handleCheckPrice}
                        onCheckSalesHistory={handleCheckSalesHistory}
                    />
                ) : (
                    <div className="waiting-message">
                        <p>경매 시작을 기다리는 중입니다...</p>
                    </div>
                )
            )}
        </div>
    );
};  

export default BiddingSection; 