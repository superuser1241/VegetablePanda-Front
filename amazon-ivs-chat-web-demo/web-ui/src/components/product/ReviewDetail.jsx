import React, { useState } from "react";
import "./ReviewDetail.css"; // CSS 파일 import

const ReviewDetail = ({ reviews }) => {

    const formatDate = (isoDate) => isoDate.slice(0, 10); // 앞 10자리만 추출
    const [expandedIndex, setExpandedIndex] = useState(null); // 클릭된 카드 상태

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index); // 클릭 시 토글
      };

    // HTML 태그 제거 함수
    const stripHTML = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

  return (
    <div className="review-detail-container">
      {reviews.map((review, index) => (
        <div key={index} className="review-item" onClick={() => toggleExpand(index)}>
          <div className="review-header">
            <img
              src={review.profilePath}
              alt={`${review.name} profile`}
              className="review-user-photo"
            />
            <div className="review-user-info">
              <span className="review-user-id">{review.name}</span>
              <span className="review-date">{formatDate(review.regDate)}</span>
            </div>
            <div className="review-stars">{"★".repeat(review.score)}</div>
          </div>
          <div className="content-image-container">
          <p className="review-content">{stripHTML(review.content)}</p>
          {expandedIndex !== index && review.path && (
            <img
              src={review.path}
              alt="Review attachment"
              className="review-image"
            />
          )}
          </div>
          {expandedIndex === index && review.path && ( // 확장된 상태에서만 이미지 표시
              <img
                src={review.path}
                alt="Review attachment"
                className="review-image-expanded"
              />
            )}
        </div>
      ))}
    </div>
  );
};

export default ReviewDetail;
