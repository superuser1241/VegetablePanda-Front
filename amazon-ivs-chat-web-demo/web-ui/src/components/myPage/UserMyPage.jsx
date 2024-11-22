import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserMyPage.css';

const UserMyPage = () => {
    const [watchHistory, setWatchHistory] = useState([]);
    const [chargeAmount, setChargeAmount] = useState('');
    const token = localStorage.getItem('token');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserId(payload.user_seq);
            } catch (error) {
                console.error('토큰 파싱 실패:', error);
            }
        }
    }, [token]);

    const handleCharge = async () => {
        try {
            if (!userId || !chargeAmount) {
                alert('충전할 금액을 입력해주세요.');
                return;
            }

            const response = await axios.post('http://localhost:9001/charge', {
                managementUserSeq: parseInt(userId),
                price: parseInt(chargeAmount)
            }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data) {
                setChargeAmount('');
                window.location.href = response.data;
            }
        } catch (error) {
            console.error('포인트 충전 실패:', error);
            alert('포인트 충전에 실패했습니다.');
        }
    };

    return (
        <div className="user-mypage">
            <h2>사용자 마이페이지</h2>
            
            <div className="charge-section">
                <h3>포인트 충전</h3>
                <div className="charge-input-group">
                    <input
                        type="number"
                        value={chargeAmount}
                        onChange={(e) => setChargeAmount(e.target.value)}
                        placeholder="충전할 금액을 입력하세요"
                        className="charge-input"
                    />
                    <button onClick={handleCharge} className="charge-button">
                        충전하기
                    </button>
                </div>
            </div>

            <div className="watch-history">
                <h3>시청 기록</h3>
                <table>
                    <thead>
                        <tr>
                            <th>스트리밍 제목</th>
                            <th>농부님</th>
                            <th>시청 날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {watchHistory.map((history) => (
                            <tr key={history.id}>
                                <td>{history.streamTitle}</td>
                                <td>{history.farmerName}</td>
                                <td>{new Date(history.watchedAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserMyPage; 