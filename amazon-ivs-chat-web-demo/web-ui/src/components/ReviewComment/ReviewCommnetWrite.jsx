import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ReviewComment.css';

const ReviewCommentWrite = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderInfo } = location.state || {};
  const token = localStorage.getItem('token');
  
  const [formData, setFormData] = useState({
    content: '',
    score: 5,
    reviewSeq: orderInfo?.reviewSeq
  });
  const [imageFile, setImageFile] = useState(null);
  const [validation, setValidation] = useState({
    content: true
  });

  useEffect(() => {
    if (!orderInfo || !token) {
      alert('잘못된 접근입니다.');
      navigate('/');
      return;
    }
  }, [orderInfo, token, navigate]);

  const handleContentChange = (e) => {
    const content = e.target.value;
    setFormData(prev => ({...prev, content}));
    setValidation(prev => ({
      ...prev,
      content: content.length > 0 && content.length <= 80
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validation.content) {
      alert('리뷰 내용은 1-80자 사이로 입력해주세요.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      const reviewData = {
        userBuySeq: orderInfo.userBuySeq,
        content: formData.content,
        score: parseInt(formData.score),
        reviewSeq: formData.reviewSeq
      };
      
      formDataToSend.append('reviewDTO', new Blob([JSON.stringify(reviewData)], { 
        type: 'application/json' 
      }));
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      await axios.post('http://localhost:9001/review/write', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('리뷰가 등록되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      alert('리뷰 등록에 실패했습니다.');
    }
  };

  return (
    <div className="review-write-container">
      <h2>리뷰 작성</h2>
      <div className="order-info">
        <p><strong>상품명:</strong> {orderInfo?.productName}</p>
        <p><strong>구매가격:</strong> {orderInfo?.price?.toLocaleString()}원</p>
        <p><strong>구매일자:</strong> {new Date(orderInfo?.buyDate).toLocaleDateString()}</p>
      </div>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>평점</label>
          <select
            name="score"
            value={formData.score}
            onChange={(e) => setFormData(prev => ({...prev, score: e.target.value}))}
          >
            <option value="5">5점</option>
            <option value="4">4점</option>
            <option value="3">3점</option>
            <option value="2">2점</option>
            <option value="1">1점</option>
          </select>
        </div>
        <div className="form-group">
          <label>리뷰 내용 ({formData.content.length}/80)</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleContentChange}
            required
            maxLength={80}
            rows="5"
            placeholder="리뷰 내용을 입력해주세요 (최대 80자)"
            className={!validation.content ? 'invalid' : ''}
          />
          {!validation.content && (
            <span className="error-message">1-80자 사이로 입력해주세요</span>
          )}
        </div>
        <div className="form-group">
          <label>이미지 첨부</label>
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className="button-group">
          <button type="submit">등록</button>
          <button type="button" onClick={() => navigate('/mypage')}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default ReviewCommentWrite; 