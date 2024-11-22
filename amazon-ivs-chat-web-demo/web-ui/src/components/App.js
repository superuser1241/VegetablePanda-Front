import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './common/Header';
import Footer from './common/Footer';
import MainPage from './MainPage/MainPage';
import LoginForm from './Login/LoginForm';
import StreamingParticular from './StreamingSetting/StreamingParticular';
import ConfirmationPage from './StreamingSetting/ConfirmationPage';
import Chat from './chat/Chat';
import AdminApprovalPage from './admin/AdminApprovalPage';
import AdminMyPage from './myPage/AdminMyPage';
import UserMyPage from './myPage/UserMyPage';
import CompanyMyPage from './myPage/CompanyMyPage';
import FarmerMyPage from './myPage/FarmerMyPage';

function App() {
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [streamingRoom, setStreamingRoom] = useState(null);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (name, role) => {
        setUserName(name);
        setUserRole(role);
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserName('');
        setUserRole('');
        navigate('/');
        alert('로그아웃 되었습니다.');
    };

    const handleJoinRoom = (room) => {
        setStreamingRoom(room);
        setCurrentRoomId(room.chatRoomId);
        navigate(userRole !== 'ROLE_FARMER' ? '/chat' : '/confirmation');
    };

    const handleConfirm = () => {
        console.log('입장 확인 - streamingRoom:', streamingRoom);
        navigate('/chat');
    };

    const handleCancel = () => {
        alert('입장이 취소되었습니다.');
        navigate('/');
    };

    const handleExitChat = () => {
        alert('채팅방에서 나왔습니다.');
        setStreamingRoom(null);
        setCurrentRoomId(null);
        navigate('/');
    };

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
                    if (Date.now() >= payload.exp * 1000) {
                        localStorage.removeItem('token');
                        setUserName('');
                        setUserRole('');
                        navigate('/login');
                    } else {
                        setUserName(payload.name);
                        setUserRole(payload.role);
                    }
                } catch (error) {
                    console.error('토큰 디코딩 실패:', error);
                    navigate('/login');
                }
            }
        };
        checkAuthStatus();
    }, [navigate]);

    return (
        <div className="App">
            <Header
                userName={userName}
                userRole={userRole}
                handleLogout={handleLogout}
            />
            <main style={{ minHeight: '80vh', padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<MainPage onJoinRoom={handleJoinRoom} />} />
                    <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/streaming" element={
                        <StreamingParticular
                            streamingRoom={streamingRoom}
                            setStreamingRoom={setStreamingRoom}
                            setCurrentRoomId={setCurrentRoomId}
                            onEnterChat={() => navigate('/confirmation')}
                        />
                    } />
                    <Route path="/confirmation" element={
                        <ConfirmationPage
                            streamingRoom={streamingRoom}
                            onConfirm={handleConfirm}
                            onCancel={handleCancel}
                        />
                    } />
                    <Route path="/chat" element={
                        <Chat
                            streamingRoom={streamingRoom}
                            userName={userName}
                            chatRoomId={currentRoomId}
                            handleExitChat={handleExitChat}
                        />
                    } />
                    <Route path="/admin" element={
                        <AdminApprovalPage
                            streamingRoom={streamingRoom}
                            setStreamingRoom={setStreamingRoom}
                        />
                    } />
                    <Route path="/admin-mypage" element={userRole === 'ROLE_ADMIN' && <AdminMyPage navigateTo={navigate} />} />
                    <Route path="/user-mypage" element={userRole === 'ROLE_USER' && <UserMyPage navigateTo={navigate} />} />
                    <Route path="/company-mypage" element={userRole === 'ROLE_COMPANY' && <CompanyMyPage navigateTo={navigate} />} />
                    <Route path="/farmer-mypage" element={userRole === 'ROLE_FARMER' && <FarmerMyPage navigateTo={navigate} />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
