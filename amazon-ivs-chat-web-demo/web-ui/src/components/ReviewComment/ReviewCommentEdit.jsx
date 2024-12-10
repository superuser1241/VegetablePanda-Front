import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import StarRating from '../ReviewComment/StarRating';
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
        navigate('/user-mypage');
      }
    };

    if (reviewCommentSeq) {
      fetchComment();
    }
  }, [reviewCommentSeq, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    const reviewCommentDTO = {
      content: formData.content,
      score: formData.score
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
      navigate(`/reviewComment/detail/${reviewCommentSeq}`);
    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      alert('리뷰 수정에 실패했습니다.');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  return (
    <div className="review-write-container">
      <h2>리뷰 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="order-info">
          <div className="order-info-details">
            <div className="rating-section">
              <label>평점</label>
              <StarRating
                rating={formData.score}
                onRatingChange={(newRating) => 
                  setFormData(prev => ({...prev, score: newRating}))
                }
              />
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label>내용</label>
          <ReactQuill
            value={formData.content}
            onChange={(content) => setFormData(prev => ({...prev, content}))}
            modules={modules}
            className="quill-editor"
          />
        </div>

        <div className="form-group">
          <label>이미지</label>
          <input
            type="file"
            onChange={(e) => setFormData(prev => ({...prev, image: e.target.files[0]}))}
            className="file-input"
          />
        </div>

        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={deleteFile}
              onChange={(e) => setDeleteFile(e.target.checked)}
            />
            기존 이미지 삭제
          </label>
        </div>

        <div className="button-group">
          <button type="submit">수정하기</button>
          <button 
            type="button" 
            onClick={() => navigate(`/reviewComment/detail/${reviewCommentSeq}`)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewCommentEdit;