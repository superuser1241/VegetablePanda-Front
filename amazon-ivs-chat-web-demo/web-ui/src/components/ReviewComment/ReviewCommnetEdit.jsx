import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReviewComment.css';

const ReviewCommentEdit = () => {
  const { reviewCommentSeq } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: '',
    score: 5,
    image: null
  });
  const [deleteFile, setDeleteFile] = useState(false);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axios.get(`/reviewComment/${reviewCommentSeq}`);
        setFormData({
          content: response.data.content,
          score: response.data.score,
          image: null
        });
      } catch (error) {
        console.error('댓글 조회 실패:', error);
      }
    };

    fetchComment();
  }, [reviewCommentSeq]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    const reviewCommentDTO = {
      content: formData.content,
      score: formData.score
    };

    submitData.append('reviewCommentDTO', JSON.stringify(reviewCommentDTO));
    if (formData.image) {
      submitData.append('image', formData.image);
    }
    submitData.append('deleteFile', deleteFile);

    try {
      await axios.put(`/reviewComment/${reviewCommentSeq}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/review-comment');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
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