/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import "../Personal/Personal.css";
import logo from "../../image/농산물 판다.png";
import cart from "../../image/cart.png";

import axios from "axios";

const Header = ({
  userName,
  userRole,
  streamingRoom,
  handleLogout,
  handleExitConfirm,
}) => {
  const [showExitModal, setShowExitModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");

  const handleLinkClick = (path) => (e) => {
    const sessionStreamingRoom = sessionStorage.getItem("streamingRoom");
    if (userRole === "ROLE_FARMER" && sessionStreamingRoom && streamingRoom) {
      e.preventDefault();
      setRedirectPath(path);
      setShowExitModal(true);
    } else {
      window.location.href = path;
    }
  };

  const confirmExitAndRedirect = async () => {
    await handleExitConfirm();
    setShowExitModal(false);
    window.location.href = redirectPath;
  };

  const handleLogoutClick = () => {
    if (userRole === "ROLE_FARMER" && streamingRoom) {
      setRedirectPath("/");
      setShowExitModal(true);
    } else {
      handleLogout();
    }
    localStorage.clear();
  };

  const getMyPagePath = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "/admin-mypage";
      case "ROLE_USER":
        return "/user-mypage";
      case "ROLE_COMPANY":
        return "/company-mypage";
      case "ROLE_FARMER":
        return "/farmer-mypage";
      default:
        return "/";
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" onClick={handleLinkClick("/")}>
          <img src={logo} alt="로고" />
        </Link>
      </div>
      <nav className="nav">
        {userName ? (
          <>
            {userRole === "ROLE_USER" ? (
              <div className="cart-container">
                <Link to="/shop" className="nav-item">
                  상점
                </Link>
              </div>
            ) : null}
            <Link
              to={getMyPagePath(userRole)}
              className="nav-item"
              onClick={handleLinkClick(getMyPagePath(userRole))}
            >
              마이페이지
            </Link>
            <Link
              to="/customer-service"
              className="nav-item"
              onClick={handleLinkClick("/customer-service")}
            >
              고객센터
            </Link>
            <Link
              to="/notify-service"
              className="nav-item"
              onClick={handleLinkClick("/notify-service")}
            >
              공지사항
            </Link>
            {userRole === "ROLE_FARMER" ? (
              ""
            ) : (
              <Link to="/PersonalList" className="nav-item">
                판매자 목록
              </Link>
            )}

            {userRole === "ROLE_USER" ? (
              <div className="cart-container">
                <Link to="/cart" className="nav-item">
                  <img src={cart} />
                </Link>
              </div>
            ) : null}
            <div className="user-actions">
              <span className="welcome-message">{localStorage.getItem('userName')}님 환영합니다</span>
              <button onClick={handleLogoutClick} className="logout-button">
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

      {/* 종료 확인 모달 추가 */}
      {showExitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>방송 종료</h3>
            <p>방송을 종료하시겠습니까?</p>
            <div className="modal-buttons">
              <button onClick={confirmExitAndRedirect}>네</button>
              <button onClick={() => setShowExitModal(false)}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
