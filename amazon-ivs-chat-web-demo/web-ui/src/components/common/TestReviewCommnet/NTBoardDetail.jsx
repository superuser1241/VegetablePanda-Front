import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './NTBoard.css';

const NotifyBoardDetail = () => {
  const navigate = useNavigate();
  const { boardNoSeq } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
      setCurrentUser(payload.name);
      setIsAdmin(payload.role === 'ROLE_ADMIN');
    } catch (error) {
      console.error('토큰 파싱 실패:', error);
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        await axios.put(`http://localhost:9001/notifyBoard/increaseReadnum/${boardNoSeq}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const response = await axios.get(`http://localhost:9001/notifyBoard/${boardNoSeq}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        setError('게시글을 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [boardNoSeq, navigate, token]);


  const handleDelete = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:9001/notifyBoard/${boardNoSeq}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('게시글이 삭제되었습니다.');
      navigate('/notify-service');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };


  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="nt-detail-container">
      <h2>문의 상세</h2>
      <div className="nt-detail-content">
        <div className="detail-header">
          <h3>{post.subject}</h3>
          <div className="detail-info">
            <span>작성자: {post.writerId}</span>
            <span>작성일: {new Date(post.regDate).toLocaleDateString()}</span>
            <span>조회수: {post.readnum}</span>
          </div>
        </div>
        <div className="detail-body">
          <p>{post.content}</p>
        </div>
        <div className="detail-buttons">
          <button 
            onClick={() => navigate('/notify-service')} 
            className="list-button"
          >
            목록
          </button>
          
          {currentUser === post.writerId && (
            <button 
              onClick={() => navigate(`/notify-service/edit/${post.boardNoSeq}`)} 
              className="edit-button"
            >
              수정
            </button>
          )}

          {isAdmin && (
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

export default NotifyBoardDetail; 