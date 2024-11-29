import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StockList.css';

const StockList = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [userId, setUserId] = useState('');

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
    },[])

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
        <div>
            <h3>재고 목록</h3>
            <table>
                <tr>
                    <th>상품명</th>
                    <th>수량</th>
                    <th>등급</th>
                    <th>인증</th>
                </tr>
                {
                    productList.map((item) => {
                        return <tr>
                            <td>{item.content}</td>
                            <td>{item.count}</td>
                            <td>{item.stockGrade}</td>
                        </tr>
                    })
                }

            </table>
        </div>
    );
};

export default StockList;