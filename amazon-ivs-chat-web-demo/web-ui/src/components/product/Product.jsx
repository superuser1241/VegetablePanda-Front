import React, { useState, useEffect } from 'react';
import './Product.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Statistics from './Statistics';
import axios from 'axios';
import ReviewSummary from './ReviewSummary';
import ReviewDetail from './ReviewDetail';
import apple2 from '../../image/사과2.jpeg';
import grape2 from '../../image/포도2.jpeg';

const Product = () => {

    const [activeTab, setActiveTab] = useState("details");
    const { state } = useLocation();
    const { stockSeq } = useParams();
    const product = state?.product;  // 전달받은 상품 정보
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(1);
    const [shopLike, setShopLike] = useState(false);
    const [reviewList, setReviewList] = useState([]);
    const [reviewStatistics, setReviewStatistics] = useState({});
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();
    const serverIp = process.env.REACT_APP_SERVER_IP;
    const [isInitialLoad, setIsInitialLoad] = useState(true);


    const renderTabContent = () => {
        switch (activeTab) {
            case "details":
                return (
                    <div className="tab-section-content" id="details">
                        <div className="product-detail-content">
                            {product.stockSeq === 3 ? (
                                <>
                                    <div className="product-top-section">
                                        <div className="product-image-detail">
                                            <img src={apple2} alt="사과 상세 이미지" />
                                        </div>
                                        <div className="product-main-description">
                                            <h3>청송 사과</h3>
                                            <p>
                                                청송의 맑은 공기와 풍부한 일조량으로 재배된 프리미엄 사과입니다.
                                                단단하고 아삭한 식감과 높은 당도가 특징이며, 과즙이 풍부합니다.
                                                엄격한 품질 관리를 통해 선별된 최상품 사과만을 제공합니다.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="product-specs-section">
                                        <div className="specs-grid">
                                            <div className="spec-item-large">
                                                <div className="spec-label-large">당도</div>
                                                <div className="spec-value-large">14~15 Brix</div>
                                            </div>
                                            <div className="spec-item-large">
                                                <div className="spec-label-large">크기</div>
                                                <div className="spec-value-large">300g 내외</div>
                                            </div>
                                            <div className="spec-item-large">
                                                <div className="spec-label-large">보관방법</div>
                                                <div className="spec-value-large">0~5℃</div>
                                            </div>
                                            <div className="spec-item-large">
                                                <div className="spec-label-large">원산지</div>
                                                <div className="spec-value-large">청송군</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : product.stockSeq === 27 ? (
                                <>
                                    <div className="product-top-section">
                                        <div className="product-image-detail">
                                            <img src={grape2} alt="포도 상세 이미지" />
                                        </div>
                                        <div className="product-main-description">
                                            <h3>프리미엄 포도</h3>
                                            <p>
                                                달콤한 향과 맛이 특징인 프리미엄 포도입니다.
                                                씨가 없고 껍질째 먹을 수 있어 편리하며, 높은 당도와 아삭한 식감이 특징입니다.
                                                엄선된 농장에서 재배되어 품질이 우수합니다.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="product-specs-section">
                                        <div className="specs-grid">
                                            <div className="spec-item-large">
                                                <div className="spec-label-large">당도</div>
                                                <div className="spec-value-large">15~16 Brix</div>
                                            </div>
                                            <div className="spec-item-large">
                                                <div className="spec-label-large">중량</div>
                                                <div className="spec-value-large">2kg 내외</div>
                                            </div>
                                            <div className="spec-item-large">
                                                <div className="spec-label-large">보관방법</div>
                                                <div className="spec-value-large">0~5℃</div>
                                            </div>
                                            <div className="spec-item-large">
                                                <div className="spec-label-large">원산지</div>
                                                <div className="spec-value-large">국내산</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p>{product.content}</p>
                            )}
                        </div>
                    </div>
                );
            case "reviews":
                return (
                    <div className="tab-section-content" id="reviews">
                        <h2>후기</h2>
                        <ReviewSummary averageRating = {reviewStatistics.averageRating} totalReviews = {reviewStatistics.reviewCount}/>
                        <ReviewDetail reviews = {reviewList}/>
                    </div>
                );
            case "stats":
                return (
                    <div className="tab-section-content" id="stats">
                        <h2>통계</h2>

                        <Statistics stockSeq={product.stockSeq} />
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

    const handleLike = async (shopSeq) => {
        const userSeq = localStorage.getItem('userSeq');
        const token = localStorage.getItem('token');
        
        try {
            const response = await axios.post(
                `${serverIp}/api/insertShopLike`,
                {
                    userSeq: userSeq,
                    shopSeq: shopSeq
                },
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            console.log(response.data.state);

            if(response.data.state===true) {
                alert('찜하기가 완료되었습니다.');
            } else {
                alert('찜하기가 취소되었습니다.');
            }

            setShopLike(response.data);
        } catch (err) {
            console.error('찜하기 처리에 실패했습니다:', err);
        }
    }

    const getShopLike = async (shopSeq) => {
        const userSeq = localStorage.getItem('userSeq');
        const token = localStorage.getItem('token');
        console.log('shopSeq', shopSeq);
        try {
            const response = await axios.get(
                `${serverIp}/api/getShopLike?userSeq=${userSeq}&shopSeq=${shopSeq}`,    
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log('찜하기 상태:', response.data);
            
            setShopLike(response.data);
            
        } catch (err) {
            console.error('찜하기 상태 조회에 실패했습니다:', err);
        }
    }

    const fetchReviewList = async () => {
        try {
            const response = await axios.get(
                `${serverIp}/stock/review?stockSeq=${product.stockSeq}`
            );
    
            console.log(response.data);
            setReviewList(response.data);
    
        } catch (err) {
            console.error("리뷰 목록 조회 에러 : ", err);
        }
    }
    

    const fetchReviewStatistics = async () => {
        try {
            const response = await axios.get(
                `${serverIp}/stock/reviewStatistics?stockSeq=${product.stockSeq}`
            );
    
            console.log('평균평점');
            console.log(response.data);
            setReviewStatistics(response.data);
    
        } catch (err) {
            console.error("리뷰 통계 조회 에러 : ", err);
        }
    }

    useEffect(() => {
        const fetchShopLike = async () => {
            if (product?.shopSeq && isInitialLoad) {
                const result = await getShopLike(product.shopSeq);
                setShopLike(result);
                setIsInitialLoad(false);
            }
        };
        fetchShopLike();
    }, [product?.shopSeq]);

    useEffect(() => {
        console.log('shopLike 상태 변경됨:', shopLike);
        setShopLike(shopLike);
    }, [shopLike]);

    useEffect(() => {
        console.log('Review 상태 변경됨:', shopLike);
        fetchReviewList();
        fetchReviewStatistics();
    }, []);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= product.count) {
            setQuantity(value);
        }
    };

    // const handlePrice = (e) => {

    // }

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        const userSeq = localStorage.getItem('userSeq');
        
        if (!token || !userSeq) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        try {
            // 백엔드에서 상품 정보 받아오기
            const response = await axios.post(`${serverIp}/api/cart/add`, null, {
                params: {
                    stockSeq: product.stockSeq,
                    quantity: quantity,
                    userSeq: userSeq
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // 로컬스토리지에 장바구니 저장
            const cartKey = `cart_${userSeq}`;
            const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            
            const existingItem = existingCart.find(item => item.stockSeq === product.stockSeq);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                existingCart.push(response.data);
            }

            localStorage.setItem(cartKey, JSON.stringify(existingCart));
            alert('장바구니에 추가되었습니다.');

        } catch (error) {
            console.error('장바구니 작업 실패:', error);
            if (error.response?.status === 401) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/login');
            } else {
                alert(error.response?.data?.error || '장바구니 작업에 실패했습니다.');
            }
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
                    <button 
                        className={`like-btn ${shopLike ? 'active' : ''}`}
                        onClick={() => handleLike(product.shopSeq)}
                    >
                        찜하기
                    </button>
                    <button className="cart-button" onClick={handleAddToCart}>장바구니</button>
                </div>
                    <button className="product-buy-button" onClick={() => userRole === 'ROLE_USER' ? navigate('/payment', { state: { item:product, quantity } }) : alert('일반 사용자만 구매 가능합니다.')}>구매</button>
                
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