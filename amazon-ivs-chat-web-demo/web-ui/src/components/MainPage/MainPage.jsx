import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MainPage.css';
import { Link, useNavigate } from 'react-router-dom';
import Auction from '../auction/AuctionStock';
import productImage from '../../image/상품1.png';
import BidPage from '../auction/BidPage';
import { Pie, Line, Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AuctionStatus from '../auction/AuctionStatus';
import AuctionRegisterPage from '../auction/AuctionRegisterPage';
import liveImg from '../../image/라이브.png';

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement
);

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
    const token = localStorage.getItem("token");
    const [farmerSeq, setUserId] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleRooms, setVisibleRooms] = useState(4);
    const [visibleShops, setVisibleShops] = useState(4);
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState([]);

    const serverIp = process.env.REACT_APP_SERVER_IP;

    useEffect(() => {
        const fetchActiveRooms = async () => {
            try {
                const response = await axios.get(`${serverIp}/api/streaming/active-rooms`);
                setRooms(response.data);
                console.log('rooms:', rooms);
            } catch (err) {
                setError('Failed to fetch active rooms. Please try again.');
                console.error(err);
            }
        };
        const fetchShopItems = async () => {
            try {
                const response = await axios.get(`${serverIp}/api/shop`);
                setShopItems(response.data);
            } catch (err) {
                console.error('상품 목록을 불러오는데 실패했습니다:', err);
            }
        };
        fetchActiveRooms();
        fetchShopItems();
        console.log(shopItems);
    }, []);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(slideInterval);
    }, []);


    useEffect(() => {
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.user_Seq);
          } catch (error) {
            console.error("토큰 파싱 실패:", error);
          }
        }
      }, [token]);


    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const startDate = '2024-01-01T00:00:00';
                const endDate = '2024-12-31T23:59:59';
                
                const response = await axios.get(`${serverIp}/api/statistics/products`, {
                    params: { startDate, endDate }
                });
                console.log(response.data);
    
                // 판매 수량(totalQuantity) 기준으로 정렬하고 상위 10개만 선택
                const sortedData = response.data
                    .sort((a, b) => b.totalQuantity - a.totalQuantity)
                    .slice(0, 10);
                    
                setStatistics(sortedData);
            } catch (err) {
                console.error('통계 데이터를 불러오는데 실패했습니다:', err);
            }
        };

        fetchStatistics();
    }, []);

    useEffect(() => {
        const fetchWeeklyStats = async () => {
            try {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 6); // 7일치 데이터
                
                const response = await axios.get(`${serverIp}/api/statistics/daily`, {
                    params: {
                        startDate: startDate.toISOString().split('T')[0],
                        endDate: endDate.toISOString().split('T')[0]
                    }
                });
                
                setWeeklyStats(response.data);
            } catch (err) {
                console.error('주간 통계 데이터를 불러오는데 실패했습니다:', err);
            }
        };

        fetchWeeklyStats();
    }, []);

    const chartData = {
        labels: statistics.map(item => item.productName),
        datasets: [{
            data: statistics.map(item => item.totalQuantity),
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#7BC8A4',
                '#97BBCD',
                '#FFA07A',
                '#DDA0DD'
            ],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value}개 (${percentage}%)`;
                    }
                }
            },
            datalabels: {
                color: '#000',
                font: {
                    weight: 'bold',
                    size: 14
                },
                formatter: (value, context) => {
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${percentage}%`;
                },
                anchor: 'center',
                align: 'center',
                offset: 0
            }
        },
        maintainAspectRatio: false,
        cutout: '50%'
    };

    const weeklyChartData = {
        labels: weeklyStats.map(item => {
            const date = new Date(item.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [
            {
                type: 'bar',
                label: '일별 판매금액',
                data: weeklyStats.map(item => item.totalAmount),
                backgroundColor: 'rgba(126, 192, 89, 0.6)',
                borderColor: 'rgba(126, 192, 89, 1)',
                borderWidth: 2,
                borderRadius: 8,
                yAxisID: 'y-axis-amount'
            },
            {
                type: 'line',
                label: '일별 판매수량',
                data: weeklyStats.map(item => item.totalQuantity),
                fill: true,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                tension: 0.4,
                pointBackgroundColor: 'rgba(255, 159, 64, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255, 159, 64, 1)',
                pointHoverBorderWidth: 3,
                yAxisID: 'y-axis-quantity'
            }
        ]
    };

    const weeklyChartOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#333',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyColor: '#666',
                bodyFont: {
                    size: 13
                },
                borderColor: '#ddd',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function(context) {
                        if (context.dataset.type === 'bar') {
                            return `판매금액: ${context.raw.toLocaleString()}원`;
                        } else {
                            return `판매수량: ${context.raw}개`;
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            },
            'y-axis-amount': {
                type: 'linear',
                display: false,
                position: 'left',
            },
            'y-axis-quantity': {
                type: 'linear',
                display: false,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            }
        },
        maintainAspectRatio: false
    };

    const handleLoadMoreRooms = () => {
        setVisibleRooms(prev => prev + 4);
    };

    const handleLoadMoreShops = () => {
        setVisibleShops(prev => prev + 4);
    };
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
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
                <section className="statistics-section">
                    <div className="charts-container">
                        <div className="chart-container">
                            <div className="chart-title">최근 실적</div>
                            <Chart 
                                type='bar'
                                data={weeklyChartData} 
                                options={weeklyChartOptions}
                            />
                        </div>
                        <div className="chart-container">
                            <div className="chart-title">상위 거래품목 (30일 기준)</div>
                            {statistics.length > 0 ? (
                                <Pie 
                                    data={chartData} 
                                    options={chartOptions}
                                    plugins={[ChartDataLabels]}
                                />
                            ) : (
                                <p>통계 데이터를 불러오는 중...</p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="streaming-section-MainPage">
                    <h2 className="section-title">실시간 스트리밍</h2>
                    <div className="room-list">
                        {rooms.slice(0, visibleRooms).map((room) => (
                            <div key={room.streamingSeq} className="room-card">
                                <div className="room-image">
                                    <img 
                                        src={room.filePath || 'https://placehold.co/200x200?text=NoImage'} 
                                        alt={room.productName}
                                    />
                                    <img src={liveImg} alt="LIVE" className="live-badge" />
                                </div>
                                <div className="room-info">
                                    <h3 className='product-name-mainPage'>{room.productName || '상품명 없음'}</h3>
                                    <p className="farmer-name">판매자: {room.farmerName || '판매자 정보 없음'}</p>
                                    <button
                                        className="join-button"
                                        onClick={() => onJoinRoom(room)}
                                    >
                                        방송 입장하기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {rooms.length > visibleRooms && (
                        <button className="load-more-button" onClick={handleLoadMoreRooms}>
                            더보기
                        </button>
                    )}
                </section>

                <section className="shop-section">
                    <h2 className="section-title"><Link to = {"/shop"} className='default-link'>일반 상품 목록</Link></h2>
                    <div className="shop-list">
                        {shopItems.slice(0, visibleShops).map((item) => (
                            <div key={item.shopSeq} className="shop-card">
                            <Link to = {`/product/${item.stockSeq}`} state={{ product:item }} className='default-link product-name'>
                                <div className="shop-image">
                                    <img src={item.file ? item.file : 'https://placehold.co/200x200?text=vegetable'} alt={item.productName} />
                                </div>
                                <h3>{truncateText(item.content, 25)}</h3>
                                <div className="shop-info">
                                    <p><span>가격:</span> {item.price.toLocaleString()}원</p>
                                    <p><span>수량:</span> {item.count}개</p>
                                    <p><span>상품:</span> {item.productName}</p>
                                    <p><span>등급:</span> {item.stockGrade}</p>
                                    <p><span>인증:</span> {item.stockOrganic}</p>
                                </div>
                                <button 
                                    className="buy-button" 
                                    onClick={() => navigate('/purchase', { state: { item } })}
                                >
                                    구매하기
                                </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                    {shopItems.length > visibleShops && (
                        <button className="load-more-button" onClick={handleLoadMoreShops}>
                            더보기
                        </button>
                    )}
                </section>
            </div>
        </>
    );
};

export default MainPage;
