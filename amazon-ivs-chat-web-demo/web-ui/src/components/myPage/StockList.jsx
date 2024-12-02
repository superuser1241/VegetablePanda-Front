import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StockList.css';

const StockList = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [userId, setUserId] = useState(localStorage.getItem('userSeq'));

    const [stock, setStock] = useState({
        content:'',
        count: 0,
        color: 0, 
        stockGradeSeq: 0,
        stockOrganicSeq: 0,
        file: {
            fileSeq: '',
            name: '',
            path: ''
        }
    });
    const [productList, setProductList] = useState([{
        
    }]);

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                // setUserId(payload.user_seq);
                setUserId(localStorage.getItem('userSeq'));
                console.log("사용자 시퀀스 : ", userId);
                console.log("userSeq : ", localStorage.getItem('userSeq'));
                
            } catch (error) {
                console.error('토큰 파싱 실패:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        fetchProductList();
    },[token])

    const fetchProductList = async () => {
        try {
            const response = await axios.get('http://localhost:9001/stock/'+userId, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setProductList(response.data);
            console.log(productList);
            console.log("상품 목록:", response.data);
        } catch (error) {
            console.error('상품 목록 조회 실패:', error);
        }
    };

    return (
        <div className='stock-list-container'>
            <h3>재고 목록</h3>
            <div className='stock-table-container'>
                <table className='stock-table'>
                <thead>
                    <tr>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>등급</th>
                        <th>인증</th>
                        <th>색상</th>
                    </tr>
                </thead>
                <tbody>
                    {productList.map((item, index) => (
                        <tr key={item.stockSeq}>
                            <td >{item.productName}</td>
                            <td >{item.count}</td>
                            <td >{item.stockGrade}</td>
                            <td >{item.stockOrganic}</td>
                            <td >{item.color}</td>
                        </tr>
                    ))}
                </tbody>

                </table>
            </div>
        </div>
    );
};

export default StockList;