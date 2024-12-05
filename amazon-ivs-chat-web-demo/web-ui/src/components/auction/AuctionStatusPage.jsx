import React, { useState, useEffect } from 'react';
import { useAuctionData } from './useAuctionData';
import './AuctionStatusPage.css';
import axios from 'axios';

const AuctionStatusPage = ({ streamingRoom, auctionData ,onOpenModal, onEndAuction}) => {
    const { highestBid, auction } = useAuctionData(
        streamingRoom.farmerSeq,
        auctionData.auctionSeq
    );
    
    const [remainingTime, setRemainingTime] = useState('');
    const [bid, setBid] = useState(null);

    useEffect(() => {
        if (auctionData?.auctionSeq) {
            findBidByAuctionSeq(auctionData.auctionSeq);
        }
    }, [auctionData?.auctionSeq]);

    const findBidByAuctionSeq = async (auctionSeq) => {
        const token = localStorage.getItem('token');
        try {
            const serverIp = process.env.REACT_APP_SERVER_IP;
            const currentHour = new Date().getHours(); // 현재 시간 (24시간 형식)
        
            let result;
            if (currentHour >= 18 || currentHour < 24) { // 오후 6시 ~ 자정
                result = await axios.get(`${serverIp}/bidCom/${auctionSeq}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('법인 경매 시간 - bidCom API 호출');
            } else if (currentHour >= 13 && currentHour < 18) { // 오후 1시 ~ 오후 6시
                result = await axios.get(`${serverIp}/bidUser/${auctionSeq}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('개인 경매 시간 - bidUser API 호출');
            } else {
                console.log('경매 시간이 아닙니다');
                return; // 경매 시간이 아닐 경우 API 호출하지 않음
            }
            
            setBid(result.data);
            console.log('설정된 데이터:', result.data);

        } catch (error) {
            console.error('입찰 정보 조회 실패:', error);
            if (error.response?.status === 401) {
                alert('로그인이 필요한 서비스입니다.');
            }
        }
    };

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