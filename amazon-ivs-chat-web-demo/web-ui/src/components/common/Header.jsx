/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import './Header.css';
import logo from '../../image/농산물 판다.png';

const Header = ({ navigateTo, userName, userRole, handleLogout }) => {
    console.log(userRole)
    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="로고" />
            </div>
            <nav className="nav">
                {/* Home 메뉴는 항상 표시 */}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigateTo('main');
                    }}
                    className="nav-item"
                >
                    Home
                </a>

                {userName ? (
                    <>
                        {userRole === 'ROLE_ADMIN' && (
                            // eslint-disable-next-line jsx-a11y/anchor-is-valid
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigateTo('admin');
                                }}
                                className="nav-item"
                            >
                                Admin
                            </a>
                        )}
                        {userRole === 'ROLE_FARMER' && (
                            // eslint-disable-next-line jsx-a11y/anchor-is-valid
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigateTo('streaming');
                                }}
                                className="nav-item"
                            >
                                Streaming
                            </a>
                        )}
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
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            navigateTo('login');
                        }}
                        className="nav-item"
                    >
                        Login
                    </a>
                )}
            </nav>
        </header>
    );
};


export default Header;
