import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StreamingParticular({ streamingRoom, setStreamingRoom, setCurrentRoomId, onEnterChat }) {
    const [isJoinable, setIsJoinable] = useState(false);

    const handleRoomClick = (chatRoomId) => {
        const token = localStorage.getItem('token');
        if (token && chatRoomId) {
            if (streamingRoom?.chatRoomId === chatRoomId && streamingRoom.state === 2) {
                console.warn('Room already in approval state');
                return;
            }

            axios
                .get(`http://localhost:9001/api/streaming/available?roomId=${chatRoomId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    if (response.status === 200) {
                        const roomData = response.data;
                        const updatedRoom = { ...roomData, state: 2 };

                        axios
                            .post(`http://localhost:9001/api/streaming/request/${updatedRoom.streamingSeq}`, null, {
                                headers: { Authorization: `Bearer ${token}` },
                            })
                            .then(() => {
                                console.log('승인 요청 성공:', updatedRoom);
                                setCurrentRoomId(chatRoomId);
                                setStreamingRoom(updatedRoom);
                                setIsJoinable(false);
                            })
                            .catch((error) => {
                                console.error('Failed to request streaming:', error);
                            });
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch streaming rooms:', error);
                });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (streamingRoom?.chatRoomId) {
                const token = localStorage.getItem('token');
                axios
                    .get(`http://localhost:9001/api/streaming/status?roomId=${streamingRoom.chatRoomId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((response) => {
                        if (response.status === 200) {
                            console.log('상태 확인 응답:', response.data);
                            setStreamingRoom(response.data);
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to fetch updated room status:', error);
                    });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [streamingRoom, setStreamingRoom]);

    useEffect(() => {
        if (streamingRoom?.state === 1) {
            setIsJoinable(true);
        } else {
            setIsJoinable(false);
        }
    }, [streamingRoom]);

    return (
        <div>
            <h1>채팅 방 선택</h1>
            <div className="button-container">
                {streamingRoom ? (
                    <div>
                        <h2>채팅방 정보</h2>
                        <p>
                            <strong>상태:</strong>{' '}
                            {streamingRoom.state === 2
                                ? '승인 대기중'
                                : streamingRoom.state === 1
                                ? '사용 중'
                                : '사용 가능'}
                        </p>
                        <button
                            disabled={!isJoinable}
                            onClick={() => {
                                onEnterChat();
                            }}
                        >
                            입장하기
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>아래에서 채팅방을 선택하세요:</p>
                        {[...Array(6)].map((_, i) => (
                            <button key={i} onClick={() => handleRoomClick(`chatRoom${i + 1}`)}>
                                채팅방 {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StreamingParticular;
