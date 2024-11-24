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
    const [shopItems, setShopItems] = useState([]);
    const [error, setError] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleItems, setVisibleItems] = useState(4);

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

        const fetchShopItems = async () => {
            try {
                const response = await axios.get('http://localhost:9001/api/shop');
                setShopItems(response.data);
            } catch (err) {
                console.error('상품 목록을 불러오는데 실패했습니다:', err);
            }
        };

        fetchActiveRooms();
        fetchShopItems();
    }, []);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(slideInterval);
    }, []);

    const handleLoadMore = () => {
        setVisibleItems(prev => prev + 4);
    };

    return (
        <>
            <div className="slider-wrapper">
                <div
                    className="slider"
                    style={{ backgroundColor: slides[currentSlide].backgroundColor }}
                >
                    <h2>{slides[currentSlide].text}</h2>
                </div>
            </div>
            <div className="container">
                <section className="streaming-section">
                    <h2 className="section-title">실시간 스트리밍</h2>
                    <div className="room-list">
                        {rooms.slice(0, visibleItems).map((room) => (
                            <div key={room.streamingSeq} className="room-card">
                                <h3>Room ID: {room.chatRoomId}</h3>
                                <button
                                    className="join-button"
                                    onClick={() => onJoinRoom(room)}
                                >
                                    Join Room
                                </button>
                            </div>
                        ))}
                    </div>
                    {rooms.length > visibleItems && (
                        <button className="load-more-button" onClick={handleLoadMore}>
                            더보기
                        </button>
                    )}
                </section>

                <section className="shop-section">
                    <h2 className="section-title">일반 상품 목록</h2>
                    <div className="shop-list">
                        {shopItems.slice(0, visibleItems).map((item) => (
                            <div key={item.shopSeq} className="shop-card">
                                <h3>{item.content}</h3>
                                <div className="shop-info">
                                    <p><span>가격:</span> {item.price.toLocaleString()}원</p>
                                    <p><span>수량:</span> {item.count}개</p>
                                    <p><span>상품:</span> {item.productName}</p>
                                    <p><span>등급:</span> {item.stockGrade}</p>
                                    <p><span>인증:</span> {item.stockOrganic}</p>
                                </div>
                                <button className="buy-button">구매하기</button>
                            </div>
                        ))}
                    </div>
                    {shopItems.length > visibleItems && (
                        <button className="load-more-button" onClick={handleLoadMore}>
                            더보기
                        </button>
                    )}
                </section>
            </div>
        </>
    );
};

export default MainPage;
