import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AuctionStock.css';

const AuctionStock = ({ streamingRoom }) => {
    const [stockInfo, setStockInfo] = useState(null);

    useEffect(() => {
        const findStockById = async () => {
            const token = localStorage.getItem('token');
            try {
                const result = await axios.get(
                    `http://localhost:9001/auctionStock/${streamingRoom.farmerSeq}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setStockInfo(result.data);
            } catch (error) {
                console.error('사용자 정보 조회 실패:', error);
                if (error.response?.status === 401) {
                    alert('로그인이 필요한 서비스입니다.');
                }
            }
        };
        findStockById();
    }, []);

    return (
        <>
            {stockInfo && (
                <div className="auction-info">
                    <div className="product-image-section">
                        <img src={stockInfo.filePath} alt={stockInfo.productName} />
                    </div>
                    
                    <div className="product-details-section">
                        <div className="product-info-list">
                            <div className="product-info-item">
                                <div className="info-label">상품명</div>
                                <div className="info-value">{stockInfo.productName}</div>
                            </div>

                            <div className="product-info-item">
                                <div className="info-label">상품 설명</div>
                                <div className="info-value">{stockInfo.content}</div>
                            </div>

                        <div className="product-info-item">
                            <div className="info-label">남은 재고량 </div>
                            <div className="info-value">{stockInfo.count}개</div>
                        </div>

                            <div className="product-info-item">
                                <div className="info-label">색상</div>
                                <div className="info-value">{stockInfo.color}</div>
                            </div>
                        </div>

                        <div className="seller-section">
                            <div className="seller-title">판매자 정보</div>
                            <div className="seller-info">
                                <div className="seller-info-item">
                                    <div className="info-label">판매자</div>
                                    <div className="info-value">{stockInfo.farmerUserName}</div>
                                </div>
                                
                                <div className="seller-info-item">
                                    <div className="info-label">등급</div>
                                    <div className="info-value">{stockInfo.farmerUserGrade}</div>
                                </div>
                                
                                <div className="seller-info-item">
                                    <div className="info-label">연락처</div>
                                    <div className="info-value">{stockInfo.farmerUserPhone}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AuctionStock;
