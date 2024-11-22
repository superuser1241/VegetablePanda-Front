import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './CompanyMyPage.css';

const CompanyMyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [chargeAmount, setChargeAmount] = useState('');
    const [userId, setUserId] = useState('');
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 JWT 토큰 가져오기

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserId(payload.user_seq); // id -> user_seq로 변경
                console.log('추출된 사용자 시퀀스:', payload.user_seq);
            } catch (error) {
                console.error('JWT 토큰 파싱 오류:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        // URL에서 payment 경로 체크
        if (window.location.pathname.includes('/payment/')) {
            alert('포인트 충전이 완료되었습니다.');
            window.location.href = '/company-mypage';  // 마이페이지로 리다이렉트
        }
    }, []);

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
                window.location.href = `http://localhost:5173${response.data}`;
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
    