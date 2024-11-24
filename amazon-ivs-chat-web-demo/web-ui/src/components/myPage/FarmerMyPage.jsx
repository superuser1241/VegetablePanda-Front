import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FarmerMyPage.css';

const FarmerMyPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [userId, setUserId] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [editedUser, setEditedUser] = useState({
        password: '',
        name: '',
        address: '',
        phone: '',
        email: ''
    });
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('product'); // 기본 탭을 product로 변경
    const [newProduct, setNewProduct] = useState({
        color: '',
        count: '',
        status: 2,
        content: '',
        productSeq: '',
        stockGradeSeq: '',
        stockOrganicSeq: ''
    });
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserId(payload.user_seq);
                // fetchUserInfo(payload.user_seq);  // 회원정보 조회 주석
            } catch (error) {
                console.error('토큰 파싱 실패:', error);
            }
        }
    }, [token]);

    /*
    useEffect(() => {
        if (userInfo) {
            setEditedUser({
                password: '',
                name: userInfo.name,
                address: userInfo.address,
                phone: userInfo.phone,
                email: userInfo.email
            });
        }
    }, [userInfo]);

    useEffect(() => {
        if (userId) {
            fetchUserInfo(userId);
            fetchReviews(userId);
        }
    }, [userId]);
    */

    useEffect(() => {
        if (token) {
            fetchProducts();
        }
    }, [token]);

    /*
    const fetchUserInfo = async (seq) => {
        try {
            const response = await axios.get(`http://localhost:9001/myPage/list/${seq}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setUserInfo(response.data);
        } catch (error) {
            console.error('회원 정보 조회 실패:', error);
        }
    };

    const fetchReviews = async (seq) => {
        try {
            const response = await axios.get(`http://localhost:9001/myPage/review/${seq}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(response.data);
        } catch (error) {
            console.error('리뷰 조회 실패:', error);
        }
    };

    const handleEditSubmit = async () => {
        try {
            const updateData = {
                name: editedUser.name,
                address: editedUser.address,
                phone: editedUser.phone,
                email: editedUser.email
            };

            if (editedUser.password.trim() !== '') {
                updateData.password = editedUser.password;
            }

            const response = await axios.post(`http://localhost:9001/myPage/update/${userId}`, 
                updateData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            
            alert('회원정보가 수정되었습니다.');
            fetchUserInfo(userId);
        } catch (error) {
            console.error('회원정보 수정 실패:', error);
            alert('회원��� 수정에 실패했습니다.');
        }
    };
    */

    const filteredProducts = selectedCategory 
        ? products.filter(product => product.productCategorySeq === parseInt(selectedCategory))
        : products;

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:9001/product', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setProducts(response.data);
            console.log("상품 목록:", response.data);
        } catch (error) {
            console.error('상품 목록 조회 실패:', error);
        }
    };

    const handleProductSubmit = async () => {
        try {
            // URL에 쿼리 파라미터 추가
            const url = `http://localhost:9001/stock?productSeq=${newProduct.productSeq}&stockGradeSeq=${newProduct.stockGradeSeq}&stockOrganicSeq=${newProduct.stockOrganicSeq}&farmerSeq=${userId}`;
            
            // body 데이터
            const stockData = {
                color: parseInt(newProduct.color),
                count: parseInt(newProduct.count),
                content: newProduct.content,
                status: 2
            };

            console.log('요청 URL:', url);
            console.log('요청 데이터:', stockData);

            const response = await axios.post(
                url,
                stockData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                alert('상품이 등록되었습니다. 관리자 승인 후 판매가 시작됩니다.');
                setNewProduct({
                    color: '',
                    count: '',
                    status: 2,
                    content: '',
                    productSeq: '',
                    stockGradeSeq: '',
                    stockOrganicSeq: ''
                });
                setSelectedCategory('');
            }
        } catch (error) {
            console.error('상품 등록 실패:', error);
            console.error('요청 URL:', error.config?.url);
            console.error('요청 데이터:', error.config?.data);
        }
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="farmer-mypage">
            <div className="mypage-container">
                <div className="sidebar">
                    <h3>마이페이지 메뉴</h3>
                    <ul>
                        <li 
                            onClick={() => setActiveTab('info')}
                            className={activeTab === 'info' ? 'active' : ''}
                        >
                            회원 정보
                        </li>
                        <li 
                            onClick={() => setActiveTab('edit')}
                            className={activeTab === 'edit' ? 'active' : ''}
                        >
                            회원 정보 수정
                        </li>
                        <li 
                            onClick={() => setActiveTab('reviews')}
                            className={activeTab === 'reviews' ? 'active' : ''}
                        >
                            나의 리뷰
                        </li>
                        <li 
                            onClick={() => setActiveTab('streaming')}
                            className={activeTab === 'streaming' ? 'active' : ''}
                        >
                            스트리밍 관리
                        </li>
                        <li 
                            onClick={() => setActiveTab('product')}
                            className={activeTab === 'product' ? 'active' : ''}
                        >
                            상품 등록
                        </li>
                    </ul>
                </div>
                
                <div className="main-content">
                    {/* {activeTab === 'info' && userInfo && (
                        <div className="user-info-section">
                            <h3>회원 정보</h3>
                            <div className="user-info-details">
                                <p><strong>이름:</strong> {userInfo.name}</p>
                                <p><strong>이메일:</strong> {userInfo.email}</p>
                                <p><strong>전화번호:</strong> {userInfo.phone}</p>
                                <p><strong>주소:</strong> {userInfo.address}</p>
                            </div>
                        </div>
                    )} */}
                    
                    {/* {activeTab === 'edit' && (
                        <div className="user-info-section">
                            <h3>회원 정보 수정</h3>
                            <div className="edit-form">
                                <div className="form-group">
                                    <label>비밀번호</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={editedUser.password}
                                        onChange={handleInputChange}
                                        placeholder="새 비밀번호 입력"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>이름</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedUser.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>이메일</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editedUser.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>전화번호</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editedUser.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>주소</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={editedUser.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="button-group">
                                    <button onClick={handleEditSubmit} className="save-button">
                                        저장하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )} */}

                    {/* {activeTab === 'reviews' && (
                        <div className="reviews-section">
                            <h3>나의 리뷰 목록</h3>
                            <div className="reviews-list">
                                {reviews.map((review) => (
                                    <div key={review.reviewCommentSeq} className="review-item">
                                        <div className="review-header">
                                            <span className="review-score">
                                                평점: {review.score}점
                                            </span>
                                            <span className="review-date">
                                                {new Date(review.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="review-content">
                                            {review.content}
                                        </div>
                                        {review.file && (
                                            <div className="review-image">
                                                <img src={review.file.path} alt="리뷰 이미지" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {activeTab === 'streaming' && (
                        <div className="streaming-section">
                            <h3>스트리밍 관리</h3>
                            <div className="streaming-buttons">
                                <button 
                                    className="streaming-btn"
                                    onClick={() => navigate('/streaming')}
                                >
                                    채팅방 선택하기
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'product' && (
                        <div className="product-section">
                            <h3>상품 등록</h3>
                            <div className="product-form">
                                <div className="form-group">
                                    <label>상품 카테고리</label>
                                    <select 
                                        name="category"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">카테고리 선택</option>
                                        <option value="1">채소류</option>
                                        <option value="2">과일류</option>
                                        <option value="3">곡물류</option>
                                        <option value="4">버섯류</option>
                                        <option value="5">뿌리채소</option>
                                        <option value="6">잎채소</option>
                                        <option value="7">쌈채소</option>
                                        <option value="8">산나물</option>
                                        <option value="9">건농산물</option>
                                        <option value="10">견과류</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>상품 종류</label>
                                    <select 
                                        name="productSeq" 
                                        value={newProduct.productSeq}
                                        onChange={handleProductChange}
                                        disabled={!selectedCategory}
                                    >
                                        <option value="">선택하세요</option>
                                        {filteredProducts.map(product => (
                                            <option key={product.productSeq} value={product.productSeq}>
                                                {product.productName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>등급</label>
                                    <select 
                                        name="stockGradeSeq" 
                                        value={newProduct.stockGradeSeq}
                                        onChange={handleProductChange}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="1">특품</option>
                                        <option value="2">상품</option>
                                        <option value="3">보통</option>
                                        <option value="4">저품</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>재배 방식</label>
                                    <select 
                                        name="stockOrganicSeq" 
                                        value={newProduct.stockOrganicSeq}
                                        onChange={handleProductChange}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="1">유기농</option>
                                        <option value="2">무농약</option>
                                        <option value="3">일반재배</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>색상 코드</label>
                                    <input
                                        type="number"
                                        name="color"
                                        value={newProduct.color}
                                        onChange={handleProductChange}
                                        placeholder="색상 코드 입력"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>수량</label>
                                    <input
                                        type="number"
                                        name="count"
                                        value={newProduct.count}
                                        onChange={handleProductChange}
                                        placeholder="수량 입력"
                                    />
                                </div>
                                <div className="product-description">
                                    <label>상품 설명</label>
                                    <textarea
                                        name="content"
                                        value={newProduct.content}
                                        onChange={handleProductChange}
                                        placeholder="상품 설명 입력"
                                    />
                                </div>
                                <div className="button-group">
                                    <button onClick={handleProductSubmit} className="save-button">
                                        상품 등록
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarmerMyPage; 