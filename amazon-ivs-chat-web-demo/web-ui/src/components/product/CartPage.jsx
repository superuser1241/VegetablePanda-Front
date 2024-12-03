import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './CartPage.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    // 장바구니 목록 조회
    const fetchCartItems = async () => {
        try {
            const response = await axios.get('/api/cart');
            setCartItems(response.data);
            calculateTotal(response.data);
        } catch (error) {
            console.error('장바구니 조회 실패:', error);
        }
    };

    // 총액 계산
    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalAmount(total);
    };

    // 수량 변경
    const handleQuantityChange = async (stockSeq, quantity) => {
        try {
            await axios.put(`/api/cart/${stockSeq}`, null, {
                params: { quantity }
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
        try {
            await axios.delete(`/api/cart/${stockSeq}`);
            fetchCartItems();
        } catch (error) {
            alert('상품 삭제에 실패했습니다.');
        }
    };

    // 장바구니 비우기
    const handleClearCart = async () => {
        if (window.confirm('장바구니를 비우시겠습니까?')) {
            try {
                await axios.delete('/api/cart');
                fetchCartItems();
            } catch (error) {
                alert('장바구니 비우기에 실패했습니���.');
            }
        }
    };

    // 전체 상품 구매
    const handlePurchaseAll = () => {
        if (cartItems.length === 0) {
            alert('장바구니가 비어있습니다.');
            return;
        }
        navigate('/payment', { state: { items: cartItems, totalAmount } });
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
                                    <th>상품 이미지</th>
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
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.productName} 
                                                className="cart-item-image"
                                            />
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