import React, { useState, useEffect } from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import MainPage from './MainPage/MainPage';
import LoginForm from './Login/LoginForm';
import StreamingParticular from './StreamingSetting/StreamingParticular';
import ConfirmationPage from './StreamingSetting/ConfirmationPage';
import Chat from './chat/Chat';
import AdminApprovalPage from './Admin/AdminApprovalPage';
import AdminMyPage from './Admin/AdminMyPage';

function App() {
    const [currentPage, setCurrentPage] = useState('main');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [streamingRoom, setStreamingRoom] = useState(null);
    const [currentRoomId, setCurrentRoomId] = useState(null);

    const navigateTo = (page) => {
        setCurrentPage(page);
    };

    const handleLoginSuccess = (name, role) => {
        setUserName(name);
        setUserRole(role);
        navigateTo('main');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserName('');
        setUserRole('');
        navigateTo('main');
        alert('로그아웃 되었습니다.');
    };

    const handleJoinRoom = (room) => {
        setStreamingRoom(room);
        setCurrentRoomId(room.chatRoomId);
        navigateTo(userRole !== 'ROLE_FARMER' ? 'chat' : 'confirmation');
    };

    const handleConfirm = () => {
        console.log('입장 확인 - streamingRoom:', streamingRoom);
        navigateTo('chat');
    };

    const handleCancel = () => {
        alert('입장이 취소되었습니다.');
        navigateTo('main');
    };

    const handleExitChat = () => {
        alert('채팅방에서 나왔습니다.');
        setStreamingRoom(null);
        setCurrentRoomId(null);
        navigateTo('main');
    };

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // JWT 토큰 디코딩 시 한글 처리
                    const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
                    if (Date.now() >= payload.exp * 1000) {
                        localStorage.removeItem('token');
                        setUserName('');
                        setUserRole('');
                        navigateTo('login');
                    } else {
                        setUserName(payload.name);
                        setUserRole(payload.role);
                    }
                } catch (error) {
                    // ... 에러 처리 ...
                }
            }
        };
        checkAuthStatus();
    }, []);

    return (
        <div className="App">
            <Header
                navigateTo={navigateTo}
                userName={userName}
                userRole={userRole}
                handleLogout={handleLogout}
            />
            <main style={{ minHeight: '80vh', padding: '20px' }}>
                {currentPage === 'main' && <MainPage onJoinRoom={handleJoinRoom} />}
                {currentPage === 'login' && <LoginForm onLoginSuccess={handleLoginSuccess} />}
                {currentPage === 'streaming' && (
                    <StreamingParticular
                        streamingRoom={streamingRoom}
                        setStreamingRoom={setStreamingRoom}
                        setCurrentRoomId={setCurrentRoomId}
                        onEnterChat={() => navigateTo('confirmation')}
                    />
                )}
                {currentPage === 'confirmation' && (
                    <ConfirmationPage
                        streamingRoom={streamingRoom}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                )}
                {currentPage === 'chat' && (
                    <Chat
                        streamingRoom={streamingRoom}
                        userName={userName}
                        chatRoomId={currentRoomId}
                        handleExitChat={handleExitChat}
                    />
                )}
                {currentPage === 'admin' && (
                    <AdminApprovalPage
                        streamingRoom={streamingRoom}
                        setStreamingRoom={setStreamingRoom}
                    />
                )}
                {currentPage === 'admin-mypage' && userRole === 'ROLE_ADMIN' && (
                    <AdminMyPage />
                )}
            </main>
            <Footer />
        </div>
    );
}

export default App;
