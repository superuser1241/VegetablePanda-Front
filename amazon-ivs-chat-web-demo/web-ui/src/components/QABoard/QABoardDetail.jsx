import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './QABoard.css';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const QABoardDetail = () => {
  const navigate = useNavigate();
  const { boardNoSeq } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const token = localStorage.getItem('token');
  const { name: currentUser, role } = token
    ? JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))))
    : {};
  const isAdmin = role === 'ROLE_ADMIN';

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    let isMounted = true;

    const fetchPost = async () => {
      try {
        await axios.put(`${serverIp}/QABoard/increaseReadnum/${boardNoSeq}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const response = await axios.get(`${serverIp}/QABoard/${boardNoSeq}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log("서버 응답 전체 데이터:", response);
        
        console.log("response.data:", response.data);
        
        console.log("파일 정보:", response.data.file);
        
        if (isMounted) {
          setPost(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        if (isMounted) {
          setError('게시글을 불러오는데 실패했습니다.');
          setIsLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [boardNoSeq, navigate, token]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await axios.get(`${serverIp}/QaReplyBoard/${boardNoSeq}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setReplies(response.data);
      } catch (error) {
        console.error('댓글 조회 실패:', error);
      }
    };

    if (boardNoSeq) {
      fetchReplies();
    }
  }, [boardNoSeq, token]);

  const handleDelete = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`${serverIp}/QABoard/${boardNoSeq}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('게시글이 삭제되었습니다.');
      navigate('/customer-service');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('comment', replyContent);
    formData.append('qaBoard', JSON.stringify({ boardNoSeq }));
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      await axios.post(
        `${serverIp}/QaReplyBoard/${boardNoSeq}`,
        { 
          comment: replyContent,
          qaBoard: { boardNoSeq: boardNoSeq }
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setReplyContent('');
      setSelectedFile(null);

      const repliesResponse = await axios.get(
        `${serverIp}/QaReplyBoard/${boardNoSeq}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      alert('댓글 등록에 성공했습니다.');

      setReplies(repliesResponse.data);
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      if (error.response?.status === 403) {
        alert('관리자만 댓글을 등록할 수 있습니다.');
      } else {
        alert('댓글 등록에 실패했습니다.');
      }
    }
  };

  const handleFileDownload = async () => {
    if (!post?.filePath) {
      console.error('파일 경로가 없습니다.');
      alert('파일 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      console.log("다운로드 시도:", post.filePath);
      
      const response = await axios.get(`${serverIp}/QABoard/downloadFile/${boardNoSeq}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });
      
      console.log("다운로드 응답:", response);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', post.fileName || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  const renderFileContent = () => {
    console.log("파일 정보:", post?.fileName, post?.filePath);
    
    if (!post?.filePath) {
      console.log("파일 정보 없음");
      return null;
    }

    const fileName = post.fileName || '다운로드';
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);
    
    console.log("파일명:", fileName);
    console.log("이미지 여부:", isImage);
    console.log("파일 경로:", post.filePath);

    return (
      <div className="file-content-section">
        {isImage && (
          <div className="image-preview">
            <img 
              src={post.filePath} 
              alt="첨부 이미지" 
              className="attached-image"
              onError={(e) => {
                console.error("이미지 로드 실패");
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="file-download-section">
          <span className="file-label">첨부파일: </span>
          <button 
            onClick={handleFileDownload}
            className="file-download-button"
          >
            <span className="file-name">{fileName}</span>
            <span className="download-icon">⬇️</span>
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="qa-detail-container">
      <h2>문의 상세</h2>
      <div className="qa-detail-content">
        <div className="detail-header">
          <h3>{post.subject}</h3>
          <div className="detail-info">
            <span>작성자: {post.writerId}</span>
            <span>작성일: {new Date(post.regDate).toLocaleDateString()}</span>
            <span>조회수: {post.readnum}</span>
          </div>
        </div>
        <div className="detail-body">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(post.content) 
            }} 
          />
          <div>
            {post?.file ? (
              <div>파일 존재: {JSON.stringify(post.file)}</div>
            ) : (
              <div>파일 없음</div>
            )}
          </div>
          {renderFileContent()}
        </div>
        <div className="detail-buttons">
          <button 
            onClick={() => navigate('/customer-service')} 
            className="list-button"
          >
            목록
          </button>
          
          {currentUser === post.writerId && (
            <button 
              onClick={() => navigate(`/customer-service/edit/${post.boardNoSeq}`)} 
              className="edit-button"
            >
              수정
            </button>
          )}

          {isAdmin && (
            <button 
              onClick={handleDelete} 
              className="delete-button"
            >
              삭제
            </button>
          )}
        </div>
      </div>
      
      <div className="qa-reply-section">
        <h3>답변</h3>
        {isAdmin && (
          <form onSubmit={handleReplySubmit} encType="multipart/form-data">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답변을 입력하세요"
              required
            />
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button type="submit">답변 등록</button>
          </form>
        )}
        
        <div className="reply-list">
          {replies.map(reply => (
            <div key={reply.replyNoSeq} className="reply-item">
              <div className="reply-header">
                <span>{reply.writerId}</span>
                <span>{new Date(reply.regDate).toLocaleDateString()}</span>
              </div>
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(reply.comment) 
                }} 
              />
              {reply.fileUrl && (
                <div className="reply-file">
                  <a href={reply.fileUrl} target="_blank" rel="noopener noreferrer">
                    첨부파일
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div> 
    </div>
  );
};

export default QABoardDetail;
