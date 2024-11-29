import React, { useState,useEffect } from 'react';
import axios from 'axios';

const Auction = () => {
  
    const [stockInfo, setStockInfo] = useState(null);

    useEffect (() =>{
        const findStockById = async () =>{
            const token = localStorage.getItem('token');
            try {

                const result = await axios.get("http://localhost:9001/stock/5",{
                 headers: {
                    'Authorization': `Bearer ${token}`
                }

             });

             setStockInfo(result.data[0]);
             console.log('설정된 데이터:', result.data[0]);

        }catch (error) {
                console.error('사용자 정보 조회 실패:', error);
                if (error.response?.status === 401) {
                    alert('로그인이 필요한 서비스입니다.');
                }
            }               
        };
        findStockById();

    },[]);




    return (
        <div className="auction-container">
            {stockInfo && (
                <div className="auction-info">
                    <h3>상품 이름: {stockInfo.content}</h3>
                    <h3>재고 남은 수량: {stockInfo.count}</h3>
                    <h3>색상: {stockInfo.color}</h3>
                    <h3>가격: <span className="price">가격 정보 없음</span></h3>
                    <h3>남은 시간: <span className="time">시간 정보 없음</span></h3>
                </div>
            )}
            {!stockInfo && <p>상품 정보를 불러오는 중...</p>}
        </div>
    );
    
};

export default Auction;
