import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarRating from './StarRating';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ReviewComment.css';
import DOMPurify from 'dompurify';

const serverIp = process.env.REACT_APP_SERVER_IP;

const ReviewCommentWrite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState({
    content: '',
    score: 5,
  });
  const [image, setImage] = useState(null);
  const token = localStorage.getItem('token');
  const { reviewSeq, userBuyDetailSeq } = location.state?.orderInfo || {};

  const [newProduct, setNewProduct] = useState({
    file: {
      fileSeq: '',
      name: ''
    }
  });

  useEffect(() => {
    // 필수 데이터 검증
    if (!reviewSeq || !userBuyDetailSeq || !token) {
      console.error("필수 데이터 누락:", { reviewSeq, userBuyDetailSeq, hasToken: !!token });
      alert("리뷰 작성에 필요한 정보가 없습니다.");
      return;
    }
  }, [reviewSeq, userBuyDetailSeq, token, navigate]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // 입력값 검증
    if (!reviewData.content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    if (!reviewData.score) {
      alert('평점을 선택해주세요.');
      return;
    }

    // reviewCommentDTO JSON 추가
    const reviewCommentDTO = {
      content: reviewData.content,
      score: reviewData.score,
      userSeq: localStorage.getItem("userSeq"),
      reviewSeq: location.state.orderInfo.reviewSeq,
      userBuyDetailSeq: location.state.orderInfo.userBuyDetailSeq,
      file: image ? {
        fileSeq: '',
        name: newProduct.file.name
      } : null  // 이미지가 없을 경우 null로 설정
    };

    const formData = new FormData();
    formData.append('reviewCommentDTO', new Blob([JSON.stringify(reviewCommentDTO)], {
      type: 'application/json'
    }));
    
    // 이미지가 있는 경우에만 추가
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post(
        `${serverIp}/reviewComment/all`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        alert('리뷰가 성공적으로 등록되었습니다.');
        
        // role에 따른 페이지 이동
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
      }
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      if (error.response?.status === 404) {
        alert('주문 정보를 찾을 수 없습니다.');
      } else if (error.response?.status === 403) {
        alert('리뷰 작성 권한이 없습니다.');
      } else {
        alert('리뷰 등록에 실패했습니다.');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        alert('파일 크기는 5MB를 초과할 수 없습니다.');
        e.target.value = '';
        return;
      }
      setImage(file);
      setNewProduct(prev => ({
        ...prev,
        file: {
          fileSeq: '',
          name: file.name
        }
      }));
    }
  };

  const handleRatingChange = (newRating) => {
    setReviewData(prev => ({...prev, score: newRating}));
  };

  if (!location.state?.orderInfo) {
    return <div>주문 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="review-write-container">
      <h2>상품 리뷰 작성</h2>
      <div className="order-info">
        <p>상품명: {location.state.orderInfo.content}</p>
        <p>구매수량: {location.state.orderInfo.count}개</p>
        <p>구매가격: {location.state.orderInfo.price}원</p>
        <p>구매일자: {new Date(location.state.orderInfo.buyDate).toLocaleDateString()}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>평점</label>
          <StarRating 
            rating={reviewData.score}
            onRatingChange={handleRatingChange}
          />
        </div>
        <div className="form-group">
          <label>리뷰 내용</label>
          <ReactQuill 
            theme="snow"
            value={reviewData.content}
            onChange={(content) => setReviewData({...reviewData, content: content})}
            modules={modules}
            formats={formats}
            style={{ height: '200px', marginBottom: '50px' }}
          />
        </div>
        <div className="form-group">
          <label>이미지 첨부</label>
          <input 
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="button-group">
          <button type="submit">등록하기</button>
          <button type="button" onClick={() => navigate('/mypage')}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default ReviewCommentWrite; 