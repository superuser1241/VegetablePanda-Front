import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FarmerMyPage.css';
import FarmerRegisterStock from './FarmerRegisterStock';

const FarmerMyPage = () => {
    const navigate = useNavigate();

    return (
        <div className="farmer-mypage">
            <h2>농부 마이페이지</h2>
            
            <div className="streaming-section">
                <h3>스트리밍 관리</h3>
                <div className="streaming-buttons">
                    <button 
                        className="streaming-btn"
                        onClick={() => navigate('/streaming')}
                    >
                        채팅방 선택하기
                    </button>
                </div>
            </div>
            <div className='stock-register-section'>
                <h3>재고 등록</h3>
                <div className='register-stock-buttons'>
                    <button className='register-stock-btn' onClick={()=> navigate('/register-stock')}>등록하기</button>
                </div>
                

            </div>
        </div>
    );
};

export default FarmerMyPage; 