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

const Statistics = () => {
    const [userStats, setUserStats] = useState(null);
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

    const options = {
        plugins: {
            legend: {
                position: 'bottom'
            },
            title: {
                display: true,
                text: '회원 유형별 분포',
                font: {
                    size: 16
                }
            }
        }
    };

    return (
        <div className="statistics-container">
            <h2>사이트 통계</h2>
                <div className="chart-container">
                    <h3>회원 유형별 분포</h3>
                    <div className="pie-chart">
                        <Pie data={userDistributionData} options={options} />
                    </div>
                </div>
        </div>
    );
};

export default Statistics;  