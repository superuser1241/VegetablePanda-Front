import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLikedShops = () => {
    const [likedShops, setLikedShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const serverIp = process.env.REACT_APP_SERVER_IP;
    const userSeq = localStorage.getItem('userSeq');

    useEffect(() => {
        const fetchLikedShops = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${serverIp}/api/likes?userSeq=${userSeq}`);
                setLikedShops(response.data);
            } catch (err) {
                console.error('찜한 상품 조회 실패:', err);
                setError('찜한 상품을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (userSeq) {
            fetchLikedShops();
        }
    }, [userSeq]);

    const handleShopClick = (shop) => {
        navigate(`/product/${shop.stockSeq}`, { 
            state: { 
                product: {
                    stockSeq: shop.stockSeq,
                    productName: shop.productName,
                    productCategoryContent: shop.productCategoryContent,
                    price: shop.price,
                    content: shop.content,
                    count: shop.count,
                    stockGrade: shop.stockGrade,
                    stockOrganic: shop.stockOrganic,
                    file: shop.file,
                    shopSeq: shop.shopSeq,
                    liked: true
                }
            }
        });
    };

    if (loading) return <div className="userMyPage-loading">로딩 중...</div>;
    if (error) return <div className="userMyPage-error-message">{error}</div>;
    if (likedShops.length === 0) {
        return <div className="no-data-notification">찜한 상품이 없습니다.</div>;
    }

    return (
        <div className="userMyPage-main-content">
            <h3 className="userMyPage-title">찜한 상품 목록</h3>
            <div className="userMyPage-card-container">
                {likedShops.map((shop) => (
                    <div 
                        key={shop.shopSeq} 
                        className="userMyPage-card"
                        onClick={() => handleShopClick(shop)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img 
                            src={shop.imagePath} 
                            alt={shop.productName} 
                            className="userMyPage-card-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '../../image/기본이미지.png';
                            }}
                        />
                        <div className="userMyPage-card-info">
                            <div className="userMyPage-card-name">{shop.productName}</div>
                            <div className="userMyPage-card-details">
                                <span className="userMyPage-card-grade">등급: {shop.stockGrade}</span>
                                <span className="userMyPage-card-count">수량: {shop.count}개</span>
                            </div>
                            <div className="userMyPage-card-price">
                                {shop.price.toLocaleString()}원
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserLikedShops; 