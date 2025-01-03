import React, { useState, useEffect } from 'react';
import { useAuctionData } from './useAuctionData';
import './AuctionStatusPage.css';
import axios from 'axios';
import { Client } from "@stomp/stompjs";

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

    useEffect(() => {
        const serverIp = process.env.REACT_APP_SERVER_IP;
        const client = new Client({
            brokerURL: `ws://${serverIp.replace('http://', '')}/ws`,
            onConnect: () => {
                client.subscribe("/top/notifications", async (message) => {
                    alert("12");
                    if (auctionData.auctionSeq) {
                        findBidByAuctionSeq(auctionData.auctionSeq);
                    }
                });
            },
            onDisconnect: () => console.log("WebSocket 연결 종료"),
        });
    
        client.activate();
    
        return () => {
            client.deactivate();
        };
    }, [auctionData?.auctionSeq]);

    const findBidByAuctionSeq = async (auctionSeq) => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole'); // userRole 가져오기
    
        if (!token) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }

        try {
            const serverIp = process.env.REACT_APP_SERVER_IP;            
            const result = await axios.get(`${serverIp}/bidUser/${auctionSeq}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        
            if (result.data) {
                setBid(result.data);
                console.log('입찰 정보 조회 성공:', result.data);
            } else {
                console.log('입찰 정보가 없습니다.');
                setBid(null);
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
        <div className=".auction-status-page-container">
            <div className="status-header">
                <h2>경매 진행 현황</h2>
            </div>
            
            <div className="auction-info">
                <div className="current-price">
                    <h3>현재 입찰가</h3>
                    <p>{highestBid ? `${highestBid.price.toLocaleString('ko-KR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    })}원` : '입찰자 없음'}
                    </p>
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