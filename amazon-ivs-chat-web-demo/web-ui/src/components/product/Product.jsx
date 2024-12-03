import React, { useState } from 'react';
import './Product.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Statistics from './Statistics';

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
                <ul>
                <li>상품번호 : {product.stockSeq}</li>
                <li>카테고리 : {product.productCategoryContent}</li>
                <li>배송가능지역 : 전국</li>
                <li>배송비 : 3,000원</li>
                <li>판매가격 : {product.price}</li>
                </ul>
                <div className="purchase-section">
                    <div className="quantity-selector">
                        <label>구매 수량</label>
                        <div className="quantity-input-group">
                                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
                                <input 
                                    type="number" 
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
                    <button className="like-button">찜하기</button>
                    <button className="cart-button">장바구니</button>
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