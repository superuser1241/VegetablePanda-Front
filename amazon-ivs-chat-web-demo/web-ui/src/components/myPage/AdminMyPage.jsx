import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminMyPage.css';
import AuctionStatus from '../auction/AuctionStatus';
import AdjustmentPage from './AdjustmentPage';
import UserStatistics from './UserStatistics';
import ProductStatistics from './ProductStatistics';

const AdminMyPage = () => {
    const token = localStorage.getItem('token');
    const [activeTab, setActiveTab] = useState('stats');
    const [pendingProducts, setPendingProducts] = useState([]);
    const [adminInfo, setAdminInfo] = useState({
        name: '',
        id: '',
        role: ''
    });
    const [pendingStreamings, setPendingStreamings] = useState([]);
    const [approvalTriggered, setApprovalTriggered] = useState(false);
    const serverIp = process.env.REACT_APP_SERVER_IP;
    const [statsType, setStatsType] = useState('product');

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
                setAdminInfo({
                    name: payload.name,
                    id: payload.id,
                    role: payload.role,
                });
            } catch (error) {
                console.error('토큰 디코딩 실패:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        if (activeTab === 'products') {
            fetchPendingProducts();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'streaming') {
            fetchPendingStreamings();
            const interval = setInterval(fetchPendingStreamings, 5000);
            return () => clearInterval(interval);
        }
    }, [activeTab, approvalTriggered]);

    const fetchPendingProducts = async () => {
        try {
            const response = await axios.get(`${serverIp}/stock/pending`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setPendingProducts(response.data);
        } catch (error) {
            console.error('승인 대기 상품 조회 실패:', error);
        }
    };

    const fetchPendingStreamings = async () => {
        try {
            const response = await axios.get(`${serverIp}/api/streaming/pending`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                const filteredStreamings = response.data.filter((stream) => stream.state === 2);
                setPendingStreamings(filteredStreamings);
            }
        } catch (error) {
            console.error('Failed to fetch pending streamings:', error);
        }
    };

    const handleApproveStreaming = async (streamingSeq) => {
        try {
            await axios.post(`${serverIp}/api/streaming/approve/${streamingSeq}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(`스트리밍 ${streamingSeq}이 승인되었습니다.`);
            
            setPendingStreamings(prev => prev.filter(stream => stream.streamingSeq !== streamingSeq));
            
            if (pendingStreamings.length === 1) {
                setTimeout(() => {
                    setActiveTab('info');
                }, 1000);
            }
        } catch (error) {
            console.error('Failed to approve streaming:', error);
            alert('승인 작업 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="admin-mypage">
            <div className="admin-sidebar">
                <h3>관리자 메뉴</h3>
                <ul>
                    <li onClick={() => setActiveTab('stats')} className={activeTab === 'stats' ? 'active' : ''}>
                        통계
                    </li>
                    <li onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>
                        승인 대기 상품
                    </li>
                    <li onClick={() => setActiveTab('streaming')} className={activeTab === 'streaming' ? 'active' : ''}>
                        스트리밍 승인
                    </li>
                    <li onClick={() => setActiveTab('settlements')} className={activeTab === 'settlements' ? 'active' : ''}>
                        정산 승인
                    </li>
                    <li onClick={() => setActiveTab('auctions')} className={activeTab === 'auctions' ? 'active' : ''}>
                        실시간 경매 현황
                    </li>
                </ul>
            </div>

            <div className="admin-content">
                {activeTab === 'stats' && (
                    <div className="stats-section">
                        <h2>통계</h2>
                        <div className="stats-tabs">
                            <button onClick={() => setStatsType('product')} className={statsType === 'product' ? 'active' : ''}>
                                상품 통계
                            </button>
                            <button onClick={() => setStatsType('user')} className={statsType === 'user' ? 'active' : ''}>
                                회원 통계
                            </button>
                        </div>
                        {statsType === 'product' ? (
                            <ProductStatistics />
                        ) : (
                            <UserStatistics />
                        )}
                    </div>
                )}

                {activeTab === 'streaming' && (
                    <div className="streaming-section-Admin">
                        <h2>스트리밍 승인 관리</h2>
                        {pendingStreamings.length === 0 ? (
                            <p>승인 대기중인 스트리밍이 없습니다.</p>
                        ) : (
                            <table className="streaming-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>농가명</th>
                                        <th>상품 이미지</th>
                                        <th>상품명</th>
                                        <th>상태</th>
                                        <th>액션</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingStreamings.map((room) => (
                                        <tr key={room.streamingSeq}>
                                            <td>{room.streamingSeq}</td>
                                            <td>{room.farmerName}</td>
                                            <td>
                                                <img 
                                                    src={room.filePath} 
                                                    alt={room.productName}
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td>{room.productName}</td>
                                            <td>
                                                {room.state === 2 ? '승인 대기중' : 
                                                 room.state === 1 ? '승인 완료' : 
                                                 room.state === 0 ? '방송 종료' : '알 수 없음'}
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => handleApproveStreaming(room.streamingSeq)}
                                                    className="approve-button"
                                                >
                                                    승인하기
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'settlements' && (
                    <div className="settlements-section">
                        <AdjustmentPage />
                    </div>
                )}

                {activeTab === 'auctions' && (
                    <div className="auctions-section">
                        <h2>실시간 경매 현황</h2>
                        <AuctionStatus />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMyPage; 