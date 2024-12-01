import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import kakaoLogin from "./kakaoLogin.png";

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const loginResponse = await axios.post(
        "http://localhost:9001/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const authHeader = loginResponse.headers["authorization"];
      const token = authHeader ? authHeader.split(" ")[1] : null;

      console.log("Login Response:", loginResponse);
      console.log("Auth Header:", authHeader);
      console.log("Token:", token);

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userSeq", loginResponse.data.user_seq);
        console.log(loginResponse.data.user_seq);
        const userData = loginResponse.data;
        onLoginSuccess(userData.name, userData.role);
      } else {
        setMessage("토큰을 받아올 수 없습니다.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage(
        error.response?.status === 401
          ? "아이디 또는 비밀번호가 올바르지 않습니다."
          : "로그인 중 오류가 발생했습니다."
      );
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
  // 카카오 로그인 API
  const kakaoApiKey = "eb7cd302e757cf192dc6fb47da020c74";
  const kakaoRedirectUri = "http://localhost:9001/login/auth";
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoApiKey}&redirect_uri=${kakaoRedirectUri}&prompt=select_account`;
  
  return (
    <div className="form-container">
      <div className="tab-menu">
        <button
          className={activeTab === "login" ? "tab active" : "tab"}
          onClick={() => setActiveTab("login")}
        >
          로그인
        </button>
        <button
          className={activeTab === "register" ? "tab active" : "tab"}
          onClick={() => setActiveTab("register")}
        >
          회원가입
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "login" && (
          <div className="login-tab">
            <h2>로그인</h2>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디를 입력하세요"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <button className="login-button" type="submit">
                로그인
              </button>
              <hr className="divider" />

              <div className="kakaoLogin">
                <a href={kakaoURL}>
                  <img src={kakaoLogin} alt="카카오 로그인" />
                </a>
              </div>
            </form>
            {message && <p className="error-message">{message}</p>}
          </div>
        )}

        {activeTab === "register" && (
          <div className="register-tab">
            <h2>회원가입</h2>
            <div className="register-buttons">
              <Link to="/UserRegister" className="register-link">
                일반 회원
              </Link>
              <Link to="/CompanyRegister" className="register-link">
                업체 회원
              </Link>
              <Link to="/FarmerRegister" className="register-link">
                판매자 회원
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
