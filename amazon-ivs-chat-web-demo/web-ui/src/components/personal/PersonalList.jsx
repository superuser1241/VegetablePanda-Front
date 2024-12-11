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

  // 페이징 관련 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const farmersPerPage = 10;

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

  // 현재 페이지의 판매자 목록 계산
  const indexOfLastFarmer = currentPage * farmersPerPage;
  const indexOfFirstFarmer = indexOfLastFarmer - farmersPerPage;
  const currentFarmers = farmer.slice(indexOfFirstFarmer, indexOfLastFarmer);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(farmer.length / farmersPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="yun-farmer-list-page">
      <h1 className="yun-class">판매자 목록</h1>
      <div className="yun-farmer-list">
        {currentFarmers.map((farmer, index) => (
          <div
            className={`yun-farmer-card ${
              currentPage === 1 && index < 4 ? `yun-rank-${index + 1}` : ""
            }`}

            key={farmer.userSeq}
            onClick={() => handleCardClick(farmer.userSeq)}
          >
            {currentPage === 1 && index < 4 && (

              <div className="yun-rank-badge">
                {index + 1+"등"}
              </div>
            )}
            <img
              className="yun-image-preview-container"
              src={farmer.path || logo}
              alt={farmer.path}
            />
            <div className="yun-farmer-info">
              <h2 className="yun-farmer-name">{farmer.name}</h2>
              <p className="yun-farmer-intro yun-text-ellipsis">
                {farmer.intro}
              </p>

            </div>
          </div>
        ))}
      </div>
      <div className="yun-pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`yun-page-button ${
              currentPage === pageNum ? "active" : ""
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonalList;
