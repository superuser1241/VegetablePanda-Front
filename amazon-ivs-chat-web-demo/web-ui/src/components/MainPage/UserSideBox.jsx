import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserSideBox.css';
import { Link } from 'react-router-dom';

const UserSideBox = ({ userName }) => {
    const [recentProducts, setRecentProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isOverBanner, setIsOverBanner] = useState(false);
    const serverIp = process.env.REACT_APP_SERVER_IP;

    useEffect(() => {
        const token = localStorage.getItem("token");
        const seq = localStorage.getItem("userSeq");
        const fetchRecentProducts = async () => {
            try {
                const response = await axios.post(`${serverIp}/recommend/${seq}`, null, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecentProducts(response.data); // 전체 상품 데이터 저장
            } catch (error) {
                console.error('추천 상품 로딩 실패:', error);
            }
        };

        const handleScroll = () => {
            const bannerHeight = 200; // 배너의 실제 높이로 조정하세요
            const scrollPosition = window.scrollY;
            setIsOverBanner(scrollPosition > bannerHeight);
        };

        window.addEventListener('scroll', handleScroll);
        fetchRecentProducts();
    }, []);

    const productsPerPage = 3;
    const pageCount = Math.ceil(recentProducts.length / productsPerPage);
    const currentProducts = recentProducts.slice(
        currentPage * productsPerPage,
        (currentPage + 1) * productsPerPage
    );

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(pageCount - 1, prev + 1));
    };

    return (
        <div className={`user-side-box ${isOverBanner ? '' : 'transparent'}`}>
            <div className="recent-products">
                <h4>추천 상품</h4>
                {currentProducts.map((product) => (
                    <Link 
                        to={`/product/${product.stockSeq}`} 
                        key={product.stockSeq}
                        className="product-item"
                    >
                        <img 
                            src={product.file || 'https://placehold.co/100x100?text=NoImage'} 
                            alt={product.productName} 
                        />
                        <div className="product-info">
                            <p className="product-name">{product.productName}</p>
                            <p className="product-price">{product.price.toLocaleString()}원</p>
                        </div>
                    </Link>
                ))}
                <div className="pagination-buttons">
                    <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 0}
                        className="page-button"
                    >
                        이전
                    </button>
                    <button 
                        onClick={handleNextPage} 
                        disabled={currentPage >= pageCount - 1}
                        className="page-button"
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSideBox; 