import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Purchase.css';

const Purchase = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const item = location.state?.item;
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('reviews');

    if (!item) {
        return <div>상품 정보를 찾을 수 없습니다.</div>;
    }

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= item.count) {
            setQuantity(value);
        }
    };

    const handlePurchase = () => {
        navigate('/payment', { 
            state: { 
                item: item,
                quantity: quantity 
            } 
        });
    };

    return (
        <div className="purchase-container">
            <div className="product-main-section">
                <div className="product-left-section">
                    <div className="product-image-section">
                        <img src={item.file} alt={item.productName} />
                    </div>
                    <p className="product-description">{item.content}</p>
                </div>
                
                <div className="product-info-section">
                    <h2 className="product-title">{item.productName}</h2>
                    
                    <div className="product-specs">
                        <div className="spec-item">
                            <span className="spec-label">등급</span>
                            <span className="spec-value">{item.stockGrade}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">인증</span>
                            <span className="spec-value">{item.stockOrganic}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">재고</span>
                            <span className="spec-value">{item.count}개</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">가격</span>
                            <span className="spec-value price">{item.price.toLocaleString()}원</span>
                        </div>
                    </div>

                    <div className="purchase-form">
                        <div className="quantity-selector">
                            <label>구매 수량</label>
                            <div className="quantity-input-group">
                                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max={item.count}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                                <button onClick={() => quantity < item.count && setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>
                        
                        <div className="total-price">
                            <span>총 결제 금액</span>
                            <span className="total-amount">{(item.price * quantity).toLocaleString()}원</span>
                        </div>

                        <div className="action-buttons">
                            <button className="wishlist-btn">❤ 찜하기</button>
                            <button className="cart-btn">🛒 장바구니</button>
                        </div>

                        <div className="purchase-buttons">
                            <button className="purchase-btn" onClick={handlePurchase}>
                                구매하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-details-tabs">
                <div className="tab-buttons">
                    <button 
                        className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        상품 구매후기
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sales')}
                    >
                        판매 추이
                    </button>
                </div>
                
                <div className="tab-content">
                    {activeTab === 'reviews' ? (
                        <div className="reviews-section">
                            {/* ProductReviews 컴포넌트 */}
                        </div>
                    ) : (
                        <div className="sales-section">
                            {/* SalesChart 컴포넌트 */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Purchase; 