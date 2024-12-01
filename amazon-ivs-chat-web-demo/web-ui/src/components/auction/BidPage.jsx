import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuctionData } from './useAuctionData';
import { useBidding } from './useBidding';
import './BidPage.css';

const BidPage = ({ streamingRoom, auctionData, onAuctionEnd, onOpenModal }) => {
    const [isAuctionEnded, setIsAuctionEnded] = useState(false);
    const [remainingTime, setRemainingTime] = useState('');
    

    const calculateRemainingTime = (closeTime) => {
        const now = new Date();
        const endTime = new Date(closeTime);
        const diff = endTime - now;

        if (diff <= 0) {
            return '경매 종료';
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (hours > 0) {
            return `${hours}시간 ${minutes}분 ${seconds}초`;
        }
        return `${minutes}분 ${seconds}초`;
    };

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

    useEffect(() => {
        if (auctionData?.closeTime) {
            const timer = setInterval(() => {
                setRemainingTime(calculateRemainingTime(auctionData.closeTime));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [auctionData?.closeTime]);

    console.log('BidPage streamingRoom:', streamingRoom); // 디버깅용

    const { highestBid, auction, bid } = useAuctionData(streamingRoom.farmerSeq,auctionData.auctionSeq); // userSeq 5로 하코딩된 값 사용
    const { auctionSeq } = useParams();
    const { bidAmount, handleIncrease, handleDecrease, handleBid } = useBidding(highestBid, auctionData.auctionSeq);

    const onBidSubmit = async () => {
        console.log('입찰 시도:', { bidAmount, auctionId: auctionSeq });
        await handleBid();
    };
    if (!auctionData || !auctionData.auctionSeq) {
        return <div>경매 정보를 불러오는 중...</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\./g, '-');
    };

    return (
        
        <>
            {/* <AllBidNotiSet/> */}
            {highestBid ? (
                <>
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
                            <p>{formatDate(auction?.closeTime)}</p>
                        </div>

                    </div>
                                            <div className="remaining-time">
                            <h3>남은 시간</h3>
                            <p>{remainingTime}</p>
                        </div>
                    <div>
                        <>
                            {bid ? (
                                <div className="bid-status">
                                    <span>입찰 횟수: {bid.length}</span>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onOpenModal(bid);
                                        }}
                                        className="bid-link"
                                    >
                                        [입찰 확인]
                                    </button>
                                </div>
                            ) : (
                                <div className="bid-status">
                                    <span>입찰 수: 0</span>
                                </div>
                            )}
                        </>

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
                </>
            ) : (
                <p>상품 정보를 불러오는 중...</p>
            )}
        </>
    );
};

export default BidPage;