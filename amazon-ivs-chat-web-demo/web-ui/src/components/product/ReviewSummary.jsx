import React from 'react';
import "./ReviewSummary.css"; // CSS 파일 import

const ReviewSummary = ({ averageRating, totalReviews }) => {
    const roundedRating = Math.round(averageRating);
    const hasNoReviews = !averageRating && !totalReviews;

    return (
    <div className="review-container">
        {hasNoReviews ? (
        <p className="no-reviews-message">상품에 대한 후기가 없습니다</p>
      ) : (
        <>
      <div className="review-box">
        <p className="review-title">사용자 총 평점</p>
        <div className="review-rating">
          <span className="review-stars">{"★".repeat(roundedRating)}</span>
        </div>
        <p className="review-score">{averageRating.toFixed(2)}/5</p>
      </div>
      <div className="review-box">
        <p className="review-title">전체 리뷰수</p>
        <p className="review-total">{totalReviews}</p>
      </div>
      </>
      )}
    </div>
    );
};

export default ReviewSummary;