import React from 'react';

// 스타일링을 위한 CSS 추가
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex', // Flexbox 사용
    flexDirection: 'column', // 세로 정렬
    justifyContent: 'center', // 세로로 가운데 정렬
    alignItems: 'center', // 가로로 가운데 정렬
    textAlign: 'center',
    backgroundColor: '#f7f7f7',
    minHeight: '100vh', // 화면 전체 높이
    margin: 0,
  },
  header: {
    fontSize: '2.5em',
    marginBottom: '20px',
    color: '#3c763d',
  },
  teamSection: {
    marginTop: '30px',
  },
  membersContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px', // 간격 설정
    flexWrap: 'wrap', // 화면 크기에 따라 줄바꿈
    marginTop: '10px',
  },
  member: {
    fontSize: '1.2em',
    color: '#555',
    padding: '5px 10px',
    backgroundColor: '#e8f5e9',
    borderRadius: '5px',
  },
};

const teamMembers = [
  '이정우',
  '주영준',
  '김재영',
  '이성민',
  '강윤성',
  '이인영',
];

const TeamIntroduction = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Vegetable Panda 🌱</h1>
      <p>
        저희 "다판다 Forever" 팀은 창의적이고 열정적으로 프로젝트를
        수행하며, 서로 협력하여 최고의 결과물을 만들어내는 것을 목표로 하고
        있습니다. 😊
      </p>
      <div style={styles.teamSection}>
        <h2>팀원</h2>
        <div style={styles.membersContainer}>
          {teamMembers.map((member, index) => (
            <span key={index} style={styles.member}>
              {member}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamIntroduction;
