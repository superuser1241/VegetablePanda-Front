import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Client } from "@stomp/stompjs";

const AuctionRegisterPage = ({ stockSeq, onRegisterSuccess }) => {
    const navigate = useNavigate();
    const [auctionData, setAuctionData] = useState({
        count: '',
        closeTime: '',
        stockSeq: stockSeq
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startPrice') {
            setStartPrice(value);
        } else {
            setAuctionData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const [startPrice, setStartPrice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userSeq = localStorage.getItem('userSeq');

            const response = await axios.post(
                `http://localhost:9001/auction?price=${startPrice}`, 
                { ...auctionData, 
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            onRegisterSuccess(response.data);

            const successAfter = 
            await axios.post(
                `http://localhost:9001/sendBidAll`, 
                { 
                     "message": " 등록한 방송이 곧 시작합니다."
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

        } catch (error) {
            console.error('경매 등록 실패:', error);
            alert('경매 등록에 실패했습니다.');
        }

        
    };


    // WebSocket 연결 및 상태 갱신
    useEffect(() => {
        const client = new Client({
            brokerURL: "ws://localhost:9001/ws", 
            onConnect: () => {
                client.subscribe("/all/notifications", async (message) => {
                    console.log(message.body);
                });
            },
            onDisconnect: () => console.log('WebSocket 연결 종료')
        });

        client.activate();

        // 클린업: 컴포넌트가 언마운트되면 WebSocket 연결 종료
        return () => {
            client.deactivate();
        };
    }, []);


    const getTodayStart = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}T09:00`;
    };

    const getTodayEnd = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}T23:00`;
    };

    return (
        <div className="auction-register-container">
            <h2>경매 등록</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>시작가</label>
                    <input
                        type="number"
                        name="startPrice"
                        value={startPrice}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>수량</label>
                    <input
                        type="number"
                        name="count"
                        value={auctionData.count}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>종료 시간 (최전 9시 ~ 오후 1시 사이 선택)</label>
                    <input
                        type="datetime-local"
                        name="closeTime"
                        value={auctionData.closeTime}
                        onChange={handleChange}
                        min={getTodayStart()}
                        max={getTodayEnd()}
                        required
                    />
                </div>
                <button type="submit">경매 등록</button>
            </form>
        </div>
    );
};

export default AuctionRegisterPage; 