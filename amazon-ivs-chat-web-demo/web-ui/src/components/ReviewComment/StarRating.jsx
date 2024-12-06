import React from 'react';
import './ReviewComment.css';

const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const stars = Array(5).fill(0);
  
  const handleClick = (index) => {
    if (!readonly) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="star-rating">
      {stars.map((_, index) => (
        <span 
          key={index} 
          className={`star ${index < rating ? 'filled' : 'empty'} ${readonly ? 'readonly' : 'clickable'}`}
          onClick={() => handleClick(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating; 