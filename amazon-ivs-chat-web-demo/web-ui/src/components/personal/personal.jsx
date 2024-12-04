import React, { useEffect, useState } from "react";
import "./Personal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const serverIp = process.env.REACT_APP_SERVER_IP;

const Personal = () => {
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState("");
  const [review, setReview] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [farmerInfo, setFarmerInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_seq);
        fetchFarmerInfo(payload.user_seq); // 회원정보 조회
      } catch (error) {
        console.error("토큰 파싱 실패:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (userId) {
      fetchFarmerInfo(userId);
      fetchReview(userId);
    }
  }, [userId]);

  const fetchFarmerInfo = async (userId) => {
    try {
      const response = await axios.get(
        `${serverIp}/myPage/farmer/list/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFarmerInfo(response.data);
    } catch (error) {
      console.error("회원 정보 조회 실패:", error);
    }
  };

  const fetchReview = async (userId) => {
    try {
      const response = await axios.get(
        `${serverIp}/myPage/farmer/review/List/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReview(response.data);
    } catch (error) {
      console.error("리뷰 조회 실패:", error);
    }
  };

  return (
    <div className="personal-page">
    {/* 상단 한 줄 컨테이너 */}
    <div className="top-container">
      <div className="profile-container">
        <div className="profile-image">
          <div className="image-preview-container1">
            {farmerInfo && farmerInfo.path && (
              <img
                src={farmerInfo.path}
                alt="Profile"
                className="profile-image"
              />
            )}
          </div>
        </div>
        <div className="profile-details">
          {farmerInfo && (
            <>
              <h1 className="seller-name">{farmerInfo.name}</h1>
              <p className="seller-description">{farmerInfo.intro}</p>
            </>
          )}
        </div>
      </div>

      <button className="like-button">구독</button>
    </div>
  
      {/* 하단 3칸 컨테이너 */}
      <div className="bottom-container">
        <div className="item-container1">
          <h2 className="item-title">판매자 리뷰</h2>
          {review.length > 0 ? (
            <div className="review-list">
              {review.map((review) => (
                <div key={review.reviewCommentSeq} className="review-item">
                  <div className="review-header">
                    <span className="review-score">평점: {review.score}점</span>
                    <span className="review-date">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="review-content">{review.content}</div>
                  <div className="review-image">
                    {review.file && review.file.path && (
                      <img src={review.file.path} alt="리뷰 이미지" />
                    )}
                  </div>
                  <span className="review-date">
                    작성날짜 : {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data-notification">작성한 리뷰가 없습니다.</div>
          )}
        </div>

        <div className="item-container1">
          <h2 className="item-title">판매중인 상품</h2>
        </div>

        <div className="item-container1">
          <h2 className="item-title">진행중인 방송</h2>
        </div>
      </div>
    </div>
  );
};

export default Personal;
