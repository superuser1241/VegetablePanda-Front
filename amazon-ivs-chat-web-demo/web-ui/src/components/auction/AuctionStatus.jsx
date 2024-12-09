import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AuctionStatus.css';

const AuctionStatus = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    const serverIp = process.env.REACT_APP_SERVER_IP;

    const fetchAuctions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${serverIp}/current`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const now = new Date();
            const activeAuctions = response.data.filter(auction => {
                const closeTime = new Date(auction.closeTime);
                return closeTime > now;
            });
            
            setAuctions(activeAuctions);
            setLoading(false);
        } catch (error) {
            console.error('경매 정보를 불러오는데 실패했습니다:', error);
            setLoading(false);
        }
    };

    // 1분마다 데이터 갱신
    useEffect(() => {
        fetchAuctions();
        const interval = setInterval(fetchAuctions, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeRemaining = (closeTime) => {
        const now = new Date();
        const end = new Date(closeTime);
        const diff = end - now;

        if (diff <= 0) return '마감됨';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}시간 ${minutes}분 남음`;
    };

    if (loading) return <div className="loading">경매 정보를 불러오는 중...</div>;

    return (
        <div className="auction-status-container">
            <div className="auction-table-container">
                <table className="auction-table">
                    <thead>
                        <tr>
                            <th>상품명</th>
                            <th>수량</th>
                            <th>현재가</th>
                            <th>입찰수</th>
                            <th>등급</th>
                            <th>인증</th>
                            <th>마감시간</th>
                            <th>남은시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auctions.map((auction) => (
                            <tr key={auction.auctionSeq}>
                                <td>{auction.productName}</td>
                                <td>{auction.content}</td>
                                <td>{auction.count}Kg</td>
                                <td>{auction.currentPrice?.toLocaleString()}원</td>
                                <td>{auction.bidCount}회</td>
                                <td>{auction.stockGrade}</td>
                                <td>{auction.stockOrganic}</td>
                                <td>{formatTime(auction.closeTime)}</td>
                                <td>{getTimeRemaining(auction.closeTime)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuctionStatus; 