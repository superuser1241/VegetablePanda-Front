import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QABoard.css';

const QABoardList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
  
      try {
        const response = await axios.get('http://localhost:9001/QABoard/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // 응답 데이터 구조 확인 및 처리
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setPosts(response.data.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setPosts([]);
        }
  
        setIsLoading(false);
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        if (error.response?.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else {
          setError('게시글 목록을 불러오는 데 실패했습니다.');
        }
        setIsLoading(false);
      }
    };
  
    fetchPosts();
  }, [navigate]);

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="qa-board-container">
      <h2>고객센터</h2>
      <div className="header-section">
        <Link to="/customer-service/write" className="write-button">
          문의하기
        </Link>
      </div>
      <div className="qa-list">
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.boardNoSeq}>
                  <td>{post.boardNoSeq}</td>
                  <td>
                    <Link to={`/customer-service/${post.boardNoSeq}`} className="qa-link">
                      {post.subject}
                    </Link>
                  </td>
                  <td>{post.writerId}</td>
                  <td>{new Date(post.regDate).toLocaleDateString()}</td>
                  <td>{post.readnum}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default QABoardList;
