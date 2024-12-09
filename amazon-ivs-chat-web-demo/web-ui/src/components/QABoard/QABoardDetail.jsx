import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './QABoard.css';
import DOMPurify from 'dompurify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const QABoardDetail = () => {
  const navigate = useNavigate();
  const { boardNoSeq } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([]);

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
          console.log('현재 사용자 정보:', {
            id: payload.id,
            role: payload.role
          });
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
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${serverIp}/QABoard/${boardNoSeq}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        console.log('게시글 데이터:', response.data);
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        setError('게시글을 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [boardNoSeq, checkAuthStatus]);

  useEffect(() => {
    const fetchReplies = async () => {
      const token = checkAuthStatus();
      if (!token) return;

      try {
        const response = await axios.get(
          `${serverIp}/QaReplyBoard/${boardNoSeq}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setReplies(response.data);
      } catch (error) {
        console.error('댓글 로딩 실패:', error);
      }
    };

    if (post) {
      fetchReplies();
    }
  }, [boardNoSeq, post]);

  const handleDelete = async () => {
    if (!boardNoSeq) {
      console.error('게시글 번호가 유효하지 않습니다:', boardNoSeq);
      alert('게시글 정보를 찾을 수 없습니다.');
      return;
    }

    console.log('삭제 시도하는 게시글 번호:', boardNoSeq);
    console.log('현재 게시글 정보:', post);

    if (!window.confirm(`해당 게시글을 정말로 삭제하시겠습니까?`)) return;

    const token = checkAuthStatus();
    if (!token) {
      alert('인증이 필요합니다.');
      return;
    }

    try {
      console.log('삭제 요청 전송:', `${serverIp}/QABoard/${boardNoSeq}`);
      
      const response = await axios.delete(
        `${serverIp}/QABoard/${boardNoSeq}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('삭제 응답:', response);

      if (response.status === 200) {
        alert(`${boardNoSeq}번 게시글이 성공적으로 삭제되었습니다.`);
        navigate('/customer-service');
      }
    } catch (error) {
      console.error('게시글 삭제 실패 - 상세 정보:', {
        boardNoSeq,
        error: error.response?.data || error.message,
        status: error.response?.status
      });
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            alert('로그인이 필요합니다.');
            break;
          case 403:
            alert('삭제 권한이 없습니다.');
            break;
          case 404:
            alert(`${boardNoSeq}번 게시글을 찾을 수 없습니다.`);
            break;
          default:
            alert(`게시글 삭제 중 오류가 발생했습니다. (에러 코드: ${error.response.status})`);
        }
      } else {
        alert('서버와의 통신 중 오류가 발생했습니다.');
      }
    }
  };

  const handleFileDownload = async () => {
    if (!post?.fileDTO?.path) {
      alert('다운로드할 파일이 없습니다.');
      return;
    }

    const token = checkAuthStatus();
    if (!token) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    try {
      const response = await axios.get(
        `${serverIp}/QABoard/downloadFile/${boardNoSeq}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const contentType = response.headers['content-type'];
      const contentDisposition = response.headers['content-disposition'];
      let fileName = post.fileDTO.name;

      if (contentDisposition) {
        const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (matches != null && matches[1]) {
          fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
        }
      }

      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  const handleReplySubmit = async () => {
    if (!reply.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    const token = checkAuthStatus();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await axios.post(
        `${serverIp}/QaReplyBoard/${boardNoSeq}`,
        { comment: reply },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      setReplies(prevReplies => [...prevReplies, response.data]);
      setReply('');
      alert('답변이 등록되었습니다.');
    } catch (error) {
      console.error('답변 등록 실패:', error);
      if (error.response?.status === 403) {
        alert('답변 작성 권한이 없습니다.');
      } else {
        alert('답변 등록에 실패했습니다.');
      }
    }
  };

  const handleReplyDelete = async (replySeq) => {
    if (!window.confirm('답변을 삭제하시겠습니까?')) return;

    const token = checkAuthStatus();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.delete(
        `${serverIp}/QaReplyBoard/${boardNoSeq}/${replySeq}`,
        { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }
      );

      setReplies(prevReplies => prevReplies.filter(reply => reply.replySeq !== replySeq));
      alert('답변이 삭제되었습니다.');
    } catch (error) {
      console.error('답변 삭제 실패:', error);
      alert('답변 삭제에 실패했습니다.');
    }
  };

  const renderFileContent = () => {
    if (!post?.fileDTO?.path) return null;

    const fileName = post.fileDTO.name;
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);

    return (
      <div className="file-content-section">
        {isImage && (
          <div className="image-preview">
            <img 
              src={post.fileDTO.path}
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

  const renderReplySection = () => {
    if (userRole !== 'ROLE_ADMIN') return null;

    return (
      <div className="reply-section">
        <h3>답변 작성</h3>
        <div className="reply-editor">
          <ReactQuill
            value={reply}
            onChange={setReply}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                ['link', 'clean']
              ]
            }}
            style={{ height: '200px', marginBottom: '50px' }}
          />
        </div>
        <button 
          onClick={handleReplySubmit}
          className="reply-submit-button"
        >
          답변 등록
        </button>
      </div>
    );
  };

  const renderReplies = () => {
    if (!replies.length) return null;

    return (
      <div className="replies-list">
        <h3>답변 목록</h3>
        {replies.map(reply => (
          <div key={reply.replySeq} className="reply-item">
            <div className="reply-content" 
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.comment) }} 
            />
            <div className="reply-info">
              <span className="reply-date">
                {new Date(reply.createTime).toLocaleDateString()}
              </span>
              {userRole === 'ROLE_ADMIN' && (
                <button 
                  onClick={() => handleReplyDelete(reply.replySeq)}
                  className="reply-delete-button"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!isAuthenticated) return (
    <div className="auth-warning">
      <p>로그인이 필요한 페이지입니다.</p>
      <button onClick={() => navigate('/login')} className="login-button">
        로그인하기
      </button>
    </div>
  );
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="qa-detail-container">
      <div className="qa-detail-header">
        <h2>{post.subject}</h2>
        <div className="post-info">
          <span>작성자: {post.writerId}</span>
          <span>작성일: {new Date(post.regDate).toLocaleDateString()}</span>
          <span>조회수: {post.readnum}</span>
        </div>
      </div>

      <div className="qa-detail-content">
        <div className="content-wrapper">
          <div 
            className="post-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} 
          />
        </div>
      </div>

      <div className="qa-detail-attachment">
        {renderFileContent()}
      </div>

      <div className="qa-detail-actions">
        <button onClick={() => navigate('/customer-service')} className="list-button">
          목록
        </button>
        {isAuthenticated && userName === post.writerId && (
          <>
            <button onClick={() => navigate(`/customer-service/edit/${boardNoSeq}`)} className="edit-button">
              수정
            </button>
            <button onClick={handleDelete} className="delete-button">
              삭제
            </button>
          </>
        )}
      </div>

      <div className="qa-detail-reply">
        {renderReplySection()}
      </div>

      <div className="qa-detail-replies">
        {renderReplies()}
      </div>
    </div>
  );
};

export default QABoardDetail;