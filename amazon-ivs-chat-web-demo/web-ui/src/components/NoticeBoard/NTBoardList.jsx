import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NTBoard.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const NTBoardList = () => {
  const [posts, setPosts] = useState([]);
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
        const response = await axios.get(`${serverIp}/notifyBoard/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // 작성자 필드를 "관리자"로 변환
        const modifiedPosts = response.data.map((post) => ({
          ...post,
          writerId: "관리자", // 작성자 필드 하드코딩
        }));
        
        setPosts(modifiedPosts);

        // setPosts(response.data);
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        if (error.response?.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        }
      }
    };
    fetchPosts();
  }, [navigate]);

  return (
    <div className="nt-board-container">
      <h2>공지사항</h2>
      <Link to="/notify-service/write" className="write-button">
        공지등록
      </Link>
      <div className="nt-list">
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
                  <Link to={`/notify-service/${post.boardNoSeq}`}>
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

export default NTBoardList; 