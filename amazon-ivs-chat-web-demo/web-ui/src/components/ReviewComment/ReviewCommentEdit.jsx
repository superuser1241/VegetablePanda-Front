import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReviewComment.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const ReviewCommentEdit = () => {
  const { reviewCommentSeq } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: '',
    score: 5,
    image: null
  });
  const [deleteFile, setDeleteFile] = useState(false);
  const [reviewSeq, setReviewSeq] = useState(null);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axios.get(`${serverIp}/reviewComment/${reviewCommentSeq}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const comment = response.data;
        setFormData({
          content: comment.content,
          score: comment.score,
          image: null
        });
        setReviewSeq(comment.reviewSeq);
      } catch (error) {
        console.error('댓글 조회 실패:', error);
        alert('댓글 조회에 실패했습니다.');
        navigateToMyPage();
      }
    };

    if (reviewCommentSeq) {
      fetchComment();
    }
  }, [reviewCommentSeq, token, navigate]);

  const navigateToMyPage = () => {
    switch(userRole) {
      case 'ROLE_USER':
        navigate('/user-mypage');
        break;
      case 'ROLE_FARMER':
        navigate('/farmer-mypage');
        break;
      case 'ROLE_COMPANY':
        navigate('/company-mypage');
        break;
      case 'ROLE_ADMIN':
        navigate('/admin-mypage');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    const reviewCommentDTO = {
      content: formData.content,
      score: parseInt(formData.score)
    };

    formDataToSend.append('reviewCommentDTO', new Blob([JSON.stringify(reviewCommentDTO)], {
      type: 'application/json'
    }));
    
    formDataToSend.append('reviewSeq', reviewSeq);
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    formDataToSend.append('deleteFile', deleteFile);

    try {
      await axios.put(`${serverIp}/reviewComment/${reviewCommentSeq}`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('리뷰가 수정되었습니다.');
      navigateToMyPage();
    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      alert('리뷰 수정에 실패했습니다.');
    }
  };

  return (
    <div className="review-comment-edit">
      <h2>리뷰 댓글 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>내용:</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
          />
        </div>
        <div>
          <label>평점:</label>
          <input
            type="number"
            min="1"
            max="5"
            value={formData.score}
            onChange={(e) => setFormData({...formData, score: e.target.value})}
            required
          />
        </div>
        <div>
          <label>이미지:</label>
          <input
            type="file"
            onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={deleteFile}
              onChange={(e) => setDeleteFile(e.target.checked)}
            />
            기존 이미지 삭제
          </label>
        </div>
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default ReviewCommentEdit;