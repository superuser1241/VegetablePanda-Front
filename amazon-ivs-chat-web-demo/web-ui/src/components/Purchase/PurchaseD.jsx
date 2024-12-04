import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PurchaseD.css';
import productImage from '../../image/상품1.png';
import axios from 'axios';

const PurchaseD = ({userName}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userSeq = localStorage.getItem('userSeq');
    const [userInfo, setUserInfo] = useState({
        name: '',
        address: '',
        phone: ''
    })
    const item = location.state?.item;
    const quantity = location.state?.quantity;
    // const [quantity, setQuantity] = useState(1);
    const serverIp = process.env.REACT_APP_SERVER_IP;
    
    useEffect( () => {
        async function fetchUserInfo() {
            if(token) {
                try {
                    const response = await axios.get(`${serverIp}/api/user`, {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    setUserInfo({
                        name: response.data.name,
                        phone: response.data.phone,
                        address: response.data.address
                    });
                    console.log("사용자 정보:", response.data);
                } catch (error) {
                    console.error('유저 정보 조회 실패:', error);
                }
            }
        }
        fetchUserInfo();
    },[]);

    if (!item) {
        return <div>상품 정보를 찾을 수 없습니다.</div>;
    }

    // const handleQuantityChange = (e) => {
    //     const value = parseInt(e.target.value);
    //     if (value > 0 && value <= item.count) {
    //         setQuantity(value);
    //     }
    // };

    const handlePurchase = () => {
        navigate('/payment', { 
            state: { 
                item: item,
                quantity: quantity 
            } 
        });
    };

    

    return (
        <div className="purchase-container">
            <h2>주문서</h2>
            <div className="purchase-details">
                <div className="product-info">
                    <div className='order-info'>
                        <h3>상품 정보</h3>
                        {/* <p>주문자명 : {userName} </p>
                        <p>배송주소 : {userInfo.address} </p>
                        <p>연락처 : {userInfo.phone} </p> */}
                    </div>
                    <div className='info-container'>
                        <div className="purchase-product-image">
                            <img src={item.file} alt={item.productName} />
                        </div>
                        <h3>{item.productName}</h3>
                        <p className="description">{item.content}</p>
                        <div className="specs">
                            <p><span>등급 </span> {item.stockGrade}</p>
                            <p><span>인증 </span> {item.stockOrganic}</p>
                            <p><span>재고 </span> {item.count}개</p>
                            <p><span>가격 </span> {item.price.toLocaleString()}원</p>
                        </div>
                    </div>
                </div>
                
                <div className="purchase-form">
                    <div className="quantity-selector">
                        <label>구매 수량: {quantity}</label>
                        
                    </div>
                    
                    <div className="total-price">
                        <h4>총 결제 금액:</h4>
                        <p>{(item.price * quantity).toLocaleString()}원</p>
                    </div>

                    <div className="buttons">
                        <button className="cancel-btn" onClick={() => navigate(-1)}>
                            취소
                        </button>
                        <button className="purchase-btn" onClick={handlePurchase}>
                            구매하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseD; 