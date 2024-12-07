import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ReviewComment.css';
import DOMPurify from 'dompurify';

const serverIp = process.env.REACT_APP_SERVER_IP;

const ReviewCommentDetail = () => {
  const navigate = useNavigate();
  const { reviewCommentSeq } = useParams();
  const [comment, setComment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload.user_seq);
        console.log('현재 사용자:', payload.user_seq);
        console.log('댓글 작성자:', comment?.userSeq);
      } catch (error) {
        console.error('토큰 디코딩 실패:', error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axios.get(`${serverIp}/reviewComment/${reviewCommentSeq}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setComment(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('댓글 로딩 실패:', error);
        setError('댓글을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComment();
  }, [reviewCommentSeq, token]);

  const handleDelete = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`${serverIp}/reviewComment/${reviewCommentSeq}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('댓글이 삭제되었습니다.');
      navigate('/reviewComment/list');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!comment) return <div>댓글을 찾을 수 없습니다.</div>;

  return (
    <div className="rc-detail-container">
      <h2>리뷰 상세</h2>
      <div className="rc-detail-content">
        <div className="detail-header">
          <div className="detail-info">
            <span>작성자: {comment.name}</span>
            <span>작성일: {new Date(comment.regDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="detail-body">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(comment.content) 
            }} 
          />
          {comment.path && (
            <img src={comment.path} alt="댓글 이미지" className="comment-image" />
          )}
        </div>
        <div className="detail-buttons">
          <button 
            onClick={() => navigate('/reviewComment/list')} 
            className="list-button"
          >
            목록으로 돌아가기
          </button>
          
          {Number(localStorage.getItem("userSeq")) === comment?.userSeq && (
            <>
              <button 
                onClick={handleDelete} 
                className="delete-button"
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCommentDetail; 