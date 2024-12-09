import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NTBoard.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const NotifyBoardDetail = () => {
  const { boardNoSeq } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const token = localStorage.getItem('token');
        // 조회수 증가
        await axios.put(`${serverIp}/notifyBoard/increaseReadnum/${boardNoSeq}`, null, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // 게시글 상세 조회
        const response = await axios.get(`${serverIp}/notifyBoard/${boardNoSeq}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setNotice(response.data);
        
        // 관리자 권한 확인
        const userRole = localStorage.getItem('userRole');
        setIsAdmin(userRole === 'ROLE_ADMIN');
      } catch (error) {
        console.error('조회 실패:', error);
        alert('게시글을 불러오는데 실패했습니다.');
        navigate('/notify-service');
      }
    };

    fetchNotice();
  }, [boardNoSeq, navigate]);

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${serverIp}/notifyBoard/${boardNoSeq}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert('삭제되었습니다.');
        navigate('/notify-service');
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  if (!notice) return <div>Loading...</div>;

  return (
    <div className="nt-detail-container">
      <h2>{notice.subject}</h2>
      <div className="nt-detail-info">
        <span>등록일: {new Date(notice.regDate).toLocaleDateString()}</span>
        <span>조회수: {notice.readnum}</span>
      </div>
      <div 
        className="nt-detail-content"
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />
      {notice.file && (
        <div className="nt-detail-image">
          <img src={notice.file.path} alt="첨부 이미지" />
        </div>
      )}
      <div className="button-group">
        {isAdmin && (
          <>
            <button 
              onClick={() => navigate(`/notify-service/edit/${boardNoSeq}`)}
              className="edit-button"
            >
              수정
            </button>
            <button 
              onClick={handleDelete}
              className="delete-button"
            >
              삭제
            </button>
          </>
        )}
        <button 
          onClick={() => navigate('/notify-service')}
          className="back-button"
        >
          목록
        </button>
      </div>
    </div>
  );
};

export default NotifyBoardDetail; 