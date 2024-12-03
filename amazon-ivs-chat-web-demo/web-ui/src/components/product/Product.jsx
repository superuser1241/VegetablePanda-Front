import React, { useState } from 'react';
import './Product.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Statistics from './Statistics';
import axios from 'axios';

const Product = () => {

    const [activeTab, setActiveTab] = useState("details");
    const { state } = useLocation();
    const { stockSeq } = useParams();
    const product = state?.product;  // 전달받은 상품 정보
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(1);

    const navigate = useNavigate();

    const renderTabContent = () => {
        switch (activeTab) {
            case "details":
                return (
                    <div className="tab-section-content" id="details">
                        <h2>상세정보</h2>
                        <p>{product.content}</p>
                    </div>
                );
            case "reviews":
                return (
                    <div className="tab-section-content" id="reviews">
                        <h2>후기</h2>
                        <p>리뷰 정보가 여기에 표시됩니다.</p>
                    </div>
                );
            case "stats":
                return (
                    <div className="tab-section-content" id="stats">
                        <h2>통계</h2>
                        <Statistics stockSeq={stockSeq} />
                    </div>
                );
            default:
                return null;
        }
    };

    const scrollToSection = (sectionId) => {
        setActiveTab(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= product.count) {
            setQuantity(value);
        }
    };

    const handlePrice = (e) => {

    }

    const handleAddToCart = async () => {
        try {
            // 현재 장바구니 상태 확인
            const cartResponse = await axios.get('http://localhost:9001/api/cart', { withCredentials: true });
            const cartItems = cartResponse.data;
            const isInCart = cartItems.some(item => item.stockSeq === product.stockSeq);

            if (isInCart) {
                // 이미 장바구니에 있으면 삭제
                await axios.delete(`http://localhost:9001/api/cart/${product.stockSeq}`, { withCredentials: true });
                alert('장바구니에서 제거되었습니다.');
                return;
            }

            // 장바구니에 없으면 추가
            const response = await axios.post('http://localhost:9001/api/cart/add', 
                null,  // POST body는 없음
                {
                    params: {
                        stockSeq: product.stockSeq,
                        quantity: quantity
                    },
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            if (response.data) {
                alert('장바구니에 추가되었습니다.');
            }
        } catch (error) {
            console.error('장바구니 추가 실패:', error);
            alert(error.response?.data?.error || '장바구니 추가에 실패했습니다.');
        }
    };

    return (
        <div className='product-container'>
            <div className='product-category'>
                {product.productCategoryContent} {'>'} {product.productName}
            </div>
            <div className="product-details">
            
            {/* 상품 이미지 */}
            <div className="product-image">
                <img
                src = {product.file ? product.file : 'https://placehold.co/200x200?text=vegetable'}
                alt = {product.productName}
                />
            </div>

            {/* 상품 정보 */}
            <div className="product-info">
                <h1>{product.productName}</h1>
                <hr/>
                <div className='product-specs'>
                    <div className='spec-item'>
                        <span className='spec-label'>상품번호 </span>
                        <span className='spec-value'>{product.stockSeq}</span>
                    </div>
                    <div className='spec-item'>
                        <span className='spec-label'>카테고리 </span>
                        <span className='spec-value'>{product.productCategoryContent}</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-label">등급</span>
                        <span className="spec-value">{product.stockGrade}</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-label">인증</span>
                        <span className="spec-value">{product.stockOrganic}</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-label">재고</span>
                        <span className="spec-value">{product.count}개</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-label">판매가격</span>
                        <span className="spec-value">{product.price.toLocaleString()}원</span>
                    </div>    
                    <div className="spec-item">
                        <span className="spec-label">배송비</span>
                        <span className="spec-value">3,000원</span>
                    </div>    
                </div>
                <div className="purchase-section">
                    <div className="quantity-selector">
                        <label>구매 수량</label>
                        <div className="quantity-input-group">
                                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
                                <input 
                                    type="text" 
                                    min="1" 
                                    max={product.count}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                                <button onClick={() => quantity < product.count && setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>
                <div className="total-price">
                            <span>총 결제 금액 </span>
                            <span className="total-amount">{(product.price * quantity).toLocaleString()}원</span>
                        </div>
                <div className='button-container'>
                    <button className="like-btn">찜하기</button>
                    <button className="cart-button" onClick={handleAddToCart}>장바구니</button>
                </div>
                    <button className="product-buy-button" onClick={() => navigate('/payment', { state: { item:product, quantity } })}>구매</button>
                
                </div>
            </div>

            {/* 탭 영역 */}
            <div className="tab-section">
                <div className="tabs">
                <button
                    className={activeTab === "details" ? "active" : ""}
                    onClick={() => scrollToSection("details")}
                >
                    상세정보
                </button>
                <button
                    className={activeTab === "reviews" ? "active" : ""}
                    onClick={() => scrollToSection("reviews")}
                >
                    후기
                </button>
                <button
                    className={activeTab === "stats" ? "active" : ""}
                    onClick={() => scrollToSection("stats")}
                >
                    통계
                </button>
                </div>
                <div className="tab-content">{renderTabContent()}</div>
            </div>
            </div>
            
        </div>
    );
};

export default Product;