import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NTBoard.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const NotifyBoardWrite = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    readnum: 0,
    regDate: new Date().toISOString()
  });
  const [image, setImage] = useState(null);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }]
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align'
  ];

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

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const formDataToSend = new FormData();
      
      // 이미지가 있는 경우 추가
      if (image) {
        formDataToSend.append('image', image);
      }

      // NoticeBoardDTO 데이터 추가
      const noticeBoardDTO = new Blob([JSON.stringify(formData)], {
        type: 'application/json'
      });
      formDataToSend.append('noticeBoard', noticeBoardDTO);

      const response = await axios({
        method: 'post',
        url: `${serverIp}/notifyBoard/`,
        data: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        alert('공지가 등록되었습니다.');
        navigate('/notify-service');
      }
    } catch (error) {
      console.error('등록 실패:', error);
      if (error.response?.status === 403) {
        alert('권한이 없습니다.');
        navigate('/notify-service');
      } else {
        alert('공지 등록에 실패했습니다. ' + (error.response?.data?.message || ''));
      }
      navigate('/notify-service');
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
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            className="quill-editor"
          />
        </div>
        <div className="form-group">
          <label>이미지 업로드</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">등록</button>
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

export default NotifyBoardWrite;
