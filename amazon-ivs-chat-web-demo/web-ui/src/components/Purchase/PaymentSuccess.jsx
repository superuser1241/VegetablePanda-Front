import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');

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

    useEffect(() => {
        const fetchOrderInfo = async () => {
            // console.log('orderUid');
            // console.log(orderUid);

            try {
                const response = await axios.post('http://localhost:9001/shop/order', null, { 
                    params: {orderUid:'O202412042302157451'},
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('response.data');
                console.log(response.data);
                setOrderInfo(response.data);

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
        <div>
            <h2>결제 완료</h2>
            주문번호 : 000000
            구매날짜 : {orderInfo.buyDate}
            <hr />
            주문정보 - orderUid이용해서
            주문 상세품목

            결제 정보
            

        </div>
    );
};

export default PaymentSuccess;