import { useState, useEffect } from 'react';
import axios from 'axios';

export const useBidding = (highestBid, auctionSeq) => {
    const [bidAmount, setBidAmount] = useState(0);

    useEffect(() => {
        if (highestBid) {
            setBidAmount(highestBid.price + 10);
        }
    }, [highestBid]);

    const handleIncrease = () => setBidAmount(prev => prev + 10);
    const handleDecrease = () => setBidAmount(prev => prev - 10);
    
    const handleBid = async () => {
        try {
            console.log('입찰 시작:', { bidAmount, auctionSeq });
            
            if (!auctionSeq) {
                throw new Error('경매 ID가 없습니다.');
            }

            const userSeq = localStorage.getItem('userSeq');
            const token = localStorage.getItem('token');
            
            if (!userSeq || !token) {
                throw new Error('로그인이 필요합니다.');
            }

            console.log('입찰 요청 데이터:', {
                userSeq,
                price: bidAmount,
                auctionSeq
            });

            const response = await axios.post("http://localhost:9001/bid", {
                userSeq: userSeq,
                price: bidAmount,
                auctionSeq: auctionSeq
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('입찰 응답:', response.data);
             alert('입찰이 완료되었습니다.');
        } catch (error) {
            console.error('입찰 실패:', error);
            alert(error.message || '입찰에 실패했습니다.');
        }
    };

    return {
        bidAmount,
        setBidAmount,
        handleIncrease,
        handleDecrease,
        handleBid,
    };
}; 