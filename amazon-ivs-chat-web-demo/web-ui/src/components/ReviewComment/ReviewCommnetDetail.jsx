import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ReviewComment.css';
import './NTBoard.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const ReviewCommentDetail = () => {
  const navigate = useNavigate();
  const { reviewCommentSeq } = useParams();
  const [comment, setComment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
      setCurrentUser(payload.sub);
    } catch (error) {
      console.error('토큰 파싱 실패:', error);
      navigate('/login');
      return;
    }

    const fetchComment = async () => {
      try {
        await axios.put(`${serverIp}/notifyBoard/increaseReadnum/${boardNoSeq}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const response = await axios.get(`${serverIp}/notifyBoard/${boardNoSeq}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('댓글 로딩 실패:', error);
        setError('댓글을 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchComment();
  }, [reviewCommentSeq, navigate, token]);

  const handleDelete = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`${serverIp}/notifyBoard/${boardNoSeq}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('댓글이 삭제되었습니다.');
      navigate('/review');
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
      <h2>댓글 상세</h2>
      <div className="rc-detail-content">
        <div className="detail-header">
          <div className="detail-info">
            <span>작성자: {comment.userId}</span>
            <span>작성일: {new Date(comment.regDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="detail-body">
          <p>{comment.content}</p>
          {comment.imageUrl && (
            <img src={comment.imageUrl} alt="댓글 이미지" className="comment-image" />
          )}
        </div>
        <div className="detail-buttons">
          <button 
            onClick={() => navigate(`/review/${comment.reviewSeq}`)} 
            className="list-button"
          >
            리뷰로 돌아가기
          </button>
          
          {currentUser === comment.userId && (
            <button 
              onClick={() => navigate(`/review-comment/edit/${reviewCommentSeq}`)} 
              className="edit-button"
            >
              수정
            </button>
          )}

          {currentUser === comment.userId && (
            <button 
              onClick={handleDelete} 
              className="delete-button"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCommentDetail; 