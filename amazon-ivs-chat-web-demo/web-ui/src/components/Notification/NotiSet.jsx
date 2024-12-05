import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import "./NotiSet.css";
import axios from "axios";

const serverIp = process.env.REACT_APP_SERVER_IP;

const NotiSet = ({ onSetStreamingRoom }) => {
    const [showMessage, setShowMessage] = useState(false); // 메시지 표시 상태
    const [messages, setMessages] = useState(""); // 메시지 내용
    const [roomData, setRoomData] = useState(null); // 채팅방 데이터 저장
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("userSeq");
        const client = new Client({
            brokerURL: `ws://${serverIp.replace('http://', '')}/ws`,
            headers: {
                "Content-Type": "application/json",
                userId: token,
            },
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");

                client.subscribe(`/user/${token}/notifications`, (message) => {
                    const body = message.body;

                    const [text, id] = body.split("///");
                    
                    if(id){
                      setRoomData({
                        chatRoomId: id,
                        otherData: `Data related to room ${id}`, // 추가 데이터
                    });
                    }else{
                      setRoomData(null);
                    }
                    setMessages(text);
                    setShowMessage(true); 
                });
                
            },
            onDisconnect: () => console.log("Disconnected from WebSocket"),
        });

        client.activate(); 

        return () => {
            client.deactivate(); 
        };
    }, []);

    // 이동 버튼 클릭 시 실행
    const handleNavigateToChat = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `${serverIp}/api/streaming/streamingData/${roomData.chatRoomId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data) {
                // 부모 컴포넌트(App.js)의 상태 업데이트
                onSetStreamingRoom(response.data);

                // /chat 경로로 이동
                navigate("/chat");
                setShowMessage(false);
            }
        } catch (error) {
            console.error("채팅방 데이터를 가져오는 중 오류 발생:", error);
        }
    };

    // 메시지 닫기 버튼
    const handleHideMessages = () => {
        setShowMessage(false);
    };

    return (
        <>
            {showMessage && (
                <div className="MessageContainer">
                    <div className="MessageContent">
                        <button onClick={handleHideMessages} className="CloseButton">
                            X
                        </button>
                        <div className="MessageItem">{messages}</div>
                        {roomData && (
                            <button onClick={handleNavigateToChat} className="NavigateButton">
                                방송 보기
                            </button>
                        )}
                    </div>
                </div>
            )}


        </>
    );
};

export default NotiSet;
