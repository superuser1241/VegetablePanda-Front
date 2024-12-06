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
                <p>{product.farmerName}</p>
                <h3>{product.productName}</h3>
                <p className='product-price'>{product.price.toLocaleString()}원</p>
                <hr />
                <p className='product-count'>수량 {product.count}</p>
                <p className='product-grade'>등급 {product.stockGrade}</p>
                
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;