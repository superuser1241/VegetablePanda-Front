import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Purchase.css';
import productImage from '../../image/상품1.png';

const Purchase = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const item = location.state?.item;
    const [quantity, setQuantity] = useState(1);

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
            <h2>상품 구매</h2>
            <div className="purchase-details">
                <div className="product-info">
                    <div className="product-image">
                        <img src={item.file} alt={item.productName} />
                    </div>
                    <h3>{item.productName}</h3>
                    <p className="description">{item.content}</p>
                    <div className="specs">
                        <p><span>등급:</span> {item.stockGrade}</p>
                        <p><span>인증:</span> {item.stockOrganic}</p>
                        <p><span>재고:</span> {item.count}개</p>
                        <p><span>가격:</span> {item.price.toLocaleString()}원</p>
                    </div>
                </div>
                
                <div className="purchase-form">
                    <div className="quantity-selector">
                        <label>구매 수량:</label>
                        <input 
                            type="number" 
                            min="1" 
                            max={item.count}
                            value={quantity}
                            onChange={handleQuantityChange}
                        />
                    </div>
                    
                    <div className="total-price">
                        <h4>총 결제 금액:</h4>
                        <p>{(item.price * quantity).toLocaleString()}원</p>
                    </div>

                    <div className="buttons">
                        <button className="cancel-btn" onClick={() => navigate('/')}>
                            취소
                        </button>
                        <button className="purchase-btn" onClick={handlePurchase}>
                            구매하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Purchase; 