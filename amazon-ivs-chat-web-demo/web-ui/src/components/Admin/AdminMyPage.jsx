import React, { useState, useEffect } from 'react';
import './AdminMyPage.css';

const AdminMyPage = () => {
    const [adminInfo, setAdminInfo] = useState({
        name: '',
        id: '',
        role: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
                setAdminInfo({
                    name: payload.name,
                    id: payload.id,
                    role: payload.role
                });
            } catch (error) {
                console.error('토큰 디코딩 실패:', error);
            }
        }
    }, []);

    return (
        <div className="admin-mypage-container">
            <h2>관리자 마이페이지</h2>
            <div className="admin-info-card">
                <div className="info-item">
                    <label>이름:</label>
                    <span>{adminInfo.name}</span>
                </div>
                <div className="info-item">
                    <label>아이디:</label>
                    <span>{adminInfo.id}</span>
                </div>
                <div className="info-item">
                    <label>권한:</label>
                    <span>{adminInfo.role === 'ROLE_ADMIN' ? '관리자' : ''}</span>
                </div>
            </div>
        </div>
    );
};

export default AdminMyPage; 