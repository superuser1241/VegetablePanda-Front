import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuctionData = (auctionId) => {
    const [highestBid, setHighestBid] = useState(null);
    const [auction, setAuction] = useState(null);
    const [bid, setBid] = useState(null);

    const fetchHighestBid = async () => {
        const token = localStorage.getItem('token');
        try {
            const result = await axios.get(`http://localhost:9001/highestBid/${auctionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setHighestBid(result.data);
        } catch (error) {
            console.error('최고 입찰가 조회 실패:', error);
            handleError(error);
        }
    };

    // ... auction과 bid를 위한 비슷한 함수들

    useEffect(() => {
        fetchHighestBid();
        fetchAuction();
        fetchBid();
    }, [auctionId]);

    return { highestBid, auction, bid };
}; 