import { useState, useEffect } from 'react';

export const useBidding = (highestBid) => {
    const [bidAmount, setBidAmount] = useState(0);

    useEffect(() => {
        if (highestBid) {
            setBidAmount(highestBid.price + 10);
        }
    }, [highestBid]);

    const handleIncrease = () => setBidAmount(prev => prev + 10);
    const handleDecrease = () => setBidAmount(prev => prev - 10);
    
    return {
        bidAmount,
        handleIncrease,
        handleDecrease
    };
}; 