import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './common/Header';
import Footer from './common/Footer';
import MainPage from './MainPage/MainPage';
import LoginForm from './Login/LoginForm';
import StreamingParticular from './StreamingSetting/StreamingParticular';
import ConfirmationPage from './StreamingSetting/ConfirmationPage';
import Chat from './chat/Chat';
import AdminMyPage from './myPage/AdminMyPage';
import UserMyPage from './myPage/UserMyPage';
import CompanyMyPage from './myPage/CompanyMyPage';
import FarmerMyPage from './myPage/FarmerMyPage';
import FarmerRegisterStock from './myPage/RegisterStock';
import NotiSet from './Notification/NotiSet';
import UserRegister from './Register/UserRegister';
import FarmerRegister from './Register/FarmerRegister';
import CompanyRegister from './Register/CompanyRegister';
import QABoardList from './QABoard/QABoardList';
import QABoardWrite from './QABoard/QABoardWrite';
import QABoardEdit from './QABoard/QABoardEdit';
import QABoardDetail from './QABoard/QABoardDetail';
import Purchase from './Purchase/Purchase';
import Payment from './Purchase/Payment';
import axios from 'axios';

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
                    axios.get('http://localhost:9001/api/user', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => {
                        const userData = response.data;
                        setUserName(userData.name);
                        setUserRole(userData.role);
                    })
                    .catch(() => {
                        localStorage.removeItem('token');
                        setUserName('');
                        setUserRole('');
                    });
                } catch (error) {
                    console.error('인증 확인 실패:', error);
                    localStorage.removeItem('token');
                    setUserName('');
                    setUserRole('');
                }
            }
        };
        checkAuthStatus();
    }, []);

    return (
        <div className="App">
            <Header
                userName={userName}
                userRole={userRole}
                handleLogout={handleLogout}
            />
            <main style={{ minHeight: '80vh'}}>
                <Routes>
                    <Route path="/" element={<MainPage onJoinRoom={handleJoinRoom} />} />
                    <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/UserRegister" element={<UserRegister />} />
                    <Route path="/CompanyRegister" element={<CompanyRegister />} />
                    <Route path="/FarmerRegister" element={<FarmerRegister />} />

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
                    {/* <Route path="/admin" element={
                        <AdminApprovalPage
                            streamingRoom={streamingRoom}
                            setStreamingRoom={setStreamingRoom}
                        />
                    } /> */}
                    <Route path="/register-stock" element = {<FarmerRegisterStock/> }/>
                    
                    <Route path="/admin-mypage" element={userRole === 'ROLE_ADMIN' && <AdminMyPage navigateTo={navigate} />} />
                    <Route path="/user-mypage" element={userRole === 'ROLE_USER' && <UserMyPage navigateTo={navigate} />} />
                    <Route path="/company-mypage" element={userRole === 'ROLE_COMPANY' && <CompanyMyPage navigateTo={navigate} />} />
                    <Route path="/farmer-mypage" element={userRole === 'ROLE_FARMER' && <FarmerMyPage navigateTo={navigate} />} />
                    <Route path="/customer-service" element={<QABoardList />} />
                    <Route path="/customer-service/write" element={<QABoardWrite />} />
                    <Route path="/customer-service/edit/:boardNoSeq" element={<QABoardEdit />} />
                    <Route path="/customer-service/:boardNoSeq" element={<QABoardDetail />} />
                    <Route path="/purchase" element={<Purchase />} />
                    <Route path="/payment" element={<Payment />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
