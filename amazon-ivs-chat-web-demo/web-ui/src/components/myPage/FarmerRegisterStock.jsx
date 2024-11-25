import React, { useEffect, useState } from 'react';
import './FarmerRegisterStock.css';
import axios from 'axios';
import SelectBox from './SelectBox';

const FarmerRegisterStock = () => {
    const token = localStorage.getItem('token');

    const [userId, setUserId] = useState();

    const [productCategory, setProductCategory] = useState([]);
    const [product, setProduct] = useState([]);
    const [grade, setGrade] = useState([]);
    const [organic, setOrganic] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedOrganic, setSelectedOrganic] = useState('');

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserId(payload.user_seq);
                console.log(userId);
            } catch (error) {
                console.error('토큰 파싱 실패:', error);
            }
        }
    }, [token]);

    useEffect(()=>{
        console.log("카테고리 가져오기");
        fetchProductCategory();
        console.log("카테고리 정보")
        console.log(productCategory)
        
        // fetchProductInfo();
        // console.log('상품 정보');
        // console.log(product);
        
        fetchStockGrade();
        console.log('등급 분류 정보');
        console.log(grade);
        
        fetchOrganic();
        console.log('유기농 분류 정보');
        console.log(organic);
        
    },[]);

    const fetchProductCategory = async () => {
        try {
            const response = await axios.get(`http://localhost:9001/productCategory`, {
                headers: { Authorization: `Bearer ${token}` }
            });
                        
            setProductCategory(response.data);

        } catch (error) {
            console.error('상품 카테고리 정보 조회 실패', error);
        }
    };

    const fetchProductInfo = async (categorySeq) => {
        try{
            const response = await axios.get(`http://localhost:9001/product/`+categorySeq, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProduct(response.data);

        } catch (error) {
            console.error('상품 정보 조회 실패', error);
        }
    }

    const fetchStockGrade = async () => {
        try{
            const response = await axios.get(`http://localhost:9001/stockGrade`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setGrade(response.data);

        } catch (error) {
            console.error('상품 등급 정보 조회 실패', error);
        }
    }

    const fetchOrganic = async () => {
        try{
            const response = await axios.get(`http://localhost:9001/stockOrganic`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOrganic(response.data);

        } catch (error) {
            console.error('상품 등급 정보 조회 실패', error);
        }
    }

    const changeCategory = (e) => {
        let value = e.target.value;
        console.log('선택된 값:' + value);

        setSelectedCategory(value);
        
        // 선택한 카테고리에 해당되는 상품 가져오기
        fetchProductInfo(value);
        console.log('해당되는 상품 목록');
        console.log(product);
    }

    const changeProduct = (e) => {
        let value = e.target.value;
        console.log('선택된 상품:' + value);

        setSelectedProduct(value);
    }

    const changeGrade = (e) => {
        const value = e.target.value;
        console.log('선택된 등급:', value);
        setSelectedGrade(value);
    };

    const changeOrganic = (e) => {
        const value = e.target.value;
        console.log('선택된 유기농 분류:', value);
        setSelectedOrganic(value);
    };

    const submitStock = async (e) => {
        e.preventDefault();

        const response = await axios.post(`http://localhost:9001/stock`, {
            productSeq : selectedProduct,
            stockGradeSeq : selectedGrade,
            stockOrganicSeq : selectedOrganic,
            farmerSeq : userId

        }, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
    }

    return (
        <div className='RegisterStock'>
            <h2>재고등록</h2>
            <p>등록하고자 하는 재고의 정보를 입력해주세요.</p>
            <form action="" onSubmit={submitStock}>
                    상품 카테고리 
                    {/* <SelectBox list = {productCategory} changeFn = {changeCategory}/> */}
                    <select name="product-category" id="product-category" onChange={changeCategory}>
                        <option value="default">---</option>
                        {
                            productCategory.map((item) => {
                                return <option key = {item.productCategorySeq} id = {item.productCategorySeq} value = {item.productCategorySeq}>{item.content}</option>
                            })
                        }
                    </select>

                    상품 정보 <select name="product" id="product" onChange={changeProduct}>
                        <option value="default">---</option>
                        {
                            product.map((item) => {
                                return <option key={item.productSeq} value = {item.productSeq}>{item.productName}</option>
                            })
                        }
                    </select>

                    등급 <select name="grade" id="grade" onChange={changeGrade}>
                        <option value="default">---</option>
                        {
                            grade.map((item) => {
                                return <option key={item.stockGradeSeq} value = {item.stockGradeSeq}>{item.grade}</option>
                            })
                        }
                    </select>
                    유기농 분류 <select name="organic" id="organic" onChange={changeOrganic}>
                        <option value="default">---</option>
                        {
                            organic.map((item) => {
                                return <option key = {item.stockOrganicSeq} value = {item.stockOrganicSeq}>{item.organicStatus}</option>
                            })
                        }
                    </select>

                    사진
                    내용 <input type='textarea'/>
                    개수 <input type='number'/>
                    색깔 <input type='color'/>

                    <hr />
                    <div className='btn'>
                        <button type='submit' className='stock-submit-btn'>등록</button> 
                        <button type='reset' className='stock-reset-btn'>취소</button>
                    </div>
            </form>
        </div>
    );
};

export default FarmerRegisterStock;