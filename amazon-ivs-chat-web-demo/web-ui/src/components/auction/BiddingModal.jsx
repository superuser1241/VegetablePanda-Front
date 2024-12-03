import React, { useState, useEffect, useCallback } from 'react';
import BiddingSection from './BiddingSection.jsx';
import BidHistoryModal from './BidHistoryModal.jsx';
import PriceCheckModal from './PriceCheckModal.jsx';
import SalesHistoryModal from './SalesHistoryModal.jsx';
import AuctionStatusPage from './AuctionStatusPage.jsx';
import axios from 'axios';
import './BiddingModal.css';

const BiddingModal = ({ 
    isOpen, 
    onClose, 
    streamingRoom,
    bidHistory,
    setBidHistory,
    showPriceModal,
    setShowPriceModal,
    showSalesModal,
    setShowSalesModal,
    priceInfo,
    setPriceInfo,
    salesHistory,
    setSalesHistory,
    isFarmer,
    userWallet
}) => {
    const [currentView, setCurrentView] = useState('bidding');
    const [auctionData, setAuctionData] = useState(null);
    

    useEffect(() => {
        if (auctionData && isFarmer) {
            setCurrentView('status');
        } else {
            setCurrentView('bidding');
        }
    }, [auctionData, isFarmer]);

    const fetchAuctionStatus = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:9001/auction/${streamingRoom.farmerSeq}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            if (response.data && Object.keys(response.data).length > 0) {
                setAuctionData(response.data);
            } else {
                setAuctionData(null);
            }
        } catch (error) {
            console.error('경매 정보 조회 실패:', error);
            setAuctionData(null);
        }
    }, [streamingRoom.farmerSeq]);

    useEffect(() => {
        if (isOpen) {
            fetchAuctionStatus();
            const interval = setInterval(fetchAuctionStatus, 60000);
            return () => clearInterval(interval);
        }
    }, [isOpen, streamingRoom.farmerSeq]);  // dependency도 farmerSeq로 수정

    const handleAuctionRegister = async (data) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:9001/auction?price=${data.totalPrice}`,
                {
                    count: data.count,
                    closeTime: data.closeTime,
                    stockSeq: streamingRoom?.stockSeq
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            setAuctionData(response.data);
            alert('경매가 등록되었습니다.');
        } catch (error) {
            console.error('경매 등록 실패:', error);
            alert('경매 등록에 실패했습니다.');
        }
    };

    const handleAuctionEnd = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:9001/auction/${auctionData.auctionSeq}`,
                {},
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            setAuctionData(null);
            alert('경매가 종료되었습니다.');
        } catch (error) {
            console.error('경매 종료 실패:', error);
            alert('경매 종료에 실패했습니다.');
        }
    };

    const handleCheckPrice = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:9001/auction/price/${streamingRoom.farmerSeq}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            setPriceInfo(response.data);
            setShowPriceModal(true);
        } catch (error) {
            console.error('가격 정보 조회 실패:', error);
            alert('가격 정보를 불러오는데 실패했습니다.');
        }
    };

    const handleCheckSalesHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:9001/auction/sales/${streamingRoom.farmerSeq}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            setSalesHistory(response.data);
            setShowSalesModal(true);
        } catch (error) {
            console.error('판매 기록 조회 실패:', error);
            alert('판매 기록을 불러오는데 실패했습니다.');
        }
    };

    const handleOpenModal = (bid) => {
        setBidHistory(bid);
        setShowPriceModal(false);
        setShowSalesModal(false);
    };

    if (!isOpen) return null;

    return (
        <div className="bidding-modal-overlay">
            <div className="bidding-modal">
                <button className="close-button" onClick={onClose}>×</button>

                {currentView === 'bidding' ? (
                    <BiddingSection 
                        streamingRoom={streamingRoom}
                        auctionData={auctionData}
                        isFarmer={isFarmer}
                        userWallet={userWallet}
                        handleAuctionRegister={handleAuctionRegister}
                        handleAuctionEnd={handleAuctionEnd}
                        handleCheckPrice={handleCheckPrice}
                        handleCheckSalesHistory={handleCheckSalesHistory}
                        handleOpenModal={handleOpenModal}
                    />
                ) : (
                    auctionData && (
                        <AuctionStatusPage 
                            streamingRoom={streamingRoom}
                            auctionData={auctionData}
                            onOpenModal={handleOpenModal}
                            onEndAuction={handleAuctionEnd}
                        />
                    )
                )}
            </div>

            <BidHistoryModal 
                isOpen={bidHistory.length > 0}
                onClose={() => setBidHistory([])}
                bidHistory={bidHistory}
            />

            <PriceCheckModal 
                isOpen={showPriceModal}
                onClose={() => setShowPriceModal(false)}
                priceInfo={priceInfo}
            />

            <SalesHistoryModal 
                isOpen={showSalesModal}
                onClose={() => setShowSalesModal(false)}
                salesHistory={salesHistory}
            />
        </div>
    );
};

export default BiddingModal; 