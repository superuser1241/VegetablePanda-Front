import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './QABoard.css';
import DOMPurify from 'dompurify';

const serverIp = process.env.REACT_APP_SERVER_IP;

const QABoardEdit = () => {
  const navigate = useNavigate();
  const { boardNoSeq } = useParams();
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [deleteFile, setDeleteFile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null') {
      try {
        const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
        console.log('토큰 페이로드:', payload);

        if (Date.now() >= payload.exp * 1000) {
          setIsAuthenticated(false);
          setUserName('');
          setUserRole('');
          return null;
        } else {
          setIsAuthenticated(true);
          setUserName(payload.id);
          setUserRole(payload.role);
          return token;
        }
      } catch (error) {
        console.error('토큰 디코딩 실패:', error);
        setIsAuthenticated(false);
        return null;
      }
    }
    setIsAuthenticated(false);
    return null;
  }, []);

  useEffect(() => {
    const token = checkAuthStatus();
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 기존 게시글 데이터 불러오기
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${serverIp}/QABoard/${boardNoSeq}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('수정할 게시글 데이터:', response.data);
        
        setFormData({
          subject: response.data.subject,
          content: response.data.content,
        });
        
        if (response.data.fileDTO) {
          setCurrentFile(response.data.fileDTO);
        }
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        alert('게시글을 불러오는데 실패했습니다.');
        navigate('/customer-service');
      }
    };

    fetchPost();
  }, [boardNoSeq, navigate]);

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setDeleteFile(false);
  };

  const handleFileDelete = () => {
    setCurrentFile(null);
    setSelectedFile(null);
    setDeleteFile(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
  
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
  
    const token = checkAuthStatus();
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    try {
      const data = new FormData();
      
      // QaDTO를 JSON 문자열로 변환하여 추가
      const qaBoardData = {
        subject: formData.subject.trim(),
        content: formData.content.trim()
      };
      
      data.append('qaBoard', new Blob([JSON.stringify(qaBoardData)], {
        type: 'application/json'
      }));
  
      if (selectedFile) {
        data.append('file', selectedFile);
      }
  
      data.append('deleteFile', deleteFile.toString());
  
      const response = await axios.put(
        `${serverIp}/QABoard/${boardNoSeq}`, 
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      if (response.status === 200) {
        alert('문의가 수정되었습니다.');
        navigate('/customer-service');
      }
    } catch (error) {
      console.error('수정 실패:', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            alert('로그인이 필요합니다.');
            navigate('/login');
            break;
          case 403:
            alert('수정 권한이 없습니다.');
            break;
          case 413:
            alert('파일 크기가 너무 큽니다.');
            break;
          case 415:
            alert('지원하지 않는 파일 형식입니다.');
            break;
          default:
            alert('문의 수정에 실패했습니다.');
        }
      } else {
        alert('서버와의 통신에 실패했습니다.');
      }
    }
  };

  return (
    <div className="qa-write-container">
      <h2>문의 수정</h2>
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
          {currentFile && !deleteFile && (
            <div className="current-file">
              <span>현재 파일: {currentFile.name}</span>
              <button type="button" onClick={handleFileDelete}>삭제</button>
            </div>
          )}
          <input 
            type="file" 
            onChange={handleFileChange}
            disabled={currentFile && !deleteFile}
          />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">수정</button>
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

export default QABoardEdit;