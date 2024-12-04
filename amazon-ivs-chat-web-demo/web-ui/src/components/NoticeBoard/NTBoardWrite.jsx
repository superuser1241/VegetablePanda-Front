import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NTBoard.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const NotifyBoardWrite = () => {
  const navigate = useNavigate();
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
  }, [navigate]);

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
      const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
      
      await axios.post(`${serverIp}/notifyBoard/`, 
        {
          subject: formData.subject,
          content: formData.content,
          managementUser: payload.user_seq
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert('공지가 등록되었습니다.');
      navigate('/Notify-service');
    } catch (error) {
      console.error('등록 실패:', error);
      if (error.response?.status === 403) {
        alert('권한이 없습니다.');
        navigate('/notify-service');
      } else {
        alert('공지 등록에 실패했습니다.');
      }
    }
  };

  return (
    <div className="nt-write-container">
      <h2>공지등록</h2>
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
          <button type="submit" className="submit-button">등록</button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/Notify-service')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotifyBoardWrite; 