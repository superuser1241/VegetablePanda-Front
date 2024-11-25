import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserMyPage.css';

const UserMyPage = () => {
    const [chargeAmount, setChargeAmount] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const token = localStorage.getItem('token');
    const [userId, setUserId] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({
        password: '',
        name: '',
        address: '',
        phone: '',
        email: ''
    });
    const [point, setPoint] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'edit', 'reviews' 탭 관리

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserId(payload.user_seq);
                fetchUserInfo(payload.user_seq);
            } catch (error) {
                console.error('토큰 파싱 실패:', error);
            }
        }
    }, [token]);

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
            fetchPoint(userId);
            fetchReviews(userId);
        }
    }, [userId]);

    const fetchUserInfo = async (seq) => {
        try {
            const response = await axios.get(`http://localhost:9001/myPage/list/${seq}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserInfo(response.data);
        } catch (error) {
            console.error('회원 정보 조회 실패:', error);
        }
    };

    const fetchPoint = async (seq) => {
        try {
            const response = await axios.get(`http://localhost:9001/myPage/point/${seq}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPoint(response.data);
        } catch (error) {
            console.error('포인트 조회 실패:', error);
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

    const handleCharge = async () => {
        try {
            if (!userId || !chargeAmount) {
                alert('충전할 금액을 입력해주세요.');
                return;
            }

            const response = await axios.post('http://localhost:9001/charge', {
                managementUserSeq: parseInt(userId),
                price: parseInt(chargeAmount)
            }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data) {
                setChargeAmount('');
                window.location.href = response.data;
            }
        } catch (error) {
            console.error('포인트 충전 실패:', error);
            alert('포인트 충전에 실패했습니다.');
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
            setIsEditing(false);
            fetchUserInfo(userId);
        } catch (error) {
            console.error('회원정보 수정 실패:', error);
            alert('회원정보 수정에 실패했습니다.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteReview = async (reviewSeq) => {
        try {
            await axios.delete(`http://localhost:9001/myPage/review/${userId}/${reviewSeq}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('리뷰가 삭제되었습니다.');
            fetchReviews(userId);
        } catch (error) {
            console.error('리뷰 삭제 실패:', error);
            alert('리뷰 삭제에 실패했습니다.');
        }
    };

    return (
        <div className="user-mypage">
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
                            onClick={() => setActiveTab('point')}
                            className={activeTab === 'point' ? 'active' : ''}
                        >
                            포인트 충전
                        </li>
                    </ul>
                </div>
                
                <div className="main-content">
                    {activeTab === 'info' && userInfo && (
                        <div className="user-info-section">
                            <h3>회원 정보</h3>
                            <div className="user-info-details">
                                <p><strong>이름:</strong> {userInfo.name}</p>
                                <p><strong>이메일:</strong> {userInfo.email}</p>
                                <p><strong>전화번호:</strong> {userInfo.phone}</p>
                                <p><strong>주소:</strong> {userInfo.address}</p>
                                <p><strong>보유 포인트:</strong> {point.toLocaleString()}P</p>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'edit' && (
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
                                    <button onClick={() => setIsEditing(false)} className="cancel-button">
                                        취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
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
                                        <button 
                                            onClick={() => handleDeleteReview(review.reviewCommentSeq)}
                                            className="delete-button"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'point' && (
                        <div className="point-section">
                            <h3>포인트 충전</h3>
                            <div className="point-info">
                                <p>현재 보유 포인트: {point.toLocaleString()}P</p>
                            </div>
                            <div className="charge-input-group">
                                <input
                                    type="number"
                                    value={chargeAmount}
                                    onChange={(e) => setChargeAmount(e.target.value)}
                                    placeholder="충전할 금액을 입력하세요"
                                    className="charge-input"
                                />
                                <button onClick={handleCharge} className="charge-button">
                                    충전하기
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserMyPage; 