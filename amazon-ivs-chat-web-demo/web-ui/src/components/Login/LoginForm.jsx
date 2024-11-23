import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { Link } from 'react-router-dom';

function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('login');

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const loginResponse = await axios.post('http://localhost:9001/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const authHeader = loginResponse.headers['authorization'];
            const token = authHeader ? authHeader.split(' ')[1] : null;

            if (token) {
                localStorage.setItem('token', token);
                const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
                onLoginSuccess(payload.name, payload.role);
            } else {
                setMessage('Failed to retrieve token.');
            }
        } catch (error) {
            setMessage(
                error.response?.status === 401 ? 'Invalid credentials' : 'An error occurred. Please try again.'
            );
        }
    };

    return (
        <div className="form-container">
            <div className="tab-menu">
                <button
                    className={activeTab === 'login' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('login')}
                >
                    로그인
                </button>
                <button
                    className={activeTab === 'register' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('register')}
                >
                    회원가입
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'login' && (
                    <div className="login-tab">
                        <h2>로그인</h2>
                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="아이디를 입력하세요"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="비밀번호를 입력하세요"
                                />
                            </div>
                            <button className="login-button" type="submit">
                                로그인
                            </button>
                            <hr className="divider" />
                        
                        </form>
                        {message && <p className="error-message">{message}</p>}
                    </div>
                )}

                {activeTab === 'register' && (
                    <div className="register-tab">
                        <h2>회원가입</h2>
                        <div className="register-buttons">
                            <Link to="/UserRegister" className="register-link">일반 회원</Link>
                            <Link to="/CompanyRegister" className="register-link">업체 회원</Link>
                            <Link to="/FarmerRegister" className="register-link">판매자 회원</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginForm;
