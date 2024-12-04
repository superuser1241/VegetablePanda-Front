/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../image/농산물 판다.png';

const Header = ({ userName, userRole, handleLogout }) => {
    // 역할에 따른 마이페이지 경로 결정
    const getMyPagePath = (role) => {
        switch(role) {
            case 'ROLE_ADMIN':
                return '/admin-mypage';
            case 'ROLE_USER':
                return '/user-mypage';
            case 'ROLE_COMPANY':
                return '/company-mypage';
            case 'ROLE_FARMER':
                return '/farmer-mypage';
            default:
                return '/';
        }
    };

    return (
        <header className="header">
            <div className="logo-container">
                <Link to="/">
                    <img src={logo} alt="로고" />
                </Link>
            </div>
            <nav className="nav">

                {userName ? (
                    <>                        
                        <Link to={getMyPagePath(userRole)} className="nav-item">
                            마이페이지
                        </Link>
                        <Link to="/customer-service" className="nav-item">
                            고객센터
                        </Link>
                        <Link to="/notify-service" className="nav-item">
                            공지사항
                        </Link>
                        { userRole === 'ROLE_FARMER' ?
                        <Link to="/personal" className="nav-item">
                            개인 페이지
                        </Link>
                        : null
                        }
                        <div className="user-actions">
                            <span className="welcome-message">{userName}님 환영합니다</span>
                            <button
                                onClick={handleLogout}
                                className="logout-button"
                            >
                                로그아웃
                            </button>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="nav-item">
                        Login
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
