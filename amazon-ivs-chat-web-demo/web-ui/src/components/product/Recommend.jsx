import React from 'react';
import './Recommend.css';
import { useParams } from 'react-router-dom';

const Recommend = () => {

    const { stockSeq } = useParams();

    return (
        <div>
            {/* 상품 이미지 */}
            <div className="product-image">
                <img
                src = {'https://placehold.co/200x200?text=vegetable'}
                alt = {`대체텍스트`}
                />
            </div>

            {/* 상품 정보 */}
            <div className="product-info">
                <h1>text</h1>
                <hr/>
                <div className='product-specs'>
                    <div className='spec-item'>
                        <span className='spec-label'>상품번호 </span>
                        <span className='spec-value'>text</span>
                    </div>
                    <div className='spec-item'>
                        <span className='spec-label'>카테고리 </span>
                        <span className='spec-value'>text</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-label">등급</span>
                        <span className="spec-value">text</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-label">인증</span>
                        <span className="spec-value">dd</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-label">재고</span>
                        <span className="spec-value">90개</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-label">판매가격</span>
                        <span className="spec-value">9000원</span>
                    </div>    
                    <div className="spec-item">
                        <span className="spec-label">배송비</span>
                        <span className="spec-value">3,000원</span>
                    </div>    
                </div>
                <div className="purchase-section">
                    <div className="quantity-selector">
                        <label>구매 수량</label>
                        <div className="quantity-input-group">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommend;