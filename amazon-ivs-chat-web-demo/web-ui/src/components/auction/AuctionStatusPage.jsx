import React, { useState, useEffect } from 'react';
import { useAuctionData } from './useAuctionData';
import './AuctionStatusPage.css';

const AuctionStatusPage = ({ streamingRoom, auctionData ,onOpenModal, onEndAuction}) => {
    const { highestBid, auction, bid } = useAuctionData(
        streamingRoom.farmerSeq,
        auctionData.auctionSeq
    );
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
            const timer = setInterval(() => {
                setRemainingTime(calculateRemainingTime(auctionData.closeTime));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [auctionData?.closeTime]);

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
        <div className="auction-status-container">
            <div className="status-header">
                <h2>경매 진행 현황</h2>
            </div>
            
            <div className="auction-info">
                <div className="current-price">
                    <h3>현재 입찰가</h3>
                    <p>{highestBid ? `${highestBid.price}원` : '입찰자 없음'}</p>
                </div>
                <div className="quantity">
                    <h3>수량</h3>
                    <p>{auctionData.count}개</p>
                </div>
            </div>
            <div className="time-left">
                    <h3>종료 일자</h3>
                    <p>{formatDate(auctionData.closeTime)}</p>
                </div>
            <div className="remaining-time">
                <h3>남은 시간</h3>
                <p>{remainingTime}</p>
            </div>

            <div className="bid-status">
                <span>총 입찰 횟수: {bid ? bid.length : 0}</span>
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

            <button 
                className="end-auction-button"
                onClick={() => {
                    if (window.confirm('경매를 종료하시겠습니까?')) {
                        onEndAuction();
                    }
                }}
            >
                판매 종료
            </button>
        </div>
    );
};

export default AuctionStatusPage; 