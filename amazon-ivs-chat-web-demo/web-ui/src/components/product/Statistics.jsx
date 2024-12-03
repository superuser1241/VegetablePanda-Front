import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Statistics = ({ stockSeq }) => {
    const [period, setPeriod] = useState('daily');
    const [stats, setStats] = useState(null);
    const [priceStats, setPriceStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
                
                const formatDate = (date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };
                
                const startDate = formatDate(oneMonthAgo);
                const endDate = formatDate(new Date());
                
                const response = await axios.get(`http://localhost:9001/api/${period}`, {
                    params: {
                        startDate: startDate,
                        endDate: endDate
                    }
                });
                
                setStats(response.data);

                // 가격 통계 데이터 fetch
                const priceStatsResponse = await axios.get('http://localhost:9001/api/price/statistics');
                setPriceStats(priceStatsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setStats([]);
            }
        };
        
        fetchData();
    }, [period]);

    return (
        <div className="statistics-container">
            <div className="header">
                <div className="period-buttons">
                    <button onClick={() => setPeriod('daily')} className={period === 'daily' ? 'active' : ''}>
                        일별
                    </button>
                    <button onClick={() => setPeriod('weekly')} className={period === 'weekly' ? 'active' : ''}>
                        주별
                    </button>
                    <button onClick={() => setPeriod('monthly')} className={period === 'monthly' ? 'active' : ''}>
                        월별
                    </button>
                </div>
                {priceStats && (
                    <div className="price-stats-container">
                        <div className="price-box">
                            <span className="price-label">전날 대비 최고가</span>
                            <span className="price-value">
                                {Number(priceStats.yesterdayMaxPrice).toLocaleString()}원
                            </span>
                        </div>
                        <div className="price-box">
                            <span className="price-label">주간 평균가</span>
                            <span className="price-value">
                                {Number(priceStats.weeklyAveragePrice).toLocaleString()}원
                            </span>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="chart-area">
                <ResponsiveContainer width="100%" height={450}>
                    <LineChart
                        data={stats}
                        margin={{
                            top: 1,
                            right: 30,
                            left: 20,
                            bottom: 1
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="period" 
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            interval={period === 'daily' ? 6 : period === 'weekly' ? 0 : 4} // 일별: 7일 간격, 주간: 모든 레이블, 월별: 7일 간격
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend 
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{
                                paddingTop: '1px',
                                bottom: '0px'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="totalSales"
                            name="판매 건수"
                            stroke="#219a52"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="totalQuantity"
                            name="판매 수량"
                            stroke="#ffa726"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default Statistics;
