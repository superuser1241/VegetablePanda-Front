import React,{useState,useEffect, useRef} from 'react';
import { Client } from "@stomp/stompjs";
import './NotiSet.css';

const NotiSet = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [inputMessage, setInputMessage] = useState([]);
    const [messages, setMessages] = useState("");
    const [stompClient, setStompClient] = useState(null);
    


    useEffect(() => {
      const client = new Client({
        brokerURL: "ws://localhost:9001/ws", // Spring WebSocket 엔드포인트
        headers: {
          "Content-Type": "application/json",
          "userSeq":"3",
        },
        debug: (str) => console.log(str), // 디버깅 로그
        reconnectDelay: 5000, // 재연결 딜레이
        onConnect: () => {
          console.log("Connected to WebSocket");

          client.subscribe("/bid/notifications", (message) => {
            console.log("123");
            setShowMessage(!showMessage);
            setMessages((prevMessages) => message.body);
          });

          client.subscribe("/topic/notifications", (message) => {
            console.log("123");
            setShowMessage(!showMessage);
            setMessages((prevMessages) => message.body);
          });
        },
        onDisconnect: () => console.log("Disconnected from WebSocket"),
      });//useEffect종료
  
  
      client.activate(); // WebSocket 연결 활성화
      setStompClient(client);
  
      return () => {
        client.deactivate(); // 컴포넌트 언마운트 시 연결 종료
      };
    }, []);


    const handleHideMessages = () => {
        setShowMessage(false); // 메시지 영역 숨기기
      };


    return (
        <>
        
      {/* 메시지 영역 */}
      {showMessage && (
        <div className="MessageContainer">
        <div className="MessageContent">
          <button onClick={handleHideMessages} className="CloseButton">
            닫기
          </button>
            <div className="MessageItem">
              {messages}
            </div>
        </div>
        </div>
      )}
    
    </>
    );
};

export default NotiSet;