import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productImage from '../../image/상품1.png';
import './CartPurchase.css';
import axios from 'axios';
import { handlePayment } from './PortOne';
import PurchaseList from './PurchaseList';
import { useDaumPostcodePopup } from '../../../node_modules/react-daum-postcode/lib';
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';

const CartPurchase = () => {
    const open = useDaumPostcodePopup(postcodeScriptUrl)
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userSeq');
    const serverIp = process.env.REACT_APP_SERVER_IP;
    const location = useLocation();
    const navigate = useNavigate();
    const item = location.state?.item;
    const [quantity, setQuantity] = useState(1);
    const { items, totalAmount, userSeq } = location.state || {};
    let totalQuantity = items.reduce((acc, item) => acc + parseInt(item.quantity), 0);
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        address: '',
        phone: ''
    })

    const userBuyDetailDTOs = items.map((item)=>({
        price: item.price,
        count: item.quantity,
        stockSeq: item.stockSeq,
    }));

    useEffect(()=>{
        console.log(items); // 확인용
        async function fetchUserInfo() {
            if(token) {
                try {
                    const response = await axios.get(`${serverIp}/api/user`, {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    setShippingInfo({
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!items) {
        return <div>상품 정보를 찾을 수 없습니다.</div>;
    }

    // 장바구니 비우기
    const handleClearCart = () => {
        const userSeq = localStorage.getItem('userSeq');
        if (!userSeq) return;
        
        try {
            // 로컬스토리지에서 장바구니 삭제
            const cartKey = `cart_${userSeq}`;
            localStorage.removeItem(cartKey);
        } catch (error) {
            console.error('장바구니 비우기 실패:', error);
            alert('장바구니 비우기에 실패했습니다.');
        }
    };

    const handlePurchase = () => {
        // 배송비 3000원을 포함한 총 결제 금액
        const totalAmountWithShipping = totalAmount + 3000;
        
        handlePayment(userId, userBuyDetailDTOs, totalAmountWithShipping, serverIp, navigate)
            .then(success => {
                if (success) {
                    // 결제 성공 시에만 장바구니 비우기
                    const cartKey = `cart_${userSeq}`;
                    localStorage.removeItem(cartKey);
                }
            })
            .catch(error => {
                console.error('결제 실패:', error);
            });
    };

    

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
        if (data.bname !== '') {
            extraAddress += data.bname;
        }
        if (data.buildingName !== '') {
            extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    return (
        <div className="purchase-container">
            <h2>주문서</h2>
            <div className="purchase-info">
                {items.length > 0 ? (
                    <>
                    {/* <table className="purchase-table">
                        <thead>
                            <tr>
                                <th>상품 사진</th>
                                <th>상품명</th>
                                <th>수량</th>
                                <th>가격</th>
                            </tr>
                        </thead>
                        <tbody>
                        { items.map((item) => (
                            <tr key = {item.stockSeq}>
                                <td>
                                    <div className='cart-purchase-image-container'>
                                        <img src={item.imageUrl} alt={item.productName} className='cart-purchase-image' />
                                    </div>
                                </td>
                                <td>{item.productName}</td>
                                <td>{item.quantity}개</td>
                                <td>{item.price.toLocaleString()}원</td>
                                
                        </tr>
                        ))

                        }
                        </tbody>
                    </table> */}
                    <PurchaseList items = {items}/>
                    <div className='summary-container'>
                        <div className='cart-purchase-summary'>
                            <div className="summary-item">
                                <span className="item-label">총 상품가격</span>
                                <span className="item-value">{totalAmount.toLocaleString()}원</span>
                            </div>
                            <div className="summary-item">
                                <span className="item-label">배송비</span>
                                <span className="item-value">3,000원</span>
                            </div>
                            <div className="summary-item">
                                <span className="item-label">총 주문 상품 수</span>
                                <span className="item-value">{items.length}종 {totalQuantity}개</span>
                            </div>
                            <div className="summary-total">
                                <span className="total-label">총 결제 금액</span>
                                <span className="total-value">{(totalAmount+3000).toLocaleString()}원</span>
                            </div>
                        </div>
                        <div className='cart-purchase-address'>
                            <div className="address-header">배송 정보</div>
                            <div className="address-item">
                                <label className="item-label">받는 사람</label>
                                <input type = 'text' className="item-value" name="name" value={shippingInfo.name} onChange={handleInputChange}/>
                            </div>
                            <div className="address-item">
                                <label className="item-label">연락처</label>
                                <input type = 'tel' className="item-value" name="phone" value={shippingInfo.phone} onChange={handleInputChange}/>
                            </div>
                            <div className="address-item">
                                <label className="item-label">주소</label>
                                <input type = 'textarea' className="item-value" name="address" value={shippingInfo.address} onChange={handleInputChange}/>
                                {/* <button onClick={handleClick}>주소</button> */}
                            </div>
                        </div>
                    </div>
                    <div className="purchase-form">
                        
                        {/* <div className="total-price">
                            <h4>총 결제 금액:</h4>
                            <p>{(item.price * quantity).toLocaleString()}원</p>
                        </div> */}

                        <div className="cart-purchase-buttons">
                            <button className="cancel-btn" onClick={() => navigate(-1)}>
                                취소
                            </button>
                            <button className="purchase-btn" onClick={handlePurchase}>
                                구매하기
                            </button>
                        </div>
                    </div>
                    </>
                ) : (
                    <div className='empty-cart-purchase'>
                        <p>구매할 상품이 존재하지 않습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPurchase; 