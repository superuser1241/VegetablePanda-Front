import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Client } from "@stomp/stompjs";

export const useAuctionData = (userSeq,auctionSeq) => {
    const [highestBid, setHighestBid] = useState(null);
    const [auction, setAuction] = useState(null);
    const fetchHighestBid = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const serverIp = process.env.REACT_APP_SERVER_IP;
            const result = await axios.get(`${serverIp}/highestBid/${userSeq}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setHighestBid(result.data);
        } catch (error) {
            console.error('최고 입찰가 조회 실패:', error);
        }
    }, [userSeq]);

    const fetchAuction = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const serverIp = process.env.REACT_APP_SERVER_IP;
            const result = await axios.get(`${serverIp}/auction/${userSeq}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAuction(result.data);
            console.log('설정된 데이터:', result.data);
        } catch (error) {
            console.error('상품 정보 조회 실패:', error);
            if (error.response?.status === 401) {
                alert('로그인이 필요한 서비스입니다.');
            }
        }
    }, [userSeq]);

    

    // WebSocket 연결 및 상태 갱신
    useEffect(() => {
        const serverIp = process.env.REACT_APP_SERVER_IP;
        const client = new Client({
            brokerURL: `ws://${serverIp}/ws`,
            
            onConnect: () => {
                client.subscribe("/top/notifications", async (message) => {
                    fetchHighestBid();
                    fetchAuction();
                });
            },
            onDisconnect: () => console.log('WebSocket 연결 종료')
        });

        client.activate();

        // 클린업: 컴포넌트가 언마운트되면 WebSocket 연결 종료
        return () => {
            client.deactivate();
        };
    }, [fetchHighestBid, fetchAuction]);

    // 초기 데이터 로드
    useEffect(() => {
        fetchHighestBid();
        fetchAuction();
    }, [fetchHighestBid, fetchAuction]);

    return { highestBid, auction};
};
