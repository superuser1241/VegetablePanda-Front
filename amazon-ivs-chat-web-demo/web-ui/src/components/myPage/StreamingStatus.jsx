import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StreamingStatus = ({ userId, token, onStartStreaming }) => {
    const navigate = useNavigate();
    const [streamingStatus, setStreamingStatus] = useState(null);
    const [approvedStreaming, setApprovedStreaming] = useState(null);
    const [availableRoom, setAvailableRoom] = useState(null);

    // 초기 사용 가능한 방 조회 (상태값 0)
    const fetchAvailableRoom = async () => {
        try {
            const response = await axios.get('http://localhost:9001/api/streaming/available', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setAvailableRoom(response.data);
        } catch (error) {
            console.error('사용 가능한 방 조회 실패:', error);
            setAvailableRoom(null);
        }
    };

    // 방송 신청 처리
    const handleStreamingRequest = async () => {
        try {
            if (!availableRoom) {
                alert('사용 가능한 방이 없습니다.');
                return;
            }

            const response = await axios.post(
                `http://localhost:9001/api/streaming/request/${availableRoom.streamingSeq}`, 
                null,
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        farmerSeq: userId
                    }
                }
            );

            if (response.status === 200) {
                alert('방송 신청이 완료되었습니다. 관리자 승인을 기다려주세요.');
                setStreamingStatus('pending');
                setAvailableRoom(null);
            }
        } catch (error) {
            console.error('방송 신청 실패:', error);
            alert('방송 신청 중 오류가 발생했습니다.');
        }
    };

    // 승인된 방송 체크 (상태값 1)
    const checkApprovedStreaming = async () => {
        try {
            const response = await axios.get('http://localhost:9001/api/streaming/active-rooms', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Active Rooms Response:', response.data); // 응답 데이터 확인
            console.log('Current userId:', userId); // 현재 userId 확인
            
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                console.log('Streaming data exists');
                const myStreaming = response.data.find(stream => {
                    console.log('Comparing:', stream.farmerSeq, userId, typeof stream.farmerSeq, typeof userId);
                    return Number(stream.farmerSeq) === Number(userId);
                });
                
                console.log('Found streaming:', myStreaming); // 찾은 스트리밍 데이터 확인
                
                if (myStreaming) {
                    setApprovedStreaming(myStreaming);
                    setStreamingStatus('approved');
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('승인된 방송 조회 실패:', error);
            console.error('Error details:', error.response?.data); // 에러 상세 정보 확인
            return false;
        }
    };

    useEffect(() => {
        const init = async () => {
            if (userId) {
                console.log('Initializing with userId:', userId); // userId 확인
                const hasApproved = await checkApprovedStreaming();
                if (!hasApproved) {
                    fetchAvailableRoom();
                }
            }
        };
        
        init();
        const interval = setInterval(checkApprovedStreaming, 5000);
        return () => clearInterval(interval);
    }, [userId, token]); // token도 의존성 배열에 추가

    const handleStartStreaming = () => {
        if (!approvedStreaming) {
            alert('방송 정보를 불러올 수 없습니다.');
            return;
        }

        console.log('StreamingStatus - Starting stream with:', approvedStreaming);
        onStartStreaming(approvedStreaming);  // App.js의 handleStartStreaming 호출
    };

    return (
        <div className="streaming-section">
            <h3>스트리밍 관리</h3>
            {streamingStatus === 'pending' ? (
                <div className="streaming-status">
                    <p>방송 승인 대기 중입니다. 관리자의 승인을 기다려주세요.</p>
                </div>
            ) : streamingStatus === 'approved' ? (
                <div className="streaming-info">
                    <h4>승인된 방송 정보</h4>
                    <p><strong>서버 주소:</strong> {approvedStreaming?.serverAddress}</p>
                    <p><strong>토큰:</strong> {approvedStreaming?.token}</p>
                    <p><strong>상품명:</strong> {approvedStreaming?.productName}</p>
                    <button 
                        className="streaming-btn"
                        onClick={handleStartStreaming}
                    >
                        방송 시작하기
                    </button>
                </div>
            ) : (
                <div className="streaming-buttons">
                    <button 
                        className="streaming-btn"
                        onClick={handleStreamingRequest}
                        disabled={!availableRoom}
                    >
                        방송 신청하기
                    </button>
                    {!availableRoom && <p>현재 사용 가능한 방이 없습니다.</p>}
                </div>
            )}
        </div>
    );
};

export default StreamingStatus;