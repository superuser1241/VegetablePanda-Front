import React, { useEffect, useState } from 'react';
import ProductCard from "./ProductCard";
import './Shop.css';
import axios from 'axios';

const Shop = () => {
  const [shopItems, setShopItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [visibleItems, setVisibleItems] = useState(15);

  const showMoreItems = () => {
    setVisibleItems((prev) => prev + 5 * 3);
  };

  const isAllItemsVisible = visibleItems >= shopItems.length;

  useEffect(() => {
    const fetchShopItems = async () => {
        try {
            const response = await axios.get('http://localhost:9001/api/shop');
            setShopItems(response.data);
        } catch (err) {
            console.error('상품 목록을 불러오는데 실패했습니다:', err);
        }
    };

    fetchShopItems();
    console.log(shopItems);
}, []);

const filteredProducts = selectedCategory === "전체" 
    ? shopItems 
    : shopItems.filter((item) => item.productCategoryContent === selectedCategory);

    return (
        <div>
          <hr />
            {/* 카테고리 버튼 */}
            <div className="category-buttons">
              {["전체", "식량작물", "엽채류", "과채류", "근채류", "양채류", "과수", "기타작물"].map((category) => (
                <button
                  key={category}
                  className={`category-button ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            {/* 상품 목록 */}
            <div className="product-list">
              {shopItems.slice(0, visibleItems).map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>

            {/* 더보기 버튼 */}
            {!isAllItemsVisible && (
              <div className="load-more">
                <button onClick={showMoreItems}>더보기</button>
              </div>
            )}
        </div>
    );
};

export default Shop;