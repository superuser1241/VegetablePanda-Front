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
    userWallet,
    userRole 
}) => {
    const getClassName = () => {
        if (isFarmer) {
            // 농부일 때
            return auctionData && auctionData.auctionSeq ? 
                'sidebar-status-content' :    // 경매 있으면 상태 페이지 스타일
                'sidebar-register-content';   // 경매 없으면 등록 페이지 스타일
        } else {
            // 구매자일 때
            return auctionData && auctionData.auctionSeq ? 
                'sidbar-bid-content' :          // 경매 있으면 입찰 페이지 스타일
                'waiting-message';           // 경매 없으면 대기 메시지 스타일
        }
    };

    return (
        <div className={getClassName()}>
            {isFarmer ? (
                // 농부일 때
                auctionData && auctionData.auctionSeq ? (
                    <AuctionStatusPage 
                        streamingRoom={streamingRoom}
                        auctionData={auctionData}
                        onOpenModal={onOpenModal}
                        onEndAuction={onEndAuction}
                        onCheckPrice={onCheckPrice}
                        onCheckSalesHistory={onCheckSalesHistory}
                    />
                ) : (
                    <AuctionRegisterPage 
                        streamingRoom={streamingRoom}
                        onRegisterSuccess={onRegisterSuccess}
                        onCheckPrice={onCheckPrice}
                        onCheckSalesHistory={onCheckSalesHistory}
                    />
                )
            ) : (
                // 구매자일 때
                auctionData && auctionData.auctionSeq ? (
                    <BidPage 
                        streamingRoom={streamingRoom}
                        auctionData={auctionData}
                        onAuctionEnd={onEndAuction}
                        onOpenModal={onOpenModal}
                        onCheckPrice={onCheckPrice}
                        onCheckSalesHistory={onCheckSalesHistory}
                        userWallet={userWallet}
                        userRole={userRole}
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