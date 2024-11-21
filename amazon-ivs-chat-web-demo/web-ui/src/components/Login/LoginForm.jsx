import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

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
        <div className="login-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="아이디"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="비밀번호"
                    />
                </div>
                <button className="login-button" type="submit">Login</button>
            </form>
            {message && <p className="error-message">{message}</p>}
        </div>
    );
}

export default LoginForm;
