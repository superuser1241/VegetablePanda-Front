import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './NTBoard.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const NTBoardEdit = () => {
  const navigate = useNavigate();
  const { boardNoSeq } = useParams();
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 기존 게시글 데이터 불러오기
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${serverIp}/notifyBoard/${boardNoSeq}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setFormData({
          subject: response.data.subject,
          content: response.data.content,
        });
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        alert('게시글을 불러오는데 실패했습니다.');
        navigate('/notify-service');
      }
    };

    fetchPost();
  }, [boardNoSeq, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const formDataToSend = new FormData();
      const noticeBoardData = {
        subject: formData.subject,
        content: formData.content
      };
      
      formDataToSend.append('noticeBoard', new Blob([JSON.stringify(noticeBoardData)], {
        type: 'application/json'
      }));

      await axios.put(`${serverIp}/notifyBoard/${boardNoSeq}`, 
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      alert('공지가 수정되었습니다.');
      navigate('/notify-service');
    } catch (error) {
      console.error('수정 실패:', error);
      if (error.response?.status === 403) {
        alert('권한이 없습니다.');
        navigate('/notify-service');
      } else {
        alert('공지 수정에 실패했습니다.');
      }
    }
  };

  return (
    <div className="nt-write-container">
      <h2>문의 수정</h2>
      <form onSubmit={handleSubmit} className="nt-form">
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
        <div className="button-group">
          <button type="submit" className="submit-button">수정</button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/notify-service')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default NTBoardEdit;