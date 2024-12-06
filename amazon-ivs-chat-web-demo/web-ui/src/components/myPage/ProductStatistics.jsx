import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ProductStatistics.css';

const ProductStatistics = () => {
    const [period, setPeriod] = useState('daily');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedStock, setSelectedStock] = useState(null);
    const [stats, setStats] = useState(null);
    const serverIp = process.env.REACT_APP_SERVER_IP;
    const token = localStorage.getItem('token');

    // 상품 목록 가져오기
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axios.get(`${serverIp}/products/all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProducts(response.data);
                if (response.data.length > 0) {
                    setSelectedProduct(response.data[0].productSeq);
                    setSelectedStock(response.data[0].stockSeq);
                }
            } catch (error) {
                console.error('상품 목록 조회 실패:', error);
            }
        };
        fetchAllProducts();
    }, []);

    // 통계 데이터 가져오기
    useEffect(() => {
        const fetchStatistics = async () => {
            if (!selectedStock) return;

            const today = new Date();
            const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
            
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            
            try {
                const response = await axios.get(`${serverIp}/api/${period}`, {
                    params: {
                        startDate: formatDate(oneMonthAgo),
                        endDate: formatDate(new Date()),
                        stockSeq: selectedStock
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setStats(response.data);
            } catch (error) {
                console.error('통계 데이터 조회 실패:', error);
            }
        };

        fetchStatistics();
    }, [period, selectedStock]);

    // 상품 선택 핸들러
    const handleProductChange = (e) => {
        const productSeq = e.target.value;
        setSelectedProduct(productSeq);
        // 선택된 상품의 stockSeq 찾기
        const selectedProductData = products.find(p => p.productSeq.toString() === productSeq);
        setSelectedStock(selectedProductData?.stockSeq);
    };

    return (
        <div className="statistics-container">
            <div className="controls">
                <select 
                    value={selectedProduct} 
                    onChange={handleProductChange}
                    className="product-select"
                >
                    {products.map(product => (
                        <option 
                            key={product.productSeq} 
                            value={product.productSeq}
                            disabled={!product.stockSeq}
                        >
                            {product.productName} {!product.stockSeq && '(재고 없음)'}
                        </option>
                    ))}
                </select>

                <div className="period-buttons">
                    <button 
                        className={period === 'daily' ? 'active' : ''} 
                        onClick={() => setPeriod('daily')}
                    >
                        일별
                    </button>
                    <button 
                        className={period === 'weekly' ? 'active' : ''} 
                        onClick={() => setPeriod('weekly')}
                    >
                        주간별
                    </button>
                    <button 
                        className={period === 'monthly' ? 'active' : ''} 
                        onClick={() => setPeriod('monthly')}
                    >
                        월별
                    </button>
                </div>
            </div>

            {stats && stats.length > 0 ? (
                    <ResponsiveContainer width="100%" height={450}>
                        <LineChart
                            data={stats}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="period" 
                                angle={-45}
                                textAnchor="end"
                                height={70}
                                interval={period === 'daily' ? 6 : period === 'weekly' ? 0 : 4}
                            />
                            <YAxis yAxisId="left" orientation="left" stroke="#219a52" />
                            <YAxis yAxisId="right" orientation="right" stroke="#ffa726" />
                            <Tooltip />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="totalSales"
                                name="판매 건수"
                                stroke="#219a52"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="totalQuantity"
                                name="판매 수량"
                                stroke="#ffa726"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
            ) : (
                <div className="no-data-message">
                    <p>선택한 상품의 판매 데이터가 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default ProductStatistics; 