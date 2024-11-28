import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuctionData } from './useAuctionData';
import { useBidding } from './useBidding';
import './BidPage.css';

const BidPage = ({ streamingRoom, auctionData, onAuctionEnd }) => {
   

    const [isAuctionEnded, setIsAuctionEnded] = useState(false);

    useEffect(() => {
        if (auctionData?.closeTime) {
            const checkAuctionEnd = () => {
                const now = new Date();
                const closeTime = new Date(auctionData.closeTime);
                if (now >= closeTime && !isAuctionEnded) {
                    setIsAuctionEnded(true);
                    onAuctionEnd();
                }
            };

            const timer = setInterval(checkAuctionEnd, 1000);
            return () => clearInterval(timer);
        }
    }, [auctionData, isAuctionEnded, onAuctionEnd]);

    console.log('BidPage streamingRoom:', streamingRoom); // 디버깅용

    const { highestBid, auction, bid } = useAuctionData(streamingRoom.farmerUser.userSeq); // userSeq 5로 하드코딩된 값 사용
    const { auctionSeq } = useParams();
    const { bidAmount, handleIncrease, handleDecrease, handleBid } = useBidding(highestBid, auctionData.auctionSeq);

    const onBidSubmit = async () => {
        console.log('입찰 시도:', { bidAmount, auctionId: auctionSeq });
        await handleBid();
    };
    if (!auctionData || !auctionData.auctionSeq) {
        return <div>경매 정보를 불러오는 중...</div>;
    }

    return (
        
        <div className="auction-container">
            {/* <AllBidNotiSet/> */}
            {highestBid ? (
                <div className="bidding-section">
                    <div className="auction-info">
                        <div className="current-price">
                            <h3>현재 입찰가</h3>
                            <p>{highestBid.price}원</p>
                        </div>
                        <div className="quantity">
                            <h3>수량</h3>
                            <p>{auction?.count}</p>
                        </div>
                        <div className="time-left">
                            <h3>종료 일자</h3>
                            <p>{auction?.closeTime}</p>
                        </div>
                    </div>

                    <div>
                        <div className="bidding-section">
                            {bid ? (
                                <>
                                    <span>입찰 횟수: {bid.length}</span>
                                    <span><a href="#none">[입찰 확인]</a></span>
                                </>
                            ) : (
                                <p>입찰 수: 0</p>
                            )}
                        </div>

                        <div className="bid-controls">
                            <button 
                                onClick={handleDecrease} 
                                disabled={bidAmount <= (highestBid?.price + 10)}
                                className="bid-control-btn"
                            >
                                -
                            </button>
                            <input 
                                type='text' 
                                value={bidAmount} 
                                readOnly 
                            />
                            <button 
                                onClick={handleIncrease}
                                className="bid-control-btn"
                            >
                                +
                            </button>
                        </div>

                        <button 
                            onClick={onBidSubmit} 
                            className="bid-button"
                            disabled={!bidAmount || bidAmount <= highestBid?.price}
                        >
                            입찰하기
                        </button>
                    </div>
                </div>
            ) : (
                <p>상품 정보를 불러오는 중...</p>
            )}
        </div>
    );
};

export default BidPage;