import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';
import productImage from '../../image/상품1.png';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { item, quantity } = location.state || {};
    
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        phone: '',
        address: ''
    });

    // 컴포넌트 마운트 시 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:9001/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // 사용자 정보로 배송정보 초기화
                setShippingInfo({
                    name: response.data.name,
                    phone: response.data.phone,
                    address: response.data.address
                });
            } catch (error) {
                console.error('사용자 정보 조회 실패:', error);
                if (error.response?.status === 401) {
                    alert('로그인이 필요한 서비스입니다.');
                    navigate('/login');
                }
            }
        };

        fetchUserInfo();
    }, [navigate]);

    if (!item || !quantity) {
        return <div>주문 정보를 찾을 수 없습니다.</div>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayment = async () => {
        if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
            alert('배송 정보를 모두 입력해주세요.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const orderData = {
                shopSeq: item.shopSeq,
                quantity: quantity,
                totalPrice: item.price * quantity + 3000,
                shippingInfo: {
                    name: shippingInfo.name,
                    phone: shippingInfo.phone,
                    address: shippingInfo.address
                }
            };

            // // 주문 API 호출
            // await axios.post('http://localhost:9001/api/orders', orderData, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // });

            alert('결제가 완료되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('결제 처리 실패:', error);
            alert('결제 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="payment-container">
            <h2>결제하기</h2>
            
            <div className="payment-content">
                <div className="order-summary">
                    <h3>주문 상품 정보</h3>
                    <div className="product-summary">
                        <div className="product-image">
                            <img src={productImage} alt={item.productName} />
                        </div>
                        <div className="product-details">
                            <h4>{item.productName}</h4>
                            <p>{item.content}</p>
                            <p>수량: {quantity}개</p>
                            <p className="price">
                                상품금액: {(item.price * quantity).toLocaleString()}원
                            </p>
                        </div>
                    </div>
                </div>

                <div className="shipping-info">
                    <h3>배송 정보</h3>
                    <div className="form-group">
                        <label>받는 사람</label>
                        <input
                            type="text"
                            name="name"
                            value={shippingInfo.name}
                            onChange={handleInputChange}
                            placeholder="이름을 입력하세요"
                        />
                    </div>
                    <div className="form-group">
                        <label>연락처</label>
                        <input
                            type="tel"
                            name="phone"
                            value={shippingInfo.phone}
                            onChange={handleInputChange}
                            placeholder="전화번호를 입력하세요"
                        />
                    </div>
                    <div className="form-group">
                        <label>주소</label>
                        <input
                            type="text"
                            name="address"
                            value={shippingInfo.address}
                            onChange={handleInputChange}
                            placeholder="주소를 입력하세요"
                        />
                    </div>
                </div>

                <div className="payment-summary">
                    <h3>결제 정보</h3>
                    <div className="payment-details">
                        <div className="payment-row">
                            <span>상품금액</span>
                            <span>{(item.price * quantity).toLocaleString()}원</span>
                        </div>
                        <div className="payment-row">
                            <span>배송비</span>
                            <span>3,000원</span>
                        </div>
                        <div className="payment-row total">
                            <span>총 결제금액</span>
                            <span>{(item.price * quantity + 3000).toLocaleString()}원</span>
                        </div>
                    </div>
                </div>

                <div className="payment-buttons">
                    <button className="cancel-btn" onClick={() => navigate(-1)}>
                        취소
                    </button>
                    <button className="payment-btn" onClick={handlePayment}>
                        결제하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment; 