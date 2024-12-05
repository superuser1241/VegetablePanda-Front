import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
   const params = useParams();
   console.log(params.id);
   const orderUid = params.id;

    const location = useLocation();
    const token = localStorage.getItem('token');
    const serverIp = process.env.REACT_APP_SERVER_IP;

    // const { orderUid } = location.state?.orderUid;
    // const { orderNumber, items, totalAmount } = order;

    const [orderInfo, setOrderInfo] = useState({
        buySeq : 0,
        buyDate : '',
        state: 0,
        totalPrice: 0,
        orderUid: '',
        userBuyDetails : []
    });

    const [orderDetailInfo, setOrderDetailInfo] = useState([]);
    const [key, setKey] = useState(0);

    useEffect(() => {
        console.log(orderUid);
        const fetchOrderInfo = async () => {
            // console.log('orderUid');
            // console.log(orderUid);

            // const data = {
            //     orderUid: 'O202412051127589461'
            // }


            try {
                const response = await axios.post(`${serverIp}/shop/order`, null, { 
                    params: {orderUid:params.id},
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if(response.status === 200) {

                    console.log('response.data');
                    console.log(response.data);
                    console.log('userBuyDetails');
                    console.log(response.data.userBuyDetails);
                    setOrderInfo(response.data);
                    console.log(orderInfo); // state가 변경되고 리렌더링 된 후에 나온다

                    // const formattedData = orderInfo.userBuyDetails.map((detail) => ({
                    //     userBuySeq: detail.userBuySeq,
                    //     buySeq: detail.buySeq,
                    //     price: detail.price,
                    //     count: detail.count,
                    //     stockSeq: detail.stockSeq,
                    // }));

                    const response2 = await axios.post(`${serverIp}/userBuyDetail/orderInfo`, 
                        response.data.userBuyDetails,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        if(response2.status === 200) {
                            console.log('주문 상품 정보');
                            console.log(response2.data);
                            setOrderDetailInfo(response2.data)
                        }
                }

            } catch (error) {
                console.error('주문 정보 조회 실패:', error);
                if (error.response?.status === 401) {
                    alert('로그인이 필요한 서비스입니다.');
                }
            }
        };

        fetchOrderInfo();
    }, []);
    return (
        <div className="payment-success-container">
        <h2>결제 완료</h2>
        <div className="success-order-info">
            <p>주문번호: {orderInfo.orderUid}</p>
            <p>구매날짜: {orderInfo.buyDate?.split('T')[0]}</p>
        </div>
        <hr />
        <h3>주문 상세 내역</h3>
        <div className="success-order-table-container">
            <table className="success-order-table">
                <thead>
                    <tr>
                        <th>상품이미지</th>
                        <th>상품명</th>
                        <th>구매수량</th>
                        <th>가격</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetailInfo.map((item) => (
                        <tr key={item.stockSeq} className="success-order-row">
                            <td className="success-image-cell">
                                <img 
                                    src={item.file || 'https://placehold.co/150x150?text=vegetable'} 
                                    alt={item.productName}
                                />
                            </td>
                            <td>{item.productName}</td>
                            <td>{item.count}개</td>
                            <td>{item.price.toLocaleString()}원</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="success-total-price">
            <p>총 결제 금액: {orderInfo.totalPrice.toLocaleString()}원</p>
        </div>
    </div>
    );
};

export default PaymentSuccess;