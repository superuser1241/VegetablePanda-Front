import React, { useState } from "react";
import axios from "axios";
import "./LoginForm.css";
import { Link } from "react-router-dom";

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const serverIp = process.env.REACT_APP_SERVER_IP;

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const loginResponse = await axios.post(`${serverIp}/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const authHeader = loginResponse.headers['authorization'];
      const token = authHeader ? authHeader.split(' ')[1] : null;

      console.log('Login Response:', loginResponse);
      console.log('Auth Header:', authHeader);
      console.log('Token:', token);

      if (token&&loginResponse.data.state===1) {
        localStorage.setItem('token', token);
        localStorage.setItem('userSeq', loginResponse.data.user_seq);
        localStorage.setItem('userRole', loginResponse.data.role);
        localStorage.setItem('userName', loginResponse.data.name);
        console.log('로그인 성공:', localStorage.getItem('userName'));
        const userData = loginResponse.data;
        onLoginSuccess(userData.name, userData.role);
      } else {
        if(loginResponse.data.state===0){
          setMessage('탈퇴한 유저입니다.');
        }else{
          setMessage('토큰을 받아올 수 없습니다.');
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
      setMessage(
        error.response?.status === 401
          ? '아이디 또는 비밀번호가 올바르지 않습니다.'
          : '로그인 중 오류가 발생했습니다.'
      );
    }
  };


  return (
    <div className="login-page-container">
        <div className="site-description">
            <h1>농산물 판다 라이브 커머스</h1>
            <p>라이브를 통한 신선한 농산물을 직접 만나보세요</p>
            <p>농부님들이 직접 재배한 신선한 농산물</p>
            <p>중간 유통 과정 없는 합리적인 가격</p>
            <p>산지 직송으로 더욱 신선한 배송</p>
            <p>믿을 수 있는 품질 인증 시스템</p>
            <p>농산물 직거래 국내 1위 플랫폼!!</p>
        </div>
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
                                    className="login-input"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호를 입력하세요"
                                    className="login-input"
                                />
                            </div>
                            <button className="login-button" type="submit">
                                로그인
                            </button>
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
    </div>
  );
}

export default LoginForm;
