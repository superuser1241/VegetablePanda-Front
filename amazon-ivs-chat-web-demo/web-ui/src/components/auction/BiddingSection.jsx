import React, { memo, useEffect, useState } from "react";
import AuctionStatusPage from './AuctionStatusPage';
import BidPage from './BidPage';
import AuctionRegisterPage from './AuctionRegisterPage';
import { Client } from "@stomp/stompjs";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BiddingSection = memo(({ 

    auctionData, 
    isFarmer, 
    streamingRoom, 
    onOpenModal, 
    onEndAuction, 
    onCheckPrice, 
    onCheckSalesHistory, 
    onRegisterSuccess,
    userWallet,
    userRole 
}) => {
    const [localAuctionData, setLocalAuctionData] = useState(auctionData);
    const [bid, setBid] = useState(null);
    const navigate = useNavigate();

    const findBidByAuctionId = async (auctionSeq) => {
        const token = localStorage.getItem('token');
        try {
            const serverIp = process.env.REACT_APP_SERVER_IP;
            const currentHour = new Date().getHours();
            
            let result;
            if (currentHour >= 18 || currentHour < 24) {
                result = await axios.get(`${serverIp}/bidCom/${auctionSeq}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log('법인 경매 시간 - bidCom API 호출');
            } else if (currentHour >= 13 && currentHour < 18) {
                result = await axios.get(`${serverIp}/bidUser/${auctionSeq}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log('개인 경매 시간 - bidUser API 호출');
            } else {
                console.log('경매 시간이 아닙니다');
                return;
            }
            
            setBid(result.data);
            console.log('설정된 데이터:', result.data);
        } catch (error) {
            console.error('입찰 정보 조회 실패:', error);
        }
    };

    useEffect(() => {
        if (localAuctionData?.auctionSeq) {
            findBidByAuctionId(localAuctionData.auctionSeq);
        }
    }, [localAuctionData?.auctionSeq]);

    useEffect(() => {
        const serverIp = process.env.REACT_APP_SERVER_IP;
        const client = new Client({
            brokerURL: `ws://${serverIp.replace('http://', '')}/ws`,
            onConnect: () => {
                client.subscribe("/top/notifications", async (message) => {
                    refreshAuctionData();
                });

                client.subscribe("/end/notifications", async (message) => {
                    if(message.body==="BroadCastEnd"){
                        sessionStorage.clear();
                        navigate('/');
                    }
                    else{
                        refreshAuctionData();
                    }
                });
            },
            onDisconnect: () => console.log("WebSocket 연결 종료"),
        });
    
        client.activate();
    
        return () => {
            client.deactivate();
        };
    }, []);

    const refreshAuctionData = async () => {
        try {
            const token = localStorage.getItem("token");
            const serverIp = process.env.REACT_APP_SERVER_IP;
            const response = await axios.get(
                `${serverIp}/auction/${streamingRoom.farmerSeq}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setLocalAuctionData(response.data);
        } catch (error) {
            setLocalAuctionData(null);
        }
    };

    const getClassName = () => {
        if (isFarmer) {
            // 농부일 때
            return localAuctionData && localAuctionData.auctionSeq ? 
                'sidebar-status-content' :    // 경매 있으면 상태 페이지 스타일
                'sidebar-register-content';   // 경매 없으면 등록 페이지 스타일
        } else {
            // 구매자일 때
            return localAuctionData && localAuctionData.auctionSeq ? 
                'sidbar-bid-content' :          // 경매 있으면 입찰 페이지 스타일
                'waiting-message';           // 경매 없으면 대기 메시지 스타일
        }
    };
    useEffect(() => {
        console.log("auctionData가 변경되었습니다:", localAuctionData);
    }, [localAuctionData]);


    return (
        <div className={getClassName()}>
            {isFarmer ? (
                // 농부일 때
                localAuctionData && localAuctionData.auctionSeq ? (
                    <AuctionStatusPage 
                        streamingRoom={streamingRoom}
                        auctionData={localAuctionData}
                        onOpenModal={onOpenModal}
                        onEndAuction={onEndAuction}
                        onCheckPrice={onCheckPrice}
                        onCheckSalesHistory={onCheckSalesHistory}
                        bid={bid}
                    />
                ) : (
                    <AuctionRegisterPage 
                        streamingRoom={streamingRoom}
                        onRegisterSuccess={onRegisterSuccess}
                        onCheckPrice={onCheckPrice}
                        onCheckSalesHistory={onCheckSalesHistory}
                    />
                )
            ) : (
                // 구매자일 때
                localAuctionData && localAuctionData.auctionSeq ? (
                    <BidPage 
                        streamingRoom={streamingRoom}
                        auctionData={localAuctionData}
                        onAuctionEnd={onEndAuction}
                        onOpenModal={onOpenModal}
                        onCheckPrice={onCheckPrice}
                        onCheckSalesHistory={onCheckSalesHistory}
                        userWallet={userWallet}
                        userRole={userRole}
                        bid={bid}
                    />
                ) : (
                    <div className="waiting-message">
                        <p>경매 시작을 기다리는 중입니다...</p>
                    </div>
                )
            )}
        </div>
    );
});

export default BiddingSection; 