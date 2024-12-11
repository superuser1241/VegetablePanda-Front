import React, { memo, useEffect, useState } from "react";
import AuctionStatusPage from './AuctionStatusPage';
import BidPage from './BidPage';
import AuctionRegisterPage from './AuctionRegisterPage';
import { Client } from "@stomp/stompjs";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Notification/NotiSet.css';
import logo from '../../image/경매대기.png';

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
    const [localAuctionData, setLocalAuctionData] = useState(null);
    const [messages, setMessages] = useState(""); // 메시지 내용
    const [showMessage, setShowMessage] = useState(false); // 메시지 표시 상태
    const navigate = useNavigate();

    useEffect(() => {
        if (auctionData) {
            setLocalAuctionData(auctionData);
        } else {
            refreshAuctionData();
        }
    }, [auctionData]);

    useEffect(() => {
        if (streamingRoom?.farmerSeq) {
            refreshAuctionData();
        }
    }, [streamingRoom?.farmerSeq]);

    useEffect(() => {
        const serverIp = process.env.REACT_APP_SERVER_IP;
        const client = new Client({
            brokerURL: `wss://${serverIp.replace('https://', '')}/ws`,
            onConnect: () => {
                client.subscribe("/top/notifications", async (message) => {
                    refreshAuctionData();
                });

                client.subscribe(`/end/${streamingRoom.farmerSeq}/notifications`, async (message) => {
                    if(message.body==="BroadCastEnd"){
                        sessionStorage.clear();
                    }
                    else{
                        refreshAuctionData();
                    }
                });

                client.subscribe(`/end/notifications`, async (message) => {
                        refreshAuctionData();
                });


                client.subscribe(`/biduser/${streamingRoom.farmerSeq}/notifications`, (message) => {
                    const body = message.body;
                    setMessages(body);
                    setShowMessage(true); 
                });

            },
            onDisconnect: () => console.log("WebSocket 연결 종료"),
        });
    
        client.activate();
    
        return () => {
            client.deactivate();
        };
    }, [streamingRoom?.farmerSeq]);

     // 메시지 닫기 버튼
     const handleHideMessages = () => {
        setShowMessage(false);

        sessionStorage.clear();
        navigate('/');
    };

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
            
            if (response.data) {
                setLocalAuctionData(response.data);
            }else{
                setLocalAuctionData(null);
            }
        } catch (error) {
            alert("경매 데이터 조회 실패:", error);
            console.error("경매 데이터 조회 실패:", error);
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

    return (
        <div className={getClassName()}>
        {isFarmer ? (
                // 농부일 때
                localAuctionData === null ? (
                    <AuctionRegisterPage 
                        streamingRoom={streamingRoom}
                        onRegisterSuccess={onRegisterSuccess}
                        onCheckPrice={onCheckPrice}
                        onCheckSalesHistory={onCheckSalesHistory}
                    />
                   
                ) : (
                    <AuctionStatusPage 
                    streamingRoom={streamingRoom}
                    auctionData={localAuctionData}
                    onOpenModal={onOpenModal}
                    onEndAuction={onEndAuction}
                    onCheckPrice={onCheckPrice}
                    onCheckSalesHistory={onCheckSalesHistory}
                />
                )
            ) : (
                // 구매자일 때
                localAuctionData ===null ? (
                    <div className="waiting-message">
                        <img src={logo} width="100%" height="100%" alt="경매 대기" srcset="" />
                    </div>
                   
                ) : (
                    <BidPage 
                    streamingRoom={streamingRoom}
                    auctionData={localAuctionData}
                    onAuctionEnd={onEndAuction}
                    onOpenModal={onOpenModal}
                    onCheckPrice={onCheckPrice}
                    onCheckSalesHistory={onCheckSalesHistory}
                    userWallet={userWallet}
                    userRole={userRole}
                />
                )
            )}


            {!isFarmer&&showMessage && (
             <div className="overlay">
                <div className="MessageContainer">
                    <div className="MessageContent">
                        <button onClick={handleHideMessages} className="CloseButton">
                            X
                        </button>
                        <div className="MessageItem">{messages}</div>
                    </div>
                </div>
             </div>
            )}

        </div>
    );
});

export default BiddingSection; 