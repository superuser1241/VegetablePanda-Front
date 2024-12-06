import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import './UserStatistics.css';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const UserStatistics = () => {
    const [userStats, setUserStats] = useState(null);
    const [purchaseStats, setPurchaseStats] = useState(null);
    const serverIp = process.env.REACT_APP_SERVER_IP;

    useEffect(() => {
        const fetchUserStatistics = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${serverIp}/user/statistics`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserStats(response.data);
            } catch (error) {
                console.error('통계 데이터 조회 실패:', error);
            }
        };

        fetchUserStatistics();
    }, []);

    useEffect(() => {
        const fetchPurchaseStatistics = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${serverIp}/purchase`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPurchaseStats(response.data);
            } catch (error) {
                console.error('거래 통계 데이터 조회 실패:', error);
            }
        };

        fetchPurchaseStatistics();
    }, []);

    const userDistributionData = {
        labels: ['일반 회원', '농부 회원', '기업 회원'],
        datasets: [{
            data: [
                userStats?.userCount || 0,
                userStats?.farmerCount || 0,
                userStats?.companyCount || 0
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    };

    const purchaseDistributionData = {
        labels: ['일반회원 경매', '기업회원 경매', '일반 구매'],
        datasets: [{
            data: [
                purchaseStats?.auctionPurchaseCount || 0,
                purchaseStats?.companyAuctionPurchaseCount || 0,
                purchaseStats?.productPurchaseCount || 0
            ],
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value}건 (${percentage}%)`;
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    const calculateTotalCount = (stats) => {
        if (!stats) return 0;
        return (stats.userCount || 0) + (stats.farmerCount || 0) + (stats.companyCount || 0);
    };

    return (
        <div className="statistics-container">
            <div className="charts-wrapper">
                <div className="chart-box">
                    <h3>회원 유형별 분포</h3>
                    <div className="pie-chart">
                        <Pie data={userDistributionData} options={options} />
                    </div>
                    {userStats && (
                        <div className="chart-details">
                            <p>전체 회원 수: {calculateTotalCount(userStats)}명</p>
                            <p>일반 회원: {userStats.userCount || 0}명</p>
                            <p>농부 회원: {userStats.farmerCount || 0}명</p>
                            <p>기업 회원: {userStats.companyCount || 0}명</p>
                        </div>
                    )}
                </div>
                
                <div className="chart-box">
                    <h3>거래 유형별 통계</h3>
                    <div className="pie-chart">
                        <Pie data={purchaseDistributionData} options={options} />
                    </div>
                    {purchaseStats && (
                        <div className="chart-details">
                            <p>전체 거래 수: {
                                (purchaseStats.auctionPurchaseCount || 0) + 
                                (purchaseStats.companyAuctionPurchaseCount || 0) + 
                                (purchaseStats.productPurchaseCount || 0)
                            }건</p>
                            <p>일반회원 경매: {purchaseStats.auctionPurchaseCount}건</p>
                            <p>기업회원 경매: {purchaseStats.companyAuctionPurchaseCount}건</p>
                            <p>일반 구매: {purchaseStats.productPurchaseCount}건</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserStatistics;  