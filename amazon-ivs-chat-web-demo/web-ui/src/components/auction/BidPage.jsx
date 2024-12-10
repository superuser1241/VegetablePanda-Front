import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuctionData } from './useAuctionData';
import { useBidding } from './useBidding';
import './BidPage.css';
import axios from 'axios';

const serverIp = process.env.REACT_APP_SERVER_IP;

const BidPage = ({ 
    streamingRoom, 
    auctionData, 
    onAuctionEnd, 
    onOpenModal, 
    onCheckPrice, 
    onCheckSalesHistory,
    userRole 
}) => {
    const [isAuctionEnded, setIsAuctionEnded] = useState(false);
    const [remainingTime, setRemainingTime] = useState('');
    const [pricePerKg, setPricePerKg] = useState(0);
    const [bid, setBid] = useState(null);
    const [userWallet, setUserWallet] = useState(null);

    useEffect(() => {
        const fetchUserWallet = async () => {
            try {
                const userSeq = localStorage.getItem('userSeq');
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${serverIp}/userTempWallet/${userSeq}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );
                setUserWallet(response.data);
                console.log('User wallet:', response.data);
            } catch (error) {
                console.error('임시 지갑 정보 조회 실패:', error);
            }
        };
        fetchUserWallet();
    }, [bid]);


    const calculateRemainingTime = (closeTime) => {
        const now = new Date();
        const endTime = new Date(closeTime);
        const diff = endTime - now;
        console.log('롤',userRole);
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

    const { highestBid, auction } = useAuctionData(streamingRoom.farmerSeq, auctionData.auctionSeq);
    const { bidAmount, setBidAmount, handleBid } = useBidding(highestBid, auctionData.auctionSeq);
    console.log('useBidding return values:', { bidAmount, setBidAmount, handleBid }); // 디버깅용

    useEffect(() => {
        if (auction?.count && bidAmount) {
            const calculatedPricePerKg = Math.floor(bidAmount / auction.count);
            setPricePerKg(calculatedPricePerKg);
        }
        if (auctionData?.auctionSeq) {
            findBidByAuctionSeq(auctionData.auctionSeq);
        }
    }, [bidAmount, auction?.count,auctionData?.auctionSeq]);

    useEffect(() => {
        if (highestBid) {
            // 최고 입찰가가 변경될 때마다 입찰 기록 갱신
            findBidByAuctionSeq(auctionData.auctionSeq);
        }
    }, [highestBid]);

    const findBidByAuctionSeq = async (auctionSeq) => {
        const token = localStorage.getItem('token');
        try {
            const serverIp = process.env.REACT_APP_SERVER_IP;
            const currentHour = new Date().getHours(); // 현재 시간 (24시간 형식)
        
            const result = await axios.get(`${serverIp}/bidUser/${auctionSeq}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
            });
            
            setBid(result.data);
            console.log('설정된 데이터:', result.data);

        } catch (error) {
            console.error('입찰 정보 조회 실패:', error);
            if (error.response?.status === 401) {
                alert('로그인이 필요한 서비스입니다.');
            }
        }
    };

    const handlePriceChange = (amount) => {
        const newBidAmount = bidAmount + amount;
        if (newBidAmount > (highestBid?.price || 0)) {
            handleBidAmountChange(newBidAmount);
        }
    };

    const handleBidAmountChange = (newAmount) => {
        if (newAmount > (highestBid?.price || 0)) {
            setBidAmount(newAmount);
        }
    };

    const onBidSubmit = async () => {
        console.log('입찰 시도:', { bidAmount, auctionId: auctionData.auctionSeq });
        const success = await handleBid();
        if (success) {
            // 입찰 성공 후 입찰 기록 다시 불러오기
            await findBidByAuctionSeq(auctionData.auctionSeq);
        }
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
                        <table className="auction-info-table">
                            <tbody>
                                <tr>
                                    <th>현재 입찰가</th>
                                    <td>{highestBid.price.toLocaleString()}원</td>
                                </tr>
                                <tr>
                                    <th>수량</th>
                                    <td>{auction?.count}</td>
                                </tr>
                                <tr>
                                    <th>종료 일자</th>
                                    <td>{formatDate(auction?.closeTime)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                    <div className="remaining-time">
                        <h3>남은 시간</h3>
                        <p>{remainingTime}</p>
                    </div>
                    <div>
                            <div className="bid-status">
                                {bid ? (
                                    <div>
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
                                    <span>입찰 수: 0</span>
                                )}
                            </div>
                            
                    <div className="bid-controls-wrapper">
                        <div className="available-points-container">
                            <span>사용 가능 포인트:</span>
                            <span className="point-amount">{userWallet ? `${userWallet.point.toLocaleString()}원` : '로딩 중...'}</span>
                        </div>
                        
                        <div className="bid-controls">
                            <button 
                                onClick={() => handlePriceChange(-10)} 
                                disabled={bidAmount <= (highestBid?.price + 10)}
                                className="bid-control-btn"
                            >
                                -
                            </button>
                            <div className="bid-amount-display">
                                <input 
                                    type='text' 
                                    value={`${bidAmount.toLocaleString()}원`} 
                                    readOnly 
                                />
                                <div className="price-details">
                                    <span className="price-per-kg">
                                        (kg당 {pricePerKg.toLocaleString()}원)
                                    </span>
                                    
                                    {userRole === 'ROLE_COMPANY' && (
                                        <span className="price-deposit">
                                            선금 포인트 {Math.floor(bidAmount * 0.1).toLocaleString()}원
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={() => handlePriceChange(10)}
                                className="bid-control-btn"
                            >
                                +
                            </button>
                        </div>
                    </div>
                            <button 
                                onClick={onBidSubmit} 
                                className="bid-button"
                                disabled={!bidAmount || bidAmount <= highestBid?.price}
                            >
                                입찰하기
                            </button>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button 
                                    type="button"
                                    onClick={onCheckPrice}
                                    style={{
                                        flex: '1',
                                        padding: '8px',
                                        backgroundColor: '#f0f0f0',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    가격 확인
                                </button>
                                <button 
                                    type="button"
                                    onClick={onCheckSalesHistory}
                                    style={{
                                        flex: '1',
                                        padding: '8px',
                                        backgroundColor: '#f0f0f0',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    판매 기록
                                </button>
                            </div>
                    </div>
                </>
            ) : (
                <p>상품 정보를 불러오는 중...</p>
            )}
        </>
    );
};

export default BidPage;