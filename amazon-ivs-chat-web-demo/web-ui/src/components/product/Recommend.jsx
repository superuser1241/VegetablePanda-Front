import React from 'react';
import './Recommend.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Recommend = () => {
    const navigate = useNavigate();
    const { stockSeq } = useParams();
    const serverIp = process.env.REACT_APP_SERVER_IP;

    const fetchProductInfo = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                `${serverIp}/api/insertShopLike`,
                {
                    
                },
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            console.log(response.data.state);

            if(response.data.state===true) {
                console.log('상품 정보 가져오기 성공.');
            } else {
                console.log('상품 정보 가져오기 실패.');

            }

        } catch (err) {
            console.error('상품 정보를 가져오지 못하였습니다 :', err);
        }
    }

    const movePage = () => {
        
    }

    return (
        <div>

            <div className='product-container'>
                <div className='product-category'>
                    
                </div>
                <div className="product-details">

                    {/* 상품 이미지 */}
                    <div className="product-image">
                        <img
                        src = {'https://placehold.co/200x200?text=vegetable'}
                        alt = {`대체텍스트`}
                        />
                    </div>

                    {/* 상품 정보 */}
                    <div className="product-info">
                        <h1>stockSeq로 가져온 상품명</h1>
                        <hr/>
                        <div className='product-specs'>
                            <div className='spec-item'>
                                <span className='spec-label'>경매상태 </span>
                                <span className='spec-value'>경매 상태 표기</span>
                            </div>
                            <div className='spec-item'>
                                <span className='spec-label'>일반상점 상태 표기 </span>
                                <span className='spec-value'>text</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">가격</span>
                                <span className="spec-value">경매중인 상품이면 가격 표기x</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">재고</span>
                                <span className="spec-value">90개</span>
                            </div>
                        </div>
                        <button className="product-buy-button" onClick={movePage}>이동</button>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Recommend;