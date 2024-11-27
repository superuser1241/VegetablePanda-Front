import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useAuctionData = (auctionId) => {
    const [highestBid, setHighestBid] = useState(null);
    const [auction, setAuction] = useState(null);
    const [bid, setBid] = useState(null);

    const fetchHighestBid = useCallback( async () => {
        const token = localStorage.getItem('token');
        try {
            const result = await axios.get(`http://localhost:9001/highestBid/${auctionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setHighestBid(result.data);
        } catch (error) {
            console.error('최고 입찰가 조회 실패:', error);
        }
    },[auctionId]);

    
    const fetchAuction  =useCallback( async () =>{
            const token = localStorage.getItem('token');
            try {

                const result = await axios.get(`http://localhost:9001/auction/${auctionId}`,{
                 headers: {
                    'Authorization': `Bearer ${token}`
                }

             });

             setAuction(result.data);
             console.log('설정된 데이터:', result.data);

        }catch (error) {
                console.error('사용자 정보 조회 실패:', error);
                if (error.response?.status === 401) {
                    alert('로그인이 필요한 서비스입니다.');
                }
            }               
    },[auctionId]);

    
    const findBidByAuctionId = useCallback( async () =>{
            const token = localStorage.getItem('token');
            try {

                const result = await axios.get(`http://localhost:9001/bid/${auctionId}`,{
                 headers: {
                    'Authorization': `Bearer ${token}`
                }

             });

             setBid(result.data);
             console.log('설정된 데이터:', result.data);

        }catch (error) {
                console.error('사용자 정보 조회 실패:', error);
                if (error.response?.status === 401) {
                    alert('로그인이 필요한 서비스입니다.');
                }
            }               
    },[auctionId]);

    

    // ... auction과 bid를 위한 비슷한 함수들

    useEffect(() => {
        fetchHighestBid();
        fetchAuction();
        findBidByAuctionId();
    }, [fetchHighestBid, fetchAuction, findBidByAuctionId]);

    return { highestBid, auction, bid };
}; 