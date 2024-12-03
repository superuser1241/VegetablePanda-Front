import React from 'react';
import AuctionStatusPage from './AuctionStatusPage';
import BidPage from './BidPage';
import AuctionRegisterPage from './AuctionRegisterPage';

const BiddingSection = ({ 
    auctionData, 
    isFarmer, 
    streamingRoom, 
    onOpenModal, 
    onEndAuction, 
    onCheckPrice, 
    onCheckSalesHistory, 
    onRegisterSuccess,
    userWallet 
}) => {
    return (
        <div className="bidding-section">
            {auctionData && auctionData.auctionSeq ? (
                isFarmer ? (
                    <AuctionStatusPage 
                        streamingRoom={streamingRoom}
                        auctionData={auctionData}
                        onOpenModal={onOpenModal}
                        onEndAuction={onEndAuction}
                        onCheckPrice={onCheckPrice}
                        onCheckSalesHistory={onCheckSalesHistory}
                    />
                ) : (
                    <BidPage 
                        streamingRoom={streamingRoom}
                        auctionData={auctionData}
                        onAuctionEnd={onEndAuction}
                        onOpenModal={onOpenModal}
                        onCheckPrice={onCheckPrice}
                        onCheckSalesHistory={onCheckSalesHistory}
                        userWallet={userWallet}
                    />
                )
            ) : (
                isFarmer ? (
                    <AuctionRegisterPage 
                        streamingRoom={streamingRoom}
                        onRegisterSuccess={onRegisterSuccess}
                        onCheckPrice={onCheckPrice}
                        onCheckSalesHistory={onCheckSalesHistory}
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