import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './QABoard.css';
import 'react-quill/dist/quill.snow.css';


const serverIp = process.env.REACT_APP_SERVER_IP;

const QABoardWrite = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('token');
    
    try {
      const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
      
      await axios.post(`${serverIp}/QABoard/`, 
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
      alert('문의가 등록되었습니다.');
      navigate('/customer-service');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      // 토큰 파싱 및 사용자 정보 추출
      let payload;
      try {
        payload = JSON.parse(atob(token.split('.')[1]));
      } catch (err) {
        console.error('토큰 파싱 실패:', err);
        alert('로그인 정보가 잘못되었습니다.');
        navigate('/login');
        return;
      }

      // FormData 구성
      const submissionData = new FormData();
      const qaBoard = JSON.stringify({
        subject: formData.subject,
        content: formData.content,
        managementUser: { id: payload.user_seq, content: 'user' },
      });
      submissionData.append('qaBoard', new Blob([qaBoard], { type: 'application/json' }));

      // 파일 첨부
      if (selectedFile) {
        submissionData.append('file', selectedFile);
      }

      // 서버 요청
      const response = await axios.post('http://localhost:9001/QABoard/', submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // 성공 처리
      if (response.status === 201) {
        alert('문의가 성공적으로 등록되었습니다.');
        navigate('/customer-service');
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('등록 실패:', error);
      alert('문의 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="qa-write-container">
      <h2>문의하기</h2>
      <form onSubmit={handleSubmit} className="qa-form">
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleSubjectChange}
            required
          />
        </div>
        <div className="form-group">
          <label>내용</label>
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            theme="snow"
            placeholder="문의 내용을 입력하세요"
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
              ],
            }}
          />
        </div>
        <div className="form-group">
          <label>파일 첨부</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">
            등록
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/customer-service')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default QABoardWrite;
