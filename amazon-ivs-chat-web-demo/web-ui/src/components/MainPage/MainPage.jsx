import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MainPage.css';

const slides = [
    { id: 1, text: 'Welcome to 농산물 판다!', backgroundColor: '#f8d7da' },
    { id: 2, text: 'Find the freshest products!', backgroundColor: '#d1ecf1' },
    { id: 3, text: 'Join the best farmers today!', backgroundColor: '#d4edda' },
    { id: 4, text: 'Get discounts on bulk orders!', backgroundColor: '#fff3cd' },
];

const MainPage = ({ onJoinRoom }) => {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchActiveRooms = async () => {
            try {
                const response = await axios.get('http://localhost:9001/api/streaming/active-rooms');
                setRooms(response.data);
            } catch (err) {
                setError('Failed to fetch active rooms. Please try again.');
                console.error(err);
            }
        };

        fetchActiveRooms();
    }, []);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(slideInterval);
    }, []);

    return (
        <div className="container">
            <div
                className="slider"
                style={{ backgroundColor: slides[currentSlide].backgroundColor }}
            >
                <h2>{slides[currentSlide].text}</h2>
            </div>
            {/* {error && <p className="error">{error}</p>} */}
            <div className="room-list">
                {rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div key={room.streamingSeq} className="room-card">
                            <h3>Room ID: {room.chatRoomId}</h3>
                            <button
                                className="join-button"
                                onClick={() => onJoinRoom(room)}
                            >
                                Join Room
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No active rooms available</p>
                )}
            </div>
        </div>
    );
};

export default MainPage;
