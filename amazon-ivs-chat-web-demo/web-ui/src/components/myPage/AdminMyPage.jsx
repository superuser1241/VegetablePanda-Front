import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminMyPage.css';

const AdminMyPage = () => {
    const navigate = useNavigate();
    const [adminInfo, setAdminInfo] = useState({
        name: '',
        id: '',
        role: '',
        email: '',
        phoneNumber: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
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
    }, []);

    return (
        <div className="admin-mypage-container">
            <h2>관리자 정보</h2>
            <div className="admin-info-card">
                <p>이름: {adminInfo.name}</p>
                <p>아이디: {adminInfo.id}</p>
                <p>역할: {adminInfo.role}</p>
            </div>
            
            <div className="admin-actions">
                <button 
                    className="admin-button"
                    onClick={() => navigate('/admin')}
                >
                    스트리밍 승인 관리
                </button>
            </div>
        </div>
    );
};

export default AdminMyPage; 