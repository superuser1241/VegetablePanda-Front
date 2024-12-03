import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './common/Header';
import Footer from './common/Footer';
import MainPage from './MainPage/MainPage';
import LoginForm from './Login/LoginForm';
import Chat from './chat/Chat';
import AdminMyPage from './myPage/AdminMyPage';
import UserMyPage from './myPage/UserMyPage';
import CompanyMyPage from './myPage/CompanyMyPage';
import FarmerMyPage from './myPage/FarmerMyPage';
import FarmerRegisterStock from './myPage/RegisterStock';
import UserRegister from './Register/UserRegister';
import FarmerRegister from './Register/FarmerRegister';
import CompanyRegister from './Register/CompanyRegister';
import QABoardList from './QABoard/QABoardList';
import QABoardWrite from './QABoard/QABoardWrite';
import QABoardEdit from './QABoard/QABoardEdit';
import QABoardDetail from './QABoard/QABoardDetail';
import Purchase from './Purchase/Purchase';
import Payment from './Purchase/Payment';
import NTBoardList from './NoticeBoard/NTBoardList';
import NotifyBoardWrite from './NoticeBoard/NTBoardWrite';
import NTBoardEdit from './NoticeBoard/NTBoardEdit';
import NotifyBoardDetail from './NoticeBoard/NTBoardDetail';
import NotiSet from './Notification/NotiSet';
import BidPage from './auction/BidPage';
import AuctionRegisterPage from './auction/AuctionRegisterPage';
import AuctionChatPage from './auction/AuctionChatPage';
import Product from './product/Product';
import Shop from './product/Shop';
import PurchaseD from './Purchase/PurchaseD';
import Personal from './personal/Personal';
import CartPage from './product/CartPage';

function App() {
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [streamingRoom, setStreamingRoom] = useState(null);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('App.js - streamingRoom updated:', streamingRoom);
    }, [streamingRoom]);

    const handleLoginSuccess = (name, role) => {
        setUserName(name);
        setUserRole(role);
        navigate('/');
    };

    const handleLogout = () => {
        setUserName('');
        setUserRole('');
        navigate('/');
        localStorage.removeItem("token");
        localStorage.setItem("token", null);
        alert('로그아웃 되었습니다.');
    };

    const handleJoinRoom = (room) => {
        setStreamingRoom(room);
        setCurrentRoomId(room.chatRoomId);
        navigate('/chat');
    };

    const handleStartStreaming = (room) => {
        console.log('App.js - Setting streamingRoom:', room);
        setStreamingRoom(room);
        navigate('/chat');
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
                    } else {
                        setUserName(payload.name);
                        setUserRole(payload.role);
                    }
                } catch (error) {
                    console.error('토큰 디코딩 실패:', error);
                    localStorage.removeItem('token');
                    setUserName('');
                    setUserRole('');
                }
            }
        };
        checkAuthStatus();
    }, [navigate]);

    const handleExitChat = useCallback(async () => {
        try {
            setStreamingRoom(null);
            setCurrentRoomId(null);
            navigate('/');
            return Promise.resolve();
        } catch (error) {
            console.error('Exit chat error:', error);
            return Promise.reject(error);
        }
    }, [navigate]);

    const handleSetStreamingRoom = (room) => {
        handleJoinRoom(room);
    };

    return (
        <div className="App">
            {userName&&<NotiSet onSetStreamingRoom={handleSetStreamingRoom}/>}
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
                    <Route
                        path="/chat"
                        element={
                            <AuctionChatPage
                                streamingRoom={streamingRoom}
                                handleExitChat={handleExitChat}
                                confirmed={true}
                            />
                        }
                    />
                    <Route path="/admin-mypage" element={userRole === 'ROLE_ADMIN' && <AdminMyPage navigateTo={navigate} />} />
                    <Route path="/user-mypage" element={userRole === 'ROLE_USER' && <UserMyPage navigateTo={navigate} />} />
                    <Route path="/company-mypage" element={userRole === 'ROLE_COMPANY' && <CompanyMyPage navigateTo={navigate} />} />
                    <Route path="/farmer-mypage" element={
                        userRole === 'ROLE_FARMER' && 
                        <FarmerMyPage 
                            navigateTo={navigate} 
                            onStartStreaming={handleStartStreaming}
                        />
                    } />
                    <Route path="/customer-service" element={<QABoardList />} />
                    <Route path="/customer-service/write" element={<QABoardWrite />} />
                    <Route path="/customer-service/edit/:boardNoSeq" element={<QABoardEdit />} />
                    <Route path="/customer-service/:boardNoSeq" element={<QABoardDetail />} />
                    <Route path="/notify-service" element={<NTBoardList />} />
                    <Route path="/notify-service/write" element={<NotifyBoardWrite />} />
                    <Route path="/notify-service/edit/:boardNoSeq" element={<NTBoardEdit />} />
                    <Route path="/notify-service/:boardNoSeq" element={<NotifyBoardDetail />} />
                    <Route path="/purchase" element={<Purchase />} />
                    <Route path="/purchaseD" element={<PurchaseD userName={userName}/>} />
                    <Route path="/personal" element={userRole === 'ROLE_FARMER' && <Personal navigateTo={navigate} />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/auction/register" element={<AuctionRegisterPage />} />
                    <Route path="/auction/:auctionSeq" element={<BidPage />} />
                    <Route path="/product/:stockSeq" element={<Product/>}/>
                    <Route path="/shop" element={<Shop/>}/>
                    <Route path="/cart" element={<CartPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;