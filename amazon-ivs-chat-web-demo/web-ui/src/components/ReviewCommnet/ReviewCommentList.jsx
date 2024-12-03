import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ReviewComment.css';
import StarRating from './StarRating';

const ReviewCommentList = () => {
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const { reviewSeq } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:9001/reviewComment/${reviewSeq}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setComments(response.data);
      } catch (error) {
        console.error('댓글 로딩 실패:', error);
        if (error.response?.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        }
      }
    };
    fetchComments();
  }, [navigate, reviewSeq]);

  return (
    <div className="rc-board-container">
      <h2>댓글 목록</h2>
      <Link to={`/review-comment/${reviewSeq}/write`} className="write-button">
        댓글 작성
      </Link>
      <div className="rc-board-list">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>내용</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.reviewCommentSeq}>
                <td>{comment.reviewCommentSeq}</td>
                <td>
                  <Link to={`/review-comment/${reviewSeq}/detail/${comment.reviewCommentSeq}`}>
                    {comment.content}
                  </Link>
                </td>
                <td>{comment.userId}</td>
                <td>{new Date(comment.regDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewCommentList; 