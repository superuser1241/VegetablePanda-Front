import React from 'react';
import './Creator.css';
import team1 from '../../image/팀원1.jpg';
import team2 from '../../image/팀원2.jpg';
import team3 from '../../image/팀원3.jpg';
import team4 from '../../image/팀원4.jpg';
import team5 from '../../image/팀원5.jpg';
import teamLeader from '../../image/팀장.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';

const Creator = () => {
    const teamMembers = [
        {
            name: "이정우",
            role: "실시간 경매 및 트래픽 관리",
            image: teamLeader,
            email: "jwlee1130@naver.com",
            github: "https://github.com/jwlee1130"
        },
        {
            name: "주영준",
            role: "라이브 스트리밍, 실시간 채팅, 통계",
            image: team1,
            email: "dbk0315@naver.com",
            github: "https://github.com/superuser1241"
        },
        {
            name: "김재영",
            role: "실시간 알림 추천, 판매자CRUD",
            image: team2,
            email: "unknown88455144@gmail.com",
            github: "https://github.com/kimjaeyou"
        },
        {
            name: "강윤성",
            role: "로그인, 회원가입, 마이페이지",
            image: team3,
            email: "gnusnuy99@gmail.com",
            github: "https://github.com/Gnusnuy"
        },
        {
            name: "이인영",
            role: "결제, 상품CRUD, 카테고리별 검색",
            image: team4,
            email: "iylee153@gmail.com",
            github: "https://github.com/iylee15"
        },
        {
            name: "이성민",
            role: "게시판, 리뷰",
            image: team5,
            email: "sidmian94@gmail.com",
            github: "https://github.com/Min676"
        }
    ];

    return (
        <div className="creator-container">
            <h1>농산물 판다 개발팀</h1>
            <div className="creator-team-grid">
                {teamMembers.map((member, index) => (
                    <div key={index} className="creator-team-member">
                        <div className="creator-member-image">
                            <img src={member.image} alt={member.name} />
                        </div>
                        <div className="creator-member-info">
                            <h3 className="creator-member-name">{member.name}</h3>
                            <div className="creator-info-item">
                                <span className="creator-info-label">
                                    <FontAwesomeIcon icon={faUser} /> 역할:
                                </span>
                                <span className="creator-info-content">{member.role}</span>
                            </div>
                            <div className="creator-info-item">
                                <span className="creator-info-label">
                                    <FontAwesomeIcon icon={faEnvelope} /> E-mail:
                                </span>
                                <span className="creator-info-content">{member.email}</span>
                            </div>
                            <div className="creator-info-item">
                                <span className="creator-info-label">
                                    <FontAwesomeIcon icon={faGithub} /> Github:
                                </span>
                                <span className="creator-info-content">
                                    <a href={member.github} target="_blank" rel="noopener noreferrer">
                                        {member.github}
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Creator; 