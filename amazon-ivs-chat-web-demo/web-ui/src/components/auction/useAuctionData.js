import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Client } from "@stomp/stompjs";

export const useAuctionData = (auctionId) => {
    const [highestBid, setHighestBid] = useState(null);
    const [auction, setAuction] = useState(null);
    const [bid, setBid] = useState(null);

    const fetchHighestBid = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const result = await axios.get(`http://localhost:9001/highestBid/${auctionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setHighestBid(result.data);
        } catch (error) {
            console.error('최고 입찰가 조회 실패:', error);
        }
    }, [auctionId]);

    const fetchAuction = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const result = await axios.get(`http://localhost:9001/auction/${auctionId}`, {
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
    }, [auctionId]);

    const findBidByAuctionId = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const result = await axios.get(`http://localhost:9001/bid/${auctionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBid(result.data);
            console.log('설정된 데이터:', result.data);
        } catch (error) {
            console.error('입찰 정보 조회 실패:', error);
            if (error.response?.status === 401) {
                alert('로그인이 필요한 서비스입니다.');
            }
        }
    }, [auctionId]);

    // WebSocket 연결 및 상태 갱신
    useEffect(() => {
        const client = new Client({
            brokerURL: "ws://localhost:9001/ws", // WebSocket 서버 URL
            onConnect: () => {
                console.log('WebSocket 연결됨');
                // WebSocket 메시지를 구독하고, 메시지가 오면 상태 업데이트
                client.subscribe("/top/notifications", async (message) => {
                    console.log('새 메시지 도착:', message.body);
                    // 메시지 수신 후, Redis 데이터 다시 요청
                    fetchHighestBid();
                    findBidByAuctionId();
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
    }, [fetchHighestBid, fetchAuction, findBidByAuctionId]);

    // 초기 데이터 로드
    useEffect(() => {
        fetchHighestBid();
        fetchAuction();
        findBidByAuctionId();
    }, [fetchHighestBid, fetchAuction, findBidByAuctionId]);

    return { highestBid, auction, bid };
};
