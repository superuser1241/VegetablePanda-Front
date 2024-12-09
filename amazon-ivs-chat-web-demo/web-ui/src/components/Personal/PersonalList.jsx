import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../image/기본이미지.png";
import "./PersonalList.css";

const PersonalList = () => {
  const token = localStorage.getItem("token");
  const [farmer, setFarmer] = useState([]);
  const navigate = useNavigate();
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const fetchFarmers = async () => {
    try {
      const response = await axios.get(`${serverIp}/farmer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFarmer(response.data);
    } catch (error) {
      console.error("판매자 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFarmers();
    }
  }, [token]);

  const handleCardClick = (farmerSeq) => {
    navigate(`/personal`, { state: { farmerSeq } });
  };

  return (
    <div className="yun-farmer-list-page">
      <h1 className="yun-class">판매자 목록</h1>
      <div className="yun-farmer-list">
        {farmer.map((farmer) => (
          <div
            className="yun-farmer-card"
            key={farmer.userSeq}
            onClick={() => handleCardClick(farmer.userSeq)}
          >
            <img
              className="yun-image-preview-container"
              src={farmer.path || logo}
              alt={farmer.path}
            />

            <div className="yun-farmer-info">
              <h2 className="yun-farmer-name">{farmer.name}</h2>
              <p className="yun-farmer-intro yun-text-ellipsis">{farmer.intro}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalList;
