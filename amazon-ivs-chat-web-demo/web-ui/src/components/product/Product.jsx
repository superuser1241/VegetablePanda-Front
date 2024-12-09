import React, { useState, useEffect } from 'react';
import './Product.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Statistics from './Statistics';
import axios from 'axios';
import ReviewSummary from './ReviewSummary';
import ReviewDetail from './ReviewDetail';

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
                        <h2>상세정보</h2>
                        <p>{product.content}</p>
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
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(
                `${serverIp}/stock/review?stockSeq=${product.stockSeq}`,
                {
                  headers: { 
                    'Authorization': `Bearer ${token}`,
                  }
                }
            );

            console.log(response.data);
            setReviewList(response.data);

        } catch (err) {
            console.error("리뷰 목록 조회 에러 : ", err);
        }

    }

    const fetchReviewStatistics = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(
                `${serverIp}/stock/reviewStatistics?stockSeq=${product.stockSeq}`,
                {
                  headers: { 
                    'Authorization': `Bearer ${token}`,
                  }
                }
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
            // 현재 장바구니 상태 확인
            const cartResponse = await axios.get(
                `${serverIp}/api/cart`, 
                {
                    params: { userSeq },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            const cartItems = cartResponse.data;
            const isInCart = cartItems.some(item => item.stockSeq === product.stockSeq);

            if (isInCart) {
                // 이미 장바구니에 있으면 삭제
                await axios.delete(
                    `${serverIp}/api/cart/${product.stockSeq}`,
                    {
                        params: { userSeq },
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );
                alert('장바구니에서 제거되었습니다.');
                return;
            }

            // 장바구니에 없으면 추가
            const response = await axios.post(
                `${serverIp}/api/cart/add`,
                null,
                {
                    params: {
                        stockSeq: product.stockSeq,
                        quantity: quantity,
                        userSeq: userSeq
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            if (response.data) {
                alert('장바구니에 추가되었습니다.');
            }
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
                        className={`like-btn ${shopLike?.state ? 'active' : ''}`} 
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