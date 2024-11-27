import React, { useState,useEffect } from 'react';
import axios from 'axios';

const Auction = ({ streamingRoom }) => {
  
    const [stockInfo, setStockInfo] = useState(null);
    console.log('streamingRoom:', streamingRoom);
    console.log('hi 방입장');
    useEffect (() =>{
        const findStockById = async () =>{
            const token = localStorage.getItem('token');
            try {

                const result = await axios.get(`http://localhost:9001/auctionStock/${streamingRoom.farmerUser.userSeq}`,{
                 headers: {
                    'Authorization': `Bearer ${token}`
                }

             });
             setStockInfo(result.data);
             console.log('설정된 데이터:', result.data);

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
                    <img src={stockInfo.filePath}/><br/>
                    <h3>상품 이름: {stockInfo.productName}</h3><br/>
                    <h3>상품 설명: {stockInfo.content}</h3><br/>
                    <h3>재고 남은 수량: {stockInfo.count}</h3><br/>
                    <h3>색상: {stockInfo.color}</h3><br/>
                    <h3>판매자 이름: {stockInfo.farmerUserName}</h3>
                    <h3>판매자 등급: {stockInfo.farmerUserGrade}</h3>
                    <h3>판매자 전화번호: {stockInfo.farmerUserPhone}</h3>
                </div>
            )}
        </div>
    );
    
};

export default Auction;
