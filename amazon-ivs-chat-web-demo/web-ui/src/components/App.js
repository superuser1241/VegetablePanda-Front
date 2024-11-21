import React, { useState } from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import MainPage from './MainPage/MainPage';
import LoginForm from './Login/LoginForm';
import StreamingParticular from './StreamingSetting/StreamingParticular';
import ConfirmationPage from './StreamingSetting/ConfirmationPage';
import Chat from './chat/Chat';
import AdminApprovalPage from './Admin/AdminApprovalPage';
import axios from 'axios';

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

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:9001/api/logout', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            localStorage.removeItem('token');
            setUserName('');
            setUserRole('');
            navigateTo('login');
            alert('로그아웃 되었습니다.');
        } catch (error) {
            console.error('로그아웃 실패:', error);
            alert('사용자 정보가 틀립니다');
        }
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
            </main>
            <Footer />
        </div>
    );
}

export default App;
