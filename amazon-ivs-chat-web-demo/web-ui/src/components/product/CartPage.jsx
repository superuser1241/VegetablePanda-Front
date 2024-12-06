import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    // 사용자 정보 가져오기
    const getUserSeq = () => {
        const token = localStorage.getItem('token');
        const userSeq = localStorage.getItem('userSeq');
        
        if (!token || !userSeq) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return null;
        }
        return userSeq;
    };

    // 장바구니 목록 조회
    const fetchCartItems = async () => {
        const userSeq = getUserSeq();
        if (!userSeq) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${serverIp}/api/cart`, {
                params: { userSeq },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            });
            setCartItems(response.data);
            calculateTotal(response.data);
        } catch (error) {
            console.error('장바구니 조회 실패:', error);
            if (error.response?.status === 401) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/login');
            }
        }
    };

    // 총액 계산
    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalAmount(total);
    };

    // 수량 변경
    const handleQuantityChange = async (stockSeq, quantity) => {
        const userSeq = getUserSeq();
        if (!userSeq) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${serverIp}/api/cart/${stockSeq}`, null, {
                params: { 
                    quantity,
                    userSeq
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            });
            fetchCartItems();
        } catch (error) {
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert('수량 변경에 실패했습니다.');
            }
        }
    };

    // 개별 상품 삭제
    const handleRemoveItem = async (stockSeq) => {
        const userSeq = getUserSeq();
        if (!userSeq) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${serverIp}/api/cart/${stockSeq}`, {
                params: { userSeq },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            });
            fetchCartItems();
        } catch (error) {
            alert('상품 삭제에 실패했습니다.');
        }
    };

    // 장바구니 비우기
    const handleClearCart = async () => {
        const userSeq = getUserSeq();
        if (!userSeq) return;

        if (window.confirm('장바구니를 비우시겠습니까?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${serverIp}/api/cart`, {
                    params: { userSeq },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                });
                fetchCartItems();
            } catch (error) {
                alert('장바구니 비우기에 실패했습니다.');
            }
        }
    };

    // 전체 상품 구매
    const handlePurchaseAll = () => {
        const userSeq = getUserSeq();
        if (!userSeq) return;

        if (cartItems.length === 0) {
            alert('장바구니가 비어있습니다.');
            return;
        }
        // navigate('/payment', { 
        navigate('/cart-purchase', { 
            state: { 
                items: cartItems, 
                totalAmount,
                userSeq 
            } 
        });
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <div className="cart-page">
            <div className="cart-banner">
                <h1>장바구니</h1>
                <p>고객님이 선택하신 상품 목록입니다.</p>
            </div>

            <div className="cart-container">
                {cartItems.length > 0 ? (
                    <>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>상품 사진</th>
                                    <th>상품명</th>
                                    <th>가격</th>
                                    <th>수량</th>
                                    <th>합계</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.stockSeq}>
                                        <td>
                                            <div>
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.productName} 
                                                className="cart-item-image"
                                            />
                                            </div>
                                        </td>
                                        <td>{item.productName}</td>
                                        <td>{item.price.toLocaleString()}원</td>
                                        <td>
                                            <div className="quantity-control">
                                                <button 
                                                    onClick={() => handleQuantityChange(item.stockSeq, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleQuantityChange(item.stockSeq, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td>{(item.price * item.quantity).toLocaleString()}원</td>
                                        <td>
                                            <button 
                                                onClick={() => handleRemoveItem(item.stockSeq)}
                                                className="remove-button"
                                            >
                                                삭제
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="cart-summary">
                            <div className="total-amount">
                                총 결제금액: <span>{totalAmount.toLocaleString()}원</span>
                            </div>
                            <div className="cart-buttons">
                                <button 
                                    onClick={handleClearCart}
                                    className="clear-button"
                                >
                                    장바구니 비우기
                                </button>
                                <button 
                                    onClick={handlePurchaseAll}
                                    className="purchase-button"
                                >
                                    전체 상품 주문하기
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-cart">
                        <p>장바구니가 비어있습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;