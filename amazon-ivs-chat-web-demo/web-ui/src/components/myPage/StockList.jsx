import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StockList.css';

const StockList = ({onStockSelect, setActiveTab}) => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [userId, setUserId] = useState(localStorage.getItem('userSeq'));
    const serverIp = process.env.REACT_APP_SERVER_IP;

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
    const [productList, setProductList] = useState([]);

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

            const response = await axios.get(`${serverIp}/stock/farmer/${userId}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setProductList(response.data);
            console.log(productList);
            console.log("재고 목록:", response.data);
        } catch (error) {
            console.error('재고 목록 조회 실패:', error);
        }
    };

    return (
        <div className='stock-list-container'>
            <div className='stock-list-middle'>
            <h3>재고 목록</h3>
            <div className='stock-table-container'>
                {productList.length > 0 ? (
                    <table className='stocklist-table'>
                    <thead className='stocklist-thead'>
                        <tr>
                            <th>상품명</th>
                            <th>수량</th>
                            <th>등급</th>
                            <th>인증</th>
                            <th>색상</th>
                        </tr>
                    </thead>
                    <tbody className='stocklist-tbody'>
                        {productList.map((item, index) => (
                            <tr key={item.stockSeq}
                                onClick={() => onStockSelect(item)}
                                style={{ cursor: 'pointer' }}
                                className='stocklist-item'
                            >
                                {/* <Link to = {`/stock-info/{${item.stockSeq}}`} state={{ item }}> */}
                                <td >{item.productName}</td>
                                <td >{item.count.toLocaleString()}</td>
                                <td >{item.stockGrade}</td>
                                <td >{item.stockOrganic}</td>
                                <td >{item.color === 1 ? '빨간색'
                                : item.color === 2 ? '주황색'
                                : item.color === 3 ? '초록색'
                                : item.color === 4 ? '보라색'
                                : item.color === 5 ? '흰색'
                                : '무색'}</td>
                                {/* <td><button onClick={(e) => {
                                        e.stopPropagation();  // 행 클릭 이벤트 전파 방지
                                        onStockSelect(item);
                                    }}>수정</button></td> */}
                            {/* </Link> */}
                            </tr>
                        ))}
                    </tbody>

                    </table> ) : (
                        <div className='no-data-notification'>등록된 재고가 없습니다.</div>
                )
                }
                </div>
            </div>
        </div>
    );
};

export default StockList;