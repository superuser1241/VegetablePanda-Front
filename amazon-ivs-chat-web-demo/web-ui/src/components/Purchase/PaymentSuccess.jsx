import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const { orderUid } = location.state?.orderUid;

    useEffect(() => {
        const fetchOrderInfo = async () => {
            const token = localStorage.getItem('token');
            console.log('orderUid');
            console.log(orderUid);

            try {
                const response = await axios.post('http://localhost:9001/shop/order', {orderUid:orderUid}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log(response.data);


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
            <hr />
            주문정보 - orderUid이용해서
            주문 상세품목

            결제 정보


        </div>
    );
};

export default PaymentSuccess;