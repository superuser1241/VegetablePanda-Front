import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const serverIp = process.env.REACT_APP_SERVER_IP;

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();
    const userSeq = localStorage.getItem('userSeq');

    useEffect(() => {
        if (!userSeq) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }
        loadCartItems();
    }, [userSeq, navigate]);

    const loadCartItems = () => {
        const cartKey = `cart_${userSeq}`;
        const savedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
        setCartItems(savedCart);
        calculateTotal(savedCart);
    };

    const handleRemoveItem = (stockSeq) => {
        const cartKey = `cart_${userSeq}`;
        const updatedCart = cartItems.filter(item => item.stockSeq !== stockSeq);
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        calculateTotal(updatedCart);
    };

    const handleQuantityChange = async (stockSeq, newQuantity) => {
        try {
            // 재고 확인
            await axios.get(`${serverIp}/api/cart/validate/${stockSeq}`, {
                params: { quantity: newQuantity }
            });

            const cartKey = `cart_${userSeq}`;
            const updatedCart = cartItems.map(item => 
                item.stockSeq === stockSeq 
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
            setCartItems(updatedCart);
            calculateTotal(updatedCart);

        } catch (error) {
            alert(error.response?.data?.error || '수량 변경에 실패했습니다.');
        }
    };

    const handleClearCart = () => {
        const cartKey = `cart_${userSeq}`;
        localStorage.removeItem(cartKey);
        setCartItems([]);
        setTotalAmount(0);
    };

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalAmount(total);
    };

    const handlePurchaseAll = () => {
        if (cartItems.length === 0) {
            alert('장바구니가 비어있습니다.');
            return;
        }

        navigate('/cart-purchase', { 
            state: { 
                items: cartItems,
                totalAmount: totalAmount
            } 
        });
    };

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