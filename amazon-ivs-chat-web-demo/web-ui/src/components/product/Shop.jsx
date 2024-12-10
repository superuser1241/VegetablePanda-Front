import React, { useEffect, useState } from 'react';
import ProductCard from "./ProductCard";
import './Shop.css';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

const Shop = () => {
  const [shopItems, setShopItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [visibleItems, setVisibleItems] = useState(5);
  const [search, setSearch] = useState('');
  const [word, setWord] = useState('');
  const serverIp = process.env.REACT_APP_SERVER_IP;

  const showMoreItems = () => {
    setVisibleItems((prev) => prev + 5 * 1);
  };

  const isAllItemsVisible = visibleItems >= shopItems.length;

  useEffect(() => {
    const fetchShopItems = async () => {
        try {
            const response = await axios.get(`${serverIp}/api/shop`);
            setShopItems(response.data);
        } catch (err) {
            console.error('상품 목록을 불러오는데 실패했습니다:', err);
        }
    };

    fetchShopItems();
    console.log(shopItems);
}, []);

// const getFilterData = (products) => {
//     if(search === '') return shopItems;
//     const searchedVegetables = shopItems.filter((item)=>item.productName.toLowerCase().includes(search.toLowerCase()));
//     return searchedVegetables;
// }

// const filteredProducts = selectedCategory === "전체" 
//     ? shopItems 
//     : shopItems.filter((item) => item.productCategoryContent === selectedCategory);

    const getFilteredProducts = () => {
      return shopItems
            .filter(item => {
                // 카테고리 필터링
                if (selectedCategory !== "전체") {
                    return item.productCategoryContent === selectedCategory;
                }
                return true;  // "전체" 카테고리인 경우 모든 아이템 통과
            })
            .filter(item => {
                // 검색어 필터링
                if (search) {
                    return item.productName.toLowerCase().includes(search.toLowerCase());
                }
                return true;  // 검색어가 없는 경우 모든 아이템 통과
            });
    };


    const filteredVegetables = getFilteredProducts();

    const handleWord = (e) => {
      setWord(e.target.value);
    }

    const handleSearch = (e) => {
      if(e.key === "Enter") {
        setSearch(e.target.value);
      }
    }



    return (
        <div>
          <hr />
            {/* 카테고리 버튼 */}
            <div className='category-search-container'>
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
              <div className='category-search-container'>
                <div className="search-input-wrapper">
                    <input type="text" className='search-text' placeholder='   검색어를 입력하세요' value={word} onChange={handleWord} onKeyUp={handleSearch}/>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon"/>
                </div>
              </div>
            </div>
            {/* 상품 목록 */}
            <div className="product-list">
              {filteredVegetables.slice(0, visibleItems).map((item) => (
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