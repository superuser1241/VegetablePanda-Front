import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminApprovalPage.css';

function AdminApprovalPage({ streamingRoom, setStreamingRoom }) {
    const [pendingStreamings, setPendingStreamings] = useState([]);
    const [approvalTriggered, setApprovalTriggered] = useState(false);

    const fetchPendingStreamings = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:9001/api/streaming/pending', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                const filteredStreamings = response.data.filter((stream) => stream.state === 2);
                setPendingStreamings(filteredStreamings);
            }
        } catch (error) {
            console.error('Failed to fetch pending streamings:', error);
        }
    };

    const handleApprove = async (streamingSeq) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:9001/api/streaming/approve/${streamingSeq}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            alert(`스트리밍 ${streamingSeq}이 승인되었습니다.`);
    
            if (streamingRoom && streamingRoom.streamingSeq === streamingSeq) {
                const updatedRoom = { ...streamingRoom, state: 1 };
                setStreamingRoom(updatedRoom);
            }
    
            setApprovalTriggered((prev) => !prev);
        } catch (error) {
            console.error('Failed to approve streaming:', error);
            alert('승인 작업 중 오류가 발생했습니다.');
        }
    };
    
    
    useEffect(() => {
        fetchPendingStreamings();
        const interval = setInterval(() => {
            fetchPendingStreamings();
        }, 5000);
        return () => clearInterval(interval);
    }, [approvalTriggered]);

    return (
        <div>
            <h1>승인 대기중인 스트리밍</h1>
            {pendingStreamings.length === 0 ? (
                <p>승인 대기중인 스트리밍이 없습니다.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>서버 주소</th>
                            <th>상태</th>
                            <th>액션</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingStreamings.map((room) => (
                            <tr key={room.streamingSeq}>
                                <td>{room.streamingSeq}</td>
                                <td>{room.serverAddress}</td>
                                <td>{room.state === 2 ? '승인 대기중' : '알 수 없음'}</td>
                                <td>
                                    <button onClick={() => handleApprove(room.streamingSeq)}>
                                        승인하기
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminApprovalPage;
