import React from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';

const ProductCard = ({product}) => {

const DEFAULT_IMAGE = "https://via.placeholder.com/150"; // 기본 이미지 경로
const productImage = product.file && product.file.trim() !== "" ? product.file : DEFAULT_IMAGE;

    return (
        <div>
            <div className="product-card">
                <Link to = {`/product/{${product.stockSeq}}`} state={{ product }} className='default-link product-name'>
                <img src= {product.file ? product.file : 'https://placehold.co/200x200?text=vegetable'} alt={product.productName} />
                <h2>{product.content}</h2>
                <p className='product-price'>가격: {product.price}</p>
                <p className='product-count'>수량: {product.count}</p>
                <p className='product-grade'>등급: {product.stockGrade}</p>
                <button>구매하기</button>
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;