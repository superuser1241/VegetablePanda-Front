import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Test = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_seq);
      } catch (error) {
        console.error("토큰 파싱 실패:", error);
      }
    }
  }, [token]);

  // 주문 내역을 가져오는 함수
  const fetchOrderHistory = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:9001/myPage/buyList/${userId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setOrders(response.data);
    } catch (err) {
      setError("주문 내역을 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrderHistory(userId);
    }
  }, [userId]);

  const handleReviewWrite = (order) => {
    navigate('/review-comment/write', { 
      state: { 
        orderInfo: {
          userBuySeq: order.userBuySeq,
          content: order.content,
          price: order.price,
          buyDate: order.buyDate
        }
      }
    });
  };

  const getOrderStatus = (state) => {
    switch (state) {
      case 0:
        return "주문 접수";
      case 1:
        return "배송 준비중";
      case 2:
        return "배송중";
      case 3:
        return "배송 완료";
      default:
        return "상태 미정";
    }
  };

  return (
    <div className="order-history-display">
      <h3>주문 내역</h3>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>주문 번호</th>
              <th>상품명</th>
              <th>수량</th>
              <th>금액</th>
              <th>주문 일자</th>
              <th>주문 상태</th>
              <th>리뷰 작성</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.orderId}>
                <td>{index + 1}</td>
                <td>{order.userBuySeq}</td>
                <td>{order.content}</td>
                <td>{order.count}</td>
                <td>{order.price.toLocaleString()}원</td>
                <td>{new Date(order.buyDate).toLocaleDateString()}</td>
                <td>{getOrderStatus(order.state)}</td>
                <td>
                  <button
                    onClick={() => handleReviewWrite(order)}
                    className="review-write-button"
                  >
                    리뷰 작성
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-data-notification">
          주문 내역이 없습니다.
        </div>
      )}
    </div>
  );
};

export default Test;