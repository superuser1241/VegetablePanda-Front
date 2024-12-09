import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    Legend as RechartsLegend, 
    ResponsiveContainer 
} from 'recharts';

const Statistics = ({ stockSeq }) => {
    const [period, setPeriod] = useState('daily');
    const [stats, setStats] = useState(null);
    const [priceStats, setPriceStats] = useState(null);

    const serverIp = process.env.REACT_APP_SERVER_IP;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                let startDate, endDate;
                
                if (period === 'monthly') {
                    startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                } else if (period === 'weekly') {
                    startDate = new Date(today.setMonth(today.getMonth() - 1));
                } else {
                    startDate = new Date(today.setMonth(today.getMonth() - 1));
                }
                
                endDate = new Date();
                
                const formatDate = (date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };
                
                const formattedStartDate = formatDate(startDate);
                const formattedEndDate = formatDate(endDate);
                
                const response = await axios.get(`${serverIp}/api/${period}`, {
                    params: {
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                        stockSeq: stockSeq
                    }
                });
                
                setStats(response.data);

                const priceStatsResponse = await axios.get(`${serverIp}/api/price/statistics`, {
                    params: {
                        stockSeq: stockSeq
                    }
                });
                setPriceStats(priceStatsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setStats([]);
            }
        };
        
        if (stockSeq) {
            fetchData();
        }
    }, [period, stockSeq]);

    const getXAxisInterval = () => {
        switch (period) {
            case 'monthly':
                return 0;
            case 'weekly':
                return 1;
            case 'daily':
                return 6;
            default:
                return 0;
        }
    };

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
                            interval={getXAxisInterval()}
                        />
                        <YAxis />
                        <RechartsTooltip />
                        <RechartsLegend 
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