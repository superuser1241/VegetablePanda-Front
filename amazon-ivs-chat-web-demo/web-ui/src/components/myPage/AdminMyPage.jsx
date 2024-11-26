import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminMyPage.css';

const AdminMyPage = () => {
    const token = localStorage.getItem('token');
    const [activeTab, setActiveTab] = useState('info');
    const [pendingProducts, setPendingProducts] = useState([]);
    const [adminInfo, setAdminInfo] = useState({
        name: '',
        id: '',
        role: ''
    });
    const [pendingStreamings, setPendingStreamings] = useState([]);
    const [approvalTriggered, setApprovalTriggered] = useState(false);

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
            const response = await axios.get('http://localhost:9001/stock/pending', {
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
            const response = await axios.get('http://localhost:9001/api/streaming/pending', {
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

    const handleApprove = async (stockSeq) => {
        try {
            await axios.put(`http://localhost:9001/stock/approve/${stockSeq}`, {}, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('상품이 승인되었습니다.');
            fetchPendingProducts(); // 목록 새로고침
        } catch (error) {
            console.error('상품 승인 실패:', error);
            alert('상품 승인에 실패했습니다.');
        }
    };

    const handleApproveStreaming = async (streamingSeq) => {
        try {
            await axios.post(`http://localhost:9001/api/streaming/approve/${streamingSeq}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(`스트리밍 ${streamingSeq}이 승인되었습니다.`);
            setApprovalTriggered((prev) => !prev);
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
                    <li onClick={() => setActiveTab('info')} className={activeTab === 'info' ? 'active' : ''}>
                        관리자 정보
                    </li>
                    <li onClick={() => setActiveTab('streaming')} className={activeTab === 'streaming' ? 'active' : ''}>
                        스트리밍 승인
                    </li>
                    <li onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>
                        상품 승인
                    </li>
                    <li onClick={() => setActiveTab('stats')} className={activeTab === 'stats' ? 'active' : ''}>
                        통계
                    </li>
                </ul>
            </div>

            <div className="admin-content">
                {activeTab === 'info' && (
                    <div className="admin-info-section">
                        <h2>관리자 정보</h2>
                        <div className="admin-info-card">
                            <p><strong>이름:</strong> {adminInfo.name}</p>
                            <p><strong>아이디:</strong> {adminInfo.id}</p>
                            <p><strong>역할:</strong> {adminInfo.role}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'streaming' && (
                    <div className="streaming-section">
                        <h2>스트리밍 승인 관리</h2>
                        {pendingStreamings.length === 0 ? (
                            <p>승인 대기중인 스트리밍이 없습니다.</p>
                        ) : (
                            <table className="streaming-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>서버 주소</th>
                                        <th>상태</th>
                                        <th>액션</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingStreamings.map((room) => (
                                        <tr key={room.streamingSeq}>
                                            <td>{room.streamingSeq}</td>
                                            <td>{room.serverAddress}</td>
                                            <td>{room.state === 2 ? '승인 대기중' : '알 수 없음'}</td>
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

                {activeTab === 'products' && (
                    <div className="products-section">
                        <h2>상품 승인 관리</h2>
                        <div className="pending-products">
                            {pendingProducts.length === 0 ? (
                                <p>승인 대기중인 상품이 없습니다.</p>
                            ) : (
                                <table className="products-table">
                                    <thead>
                                        <tr>
                                            <th>상품 번호</th>
                                            <th>설명</th>
                                            <th>수량</th>
                                            <th>등급</th>
                                            <th>재배방식</th>
                                            <th>액션</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingProducts.map(product => (
                                            <tr key={product.stockSeq}>
                                                <td>{product.productSeq}</td>
                                                <td>{product.content}</td>
                                                <td>{product.count}</td>
                                                <td>{product.stockGradeSeq === "1" ? "상" : 
                                                    product.stockGradeSeq === "2" ? "중" : "하"}</td>
                                                <td>{product.stockOrganicSeq === "1" ? "유기농" : 
                                                    product.stockOrganicSeq === "2" ? "무농약" : "일반"}</td>
                                                <td>
                                                    <button 
                                                        onClick={() => handleApprove(product.stockSeq)}
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
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="stats-section">
                        <h2>통계</h2>
                        {/* 통계 관련 컴포넌트 */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMyPage; 