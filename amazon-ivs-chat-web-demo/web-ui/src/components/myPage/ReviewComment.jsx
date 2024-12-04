import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewComment.css';

const ReviewCommentList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState('');
  const [reviewComments, setReviewComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // JWT 또는 localStorage에서 userId 가져오기
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.user_seq || localStorage.getItem('userSeq'));
      } catch (error) {
        console.error('토큰 파싱 실패:', error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (userId) {
      fetchReviewComments();
    }
  }, [userId]);

  const fetchReviewComments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:9001/reviewComment/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setReviewComments(response.data);
      console.log('리뷰 댓글 목록:', response.data);
    } catch (error) {
      console.error('리뷰 댓글 조회 실패:', error);
      setError('리뷰 댓글 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="review-comment-list-container">
      <h3>리뷰 댓글 목록</h3>
      <div className="review-comment-table-container">
        <table className="review-comment-table">
          <thead>
            <tr>
              <th>내용</th>
              <th>평점</th>
              <th>파일</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {reviewComments.map((comment) => (
              <tr key={comment.reviewCommentSeq}>
                <td>{comment.content}</td>
                <td>{comment.score}</td>
                <td>
                  {comment.file ? (
                    <a
                      href={comment.file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      {comment.file.name || '첨부파일'}
                    </a>
                  ) : (
                    '첨부 파일 없음'
                  )}
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
