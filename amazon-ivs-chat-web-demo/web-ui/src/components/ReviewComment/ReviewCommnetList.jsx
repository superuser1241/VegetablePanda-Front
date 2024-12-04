import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ReviewComment.css';

const ReviewCommentList = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchMyComments = async () => {
      try {
        const response = await axios.get('/reviewComment/myComments');
        setComments(response.data);
      } catch (error) {
        console.error('댓글 조회 실패:', error);
      }
    };

    fetchMyComments();
  }, []);

  return (
    <div className="review-comment-list">
      <h2>내 리뷰 댓글 목록</h2>
      <Link to="/review-comment/write" className="write-button">
        새 댓글 작성
      </Link>
      <div className="comments-container">
        {comments.map((comment) => (
          <div key={comment.reviewCommentSeq} className="comment-item">
            <h3>상품 리뷰: {comment.review.title}</h3>
            <p>내용: {comment.content}</p>
            <p>평점: {comment.score}</p>
            {comment.file && (
              <img src={comment.file.path} alt="리뷰 이미지" className="review-image" />
            )}
            <div className="button-group">
              <Link 
                to={`/review-comment/edit/${comment.reviewCommentSeq}`} 
                className="edit-button"
              >
                수정
              </Link>
              <Link 
                to={`/review-comment/${comment.reviewCommentSeq}`} 
                className="detail-button"
              >
                상세보기
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewCommentList; 