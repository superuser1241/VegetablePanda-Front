import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompanyMyPage.css';

const CompanyMyPage = ({ navigateTo }) => {
    const [chargeAmount, setChargeAmount] = useState('');
    const [userId, setUserId] = useState('');
    const token = localStorage.getItem('token');

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
                alert('모든 값을 입력하세요.');
                return;
            }

            const data = {
                managementUserSeq: parseInt(userId),
                price: parseInt(chargeAmount, 10),
            };

            const response = await axios.post('http://localhost:9001/charge', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.data) {
                setChargeAmount('');
                window.location.href = response.data;
            }
        } catch (error) {
            console.error('충전 실패:', error);
            alert('포인트 충전에 실패했습니다.');
        }
    };

    return (
        <div className="company-mypage">
            <h2>회사 마이페이지</h2>
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
        </div>
    );
};

export default CompanyMyPage;
    