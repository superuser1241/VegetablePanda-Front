import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PriceCheckModal from './PriceCheckModal';
import SalesHistoryModal from './SalesHistoryModal';

const AuctionRegisterPage = ({ 
    streamingRoom, 
    onRegisterSuccess, 
    onCheckPrice, 
    onCheckSalesHistory 
}) => {
    const navigate = useNavigate();
    const [auctionData, setAuctionData] = useState({
        count: '',
        closeTime: '',
        stockSeq: streamingRoom?.stockSeq
    });
    const [pricePerKg, setPricePerKg] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [priceInfo, setPriceInfo] = useState(null);
    const [showSalesModal, setShowSalesModal] = useState(false);
    const [salesHistory, setSalesHistory] = useState(null);

    useEffect(() => {
        if (streamingRoom?.stockSeq) {
            setAuctionData(prev => ({
                ...prev,
                stockSeq: streamingRoom.stockSeq
            }));
        }
    }, [streamingRoom]);

    useEffect(() => {
        const price = parseFloat(pricePerKg) || 0;
        const count = parseFloat(auctionData.count) || 0;
        setTotalPrice(price * count);
    }, [pricePerKg, auctionData.count]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'pricePerKg') {
            setPricePerKg(value);
        } else {
            setAuctionData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onRegisterSuccess({
                count: auctionData.count,
                closeTime: auctionData.closeTime,
                stockSeq: auctionData.stockSeq,
                totalPrice: totalPrice
            });
            
        } catch (error) {
            console.error('경매 등록 실패:', error);
            alert('경매 등록에 실패했습니다.');
        }
    };
    
    const getTodayStart = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}T09:00`;
    };

    const getTodayEnd = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}T24:00`;
    };

    const checkPrice = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:9001/price/${streamingRoom.productName}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            setPriceInfo(response.data);
            console.log(response.data);
            setShowPriceModal(true);
        } catch (error) {
            console.error('가격 정보 조회 실패:', error);
            alert('가격 정보를 가져오는데 실패했습니다.');
        }
    };

    const checkSalesHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:9001/buy/${streamingRoom.stockSeq}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            setSalesHistory(response.data);
            setShowSalesModal(true);
        } catch (error) {
            console.error('판매 기록 조회 실패:', error);
            alert('판매 기록을 가져오는데 실패했습니다.');
        }
    };


    return (
        <div className="auction-register-container">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div>
                    <h2>경매 등록</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>kg당 가격</label>
                            <input
                                type="number"
                                name="pricePerKg"
                                value={pricePerKg}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>수량 (kg)</label>
                            <input
                                type="number"
                                name="count"
                                value={auctionData.count}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>총 가격</label>
                            <input
                                type="text"
                                value={`${totalPrice.toLocaleString()}원`}
                                readOnly
                                style={{ backgroundColor: '#f5f5f5' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>종료 시간 (최전 9시 ~ 오후 1시 사이 선택)</label>
                            <input
                                type="datetime-local"
                                name="closeTime"
                                value={auctionData.closeTime}
                                onChange={handleChange}
                                min={getTodayStart()}
                                max={getTodayEnd()}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button 
                                type="submit" 
                                style={{
                                    flex: '1',
                                    padding: '10px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                경매 등록
                            </button>
                            <button 
                                type="button"
                                onClick={checkPrice}
                                style={{
                                    padding: '10px',
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
                                onClick={checkSalesHistory}
                                style={{
                                    padding: '10px',
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                판매 기록
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <PriceCheckModal 
                isOpen={showPriceModal}
                onClose={() => setShowPriceModal(false)}
                priceInfo={priceInfo}
            />
            
            <SalesHistoryModal 
                isOpen={showSalesModal}
                onClose={() => setShowSalesModal(false)}
                salesHistory={salesHistory}
            />
        </div>
    );
};

export default AuctionRegisterPage; 