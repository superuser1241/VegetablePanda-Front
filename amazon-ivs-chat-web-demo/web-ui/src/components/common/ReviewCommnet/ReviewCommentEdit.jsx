import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ReviewComment.css';

const ReviewCommentEdit = () => {
  const navigate = useNavigate();
  const { reviewSeq, reviewCommentSeq } = useParams();
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    score: 5,
  });
  const [imageFile, setImageFile] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 기존 리뷰 데이터 불러오기
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:9001/reviewComment/${reviewSeq}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setFormData({
          subject: response.data.subject,
          content: response.data.content,
          score: response.data.score
        });
      } catch (error) {
        console.error('리뷰 로딩 실패:', error);
        alert('리뷰를 불러오는데 실패했습니다.');
        navigate('/review-comment');
      }
    };

    fetchPost();
  }, [reviewSeq, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const formDataToSend = new FormData();
      
      const reviewCommentDTO = new Blob([JSON.stringify({
        content: formData.content,
        score: formData.score
      })], {
        type: 'application/json'
      });
      
      formDataToSend.append('reviewCommentDTO', reviewCommentDTO);
      if (imageFile) {
        formDataToSend.append('file', imageFile);
      }
      
      await axios.put(
        `http://localhost:9001/reviewComment/${reviewSeq}/${reviewCommentSeq}`, 
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          params: {
            deleteFile: deleteImage
          }
        }
      );
      alert('리뷰가 수정되었습니다.');
      navigate('/review-comment');
    } catch (error) {
      console.error('수정 실패:', error);
      if (error.response?.status === 403) {
        alert('권한이 없습니다.');
        navigate('/login');
      } else {
        alert('리뷰 수정에 실패했습니다.');
      }
    }
  };

  return (
    <div className="rc-write-container">
      <h2>리뷰 수정</h2>
      <form onSubmit={handleSubmit} className="rc-form">
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>내용</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
          />
        </div>
        <div className="form-group">
          <label>이미지</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
          <label>
            <input
              type="checkbox"
              checked={deleteImage}
              onChange={(e) => setDeleteImage(e.target.checked)}
            />
            기존 이미지 삭제
          </label>
        </div>
        <div className="form-group">
          <label>평점</label>
          <input
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">수정</button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/review-comment')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewCommentEdit;