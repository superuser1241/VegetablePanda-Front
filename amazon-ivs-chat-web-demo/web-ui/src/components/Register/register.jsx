import React, { useState } from 'react';
import axios from 'axios';
import './SignupForm.css'; // 스타일을 위한 CSS 파일

function SignupForm() {
    // 상태 관리: 사용자 입력값을 저장
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // 폼 제출 핸들러
    const handleSubmit = async (event) => {
        event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        setMessage('');  // 이전 메시지 초기화

        // 비밀번호 확인
        if (password !== confirmPassword) {
            setMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);  // 로딩 상태로 변경

        try {
            // 서버에 회원가입 요청
            const response = await axios.post('http://localhost:9001/api/signup', {
                username,
                email,
                password,
            });

            if (response.status === 200) {
                setMessage('회원가입 성공!');
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            setMessage('회원가입 실패. 다시 시도해주세요.');
        } finally {
            setLoading(false);  // 로딩 상태 해제
        }
    };

    return (
        <div className="signup-form-container">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <label>아이디</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="아이디를 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label>이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="이메일을 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="비밀번호를 다시 입력하세요"
                    />
                </div>
                <button type="submit" disabled={loading} className="signup-button">
                    {loading ? '가입 중...' : '회원가입'}
                </button>
            </form>
            {message && <p className="error-message">{message}</p>}
        </div>
    );
}

export default SignupForm;