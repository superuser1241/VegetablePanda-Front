import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ReviewComment.css';
import DOMPurify from 'dompurify';
import '../../index.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const ReviewCommentList = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const userSeq = localStorage.getItem("userSeq");
        const response = await axios.get(`${serverIp}/myComments/${userSeq}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setReviews(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('리뷰 목록 조회 실패:', error);
      }
    };

    fetchMyReviews();
  }, [token]);

  const handleDetailClick = (reviewCommentSeq) => {
    navigate(`/reviewComment/detail/${reviewCommentSeq}`);
  };

  return (
    <div className="review-list-container">
      <h2>내가 작성한 리뷰</h2>
      {reviews.length === 0 ? (
        <p className="no-reviews">작성한 리뷰가 없습니다.</p>
      ) : (
        <div className="review-grid">
          {reviews.map((review) => (
            <div 
              key={review.reviewCommentSeq} 
              className="review-item"
              onClick={() => handleDetailClick(review.reviewCommentSeq)}
              style={{ cursor: 'pointer' }}
            >
              <div className="review-header">
                <h3>{review.productName}</h3>
                <div className="star-rating">
                  {'★'.repeat(review.score)}{'☆'.repeat(5-review.score)}
                </div>
              </div>
              <div 
                className="review-content"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(review.content) 
                }} 
              />
              {review.file && (
                <img 
                  src={review.path} 
                  alt="리뷰 이미지" 
                  className="review-image"
                />
              )}
              <div className="review-footer">
                <span className="review-date">
                  작성일: {new Date(review.regDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCommentList; 