import React, { useEffect, useState } from "react";
import "./Recommend.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Recommend = () => {
  const navigate = useNavigate();
  const { stockSeq } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const serverIp = process.env.REACT_APP_SERVER_IP;

  useEffect(() => {
    const fetchProductInfo = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          `${serverIp}/recommend/product/${stockSeq}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setData(response.data);
        } else {
          console.log("상품 정보 가져오기 실패.");
        }
      } catch (err) {
        console.error("상품 정보를 가져오지 못하였습니다 :", err);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchProductInfo();
  }, [serverIp, stockSeq]); // 의존성 배열에 serverIp와 stockSeq 추가

  const handleProductMove = () => {
    const fetchProduct = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.post(
            `${serverIp}/api/shopItems/${data.stockSeq}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data) {
            setData(response.data);
          } else {
            console.log("상품 정보 가져오기 실패.");
          }
        } catch (err) {
          console.error("상품 정보를 가져오지 못하였습니다 :", err);
        } 
      };
   

    if (data.status === 3) {
        
        
      // 상점 상품인 경우
      navigate(`/product/${data.stockSeq}`, { state: { product: fetchProduct } });
    } else if (data.status === 1) {
      // 경매 상품인 경우
      navigate(`/auction/${data.auctionSeq}`);
    }
  };

  // 로딩 중 처리
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 데이터가 없을 경우 처리
  if (!data) {
    return <div>상품 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div>
      <div className="product-container">
        <div className="product-category"></div>
        <div className="product-details">
          <div className="product-image">
            <img
              src={data.path || "https://placehold.co/200x200?text=NoImage"}
              alt={data.productName || "대체텍스트"}
            />
          </div>
          <div className="product-info">
            <h1>{data.productName}</h1>
            <hr />
            {data.status === 3 && (
              <div className="product-specs">
                <div className="spec-item">
                  <span className="spec-label">상품 상태</span>
                  <span className="spec-value">상점 상품</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">상품 등급</span>
                  <span className="spec-value">{data.stockGradeSeq}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">유기농 인증</span>
                  <span className="spec-value">{data.stockOrganicSeq}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">재고</span>
                  <span className="spec-value">{data.count}kg</span>
                </div>
                <button className="product-buy-button" onClick={handleProductMove}>
                  상점 이동
                </button>
              </div>
            )}
            {data.status === 1 && (
              <div className="product-specs">
                <div className="spec-item">
                  <span className="spec-label">상품 상태</span>
                  <span className="spec-value">경매 상품</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">상품 등급</span>
                  <span className="spec-value">{data.grade}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">유기농 인증</span>
                  <span className="spec-value">{data.organic}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">재고</span>
                  <span className="spec-value">{data.status}kg</span>
                </div>
                <button className="product-buy-button" onClick={handleProductMove}>
                  경매 이동
                </button>
              </div>
            )}
            {data.status === 0 && (
              <div className="product-specs">
                <div className="spec-item">
                  <span className="spec-label">상품 상태</span>
                  <span className="spec-value">경매대기 상품</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">상품 등급</span>
                  <span className="spec-value">{data.grade}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">유기농 인증</span>
                  <span className="spec-value">{data.organic}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">재고</span>
                  <span className="spec-value">{data.status}kg</span>
                </div>
                <button className="product-buy-button" >
                 경매 준비중입니다.
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommend;
