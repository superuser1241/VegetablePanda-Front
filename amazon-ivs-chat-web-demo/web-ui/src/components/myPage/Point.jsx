import axios from 'axios';
import React, { useState } from 'react';
import * as ChargePoint from "./ChargePoint.jsx";

const Point = ({userId, point, fetchPoint}) => {
  const [chargeAmount, setChargeAmount] = useState("");
  const token = localStorage.getItem("token");


  const handleCharge = async () => {
    try {
      if (!userId || !chargeAmount) {
        alert("충전할 금액을 입력해주세요.");
        return;
      }

      // 충전금액 및 주문정보 등록
      const response = await axios.post(
        "http://localhost:9001/charge",
        {
          managementUserSeq: parseInt(userId),
          price: parseInt(chargeAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 주문번호 받아오기
      const response2 = await axios.get(
        "http://localhost:9001/api/payment/" + response.data + '?status=1',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 결제창 호출
      let IMP = window.IMP;
      IMP.init("imp68111618");
      const response4 = ChargePoint.requestPay(response2, token, IMP, fetchPoint, userId);

      // .then((result)=>{
      //     console.log(result.data);

      //     axios({
      //         // 주문번호 받아오기
      //         url: "http://localhost:9001/payment/" + result.data + "?status=1",
      //         method: "GET",
      //         headers: {
      //             Authorization: `Bearer ${token}`,
      //             "Content-Type": "application/json",
      //         },
      //     })
      //     .then((result)=>{
      //         // 결제에 필요한 정보
      //         console.log(result.data);
      //         // 결제창 호출
      //         let IMP = window.IMP;
      //         IMP.init("imp68111618");
      //         ChargePoint.requestPay(result, token, IMP);
      //     })
      //     .catch((err)=>{
      //         console.log(err);
      //     })
      // });

      if (response) {
        console.log("if response 받는 구문");
        console.log(response4);
        setChargeAmount("");
      }
    } catch (error) {
      console.log("포인트 충전 실패:", error);
      alert("포인트 충전에 실패했습니다.");
    }
  };

    return (
        <div>
            <div className="point-section">
              <h3>포인트 충전</h3>
              <div className="point-info">
                <p>현재 보유 포인트: {point.toLocaleString()}P</p>
              </div>
              <div className="charge-input-group">
                <input
                  type="number"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  placeholder="충전할 금액을 입력하세요"
                  className="charge-input"
                />
                <button onClick={handleCharge} className="charge-button">
                  충전하기
                </button>
              </div>
            </div>
        </div>
    );
};

export default Point;