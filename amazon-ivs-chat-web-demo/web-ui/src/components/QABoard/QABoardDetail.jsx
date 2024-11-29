import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './QABoard.css';

const QABoardDetail = () => {
  const navigate = useNavigate();
  const { boardNoSeq } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  
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
        await axios.put(`http://localhost:9001/QABoard/increaseReadnum/${boardNoSeq}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const response = await axios.get(`http://localhost:9001/QABoard/${boardNoSeq}`, {
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

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await axios.get(`http://localhost:9001/QaReplyBoard/${boardNoSeq}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setReplies(response.data);
      } catch (error) {
        console.error('댓글 조회 실패:', error);
      }
    };
    
    if (boardNoSeq) {
      fetchReplies();
    }
  }, [boardNoSeq, token]);

  const handleDelete = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:9001/QABoard/${boardNoSeq}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('게시글이 삭제되었습니다.');
      navigate('/customer-service');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:9001/QaReplyBoard/${boardNoSeq}',
        { 
          comment: replyContent,
          qaBoard: { boardNoSeq: boardNoSeq }
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setReplyContent('');
      const repliesResponse = await axios.get(
        `http://localhost:9001/QaReplyBoard/${boardNoSeq}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setReplies(repliesResponse.data);
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      if (error.response?.status === 403) {
        alert('관리자만 댓글을 등록할 수 있습니다.');
      } else {
        alert('댓글 등록에 실패했습니다.');
      }
    }
  };

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="qa-detail-container">
      <h2>문의 상세</h2>
      <div className="qa-detail-content">
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
            onClick={() => navigate('/customer-service')} 
            className="list-button"
          >
            목록
          </button>
          
          {currentUser === post.writerId && (
            <button 
              onClick={() => navigate(`/customer-service/edit/${post.boardNoSeq}`)} 
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
      
      <div className="qa-reply-section">
        <h3>답변</h3>
        {isAdmin && (
          <form onSubmit={handleReplySubmit}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답변을 입력하세요"
              required
            />
            <button type="submit">답변 등록</button>
          </form>
        )}
        
        <div className="reply-list">
          {replies.map(reply => (
            <div key={reply.replyNoSeq} className="reply-item">
              <div className="reply-header">
                <span>{reply.writerId}</span>
                <span>{new Date(reply.regDate).toLocaleDateString()}</span>
              </div>
              <p>{reply.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QABoardDetail; 