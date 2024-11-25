import React, { useEffect, useState } from 'react';
import './RegisterStock.css';
import axios from 'axios';

const RegisterStock = () => {
    const token = localStorage.getItem('token');

    const [userId, setUserId] = useState();

    const [newProduct, setNewProduct] = useState({
        color: '',
        count: '',
        status: 2,
        content: '',
        productSeq: '',
        stockGradeSeq: '',
        stockOrganicSeq: ''
    });

    const [productCategory, setProductCategory] = useState([]);
    const [products, setProducts] = useState([]);
    const [grade, setGrade] = useState([]);
    const [organic, setOrganic] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedOrganic, setSelectedOrganic] = useState('');
    const [selectedColor, setSelectedColor] = useState('#8f8f8f'); // 초기 색상

    const [uploadImg, setUploadImg] = useState("");

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

            setProducts(response.data);

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
        console.log(products);
    }

    // const changeProduct = (e) => {
    //     let value = e.target.value;
    //     console.log('선택된 상품:' + value);

    //     setSelectedProduct(value);
    // }

    // const changeGrade = (e) => {
    //     const value = e.target.value;
    //     console.log('선택된 등급:', value);
    //     setSelectedGrade(value);
    // };

    // const changeOrganic = (e) => {
    //     const value = e.target.value;
    //     console.log('선택된 유기농 분류:', value);
    //     setSelectedOrganic(value);
    // };

    const handleProductSubmit = async (e) => {
        if(!newProduct.color) return alert('색상을 선택해주세요.');
        if(!newProduct.count) return alert('수량을 입력해주세요.');
        if(!newProduct.content) return alert('내용을 입력해주세요.');
        
        try{
            e.preventDefault();

            // URL에 쿼리 파라미터 추가
            const url = `http://localhost:9001/stock?productSeq=${newProduct.productSeq}&stockGradeSeq=${newProduct.stockGradeSeq}&stockOrganicSeq=${newProduct.stockOrganicSeq}&farmerSeq=${userId}`;
            
            // body 데이터
            const stockData = {
                color: newProduct.color,
                count: parseInt(newProduct.count),
                content: newProduct.content,
            };

            const response = await axios.post(url, stockData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                alert('상품이 등록되었습니다. 관리자 승인 후 판매가 시작됩니다.');
                setNewProduct({
                    color: '',
                    count: '',
                    status: 2,
                    content: '',
                    productSeq: '',
                    stockGradeSeq: '',
                    stockOrganicSeq: ''
                });
                setSelectedCategory('');
                setSelectedColor('#8f8f8f');
            }
        } catch (error) {
            console.error('상품 등록 실패:', error);
            console.error('요청 URL:', error.config?.url);
            console.error('요청 데이터:', error.config?.data);
        }
    }

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const changeColor = (e) => {
        const color = e.target.selectedOptions[0].getAttribute('data-color');
        setSelectedColor(color);
        handleProductChange(e);
    };

    const handleImageChange = (e)=> {
        setUploadImg(e.target.files[0]);
   }

   // 이미지 업로드 메소드
   const handleUpload = async () => {
    if (!uploadImg) return alert("파일을 선택해주세요.");

    const formData = new FormData();
    formData.append("image", uploadImg);

    try {
        const response = await axios.post("http://localhost:9001/s3/upload", formData, {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        alert("업로드 성공: " + response.data);
    } catch (error) {
        console.error("업로드 실패:", error);
        alert("업로드 실패");
    }
  };



    return (
        <div className='RegisterStock'>
            <div className='product-section'>
                <h3>재고등록</h3>
                <form action="" onSubmit={handleProductSubmit}>
                    <div className='product-form'>
                        <div className='form-group'>
                            <label>상품 카테고리</label>
                            <select name="product-category" id="product-category" value = {selectedCategory} onChange={changeCategory}>
                                <option value="default">---</option>
                                {
                                    productCategory.map((item) => {
                                        return <option key = {item.productCategorySeq} id = {item.productCategorySeq} value = {item.productCategorySeq}>{item.content}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className='form-group'>
                            <label>상품 종류</label>
                            <select name="productSeq" id="productSeq" value={newProduct.productSeq} onChange={handleProductChange}>
                                <option value="default">---</option>
                                {
                                    products.map((item) => {
                                        return <option key={item.productSeq} value = {item.productSeq}>{item.productName}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className='form-group'>
                            <label>등급</label>
                            <select name="stockGradeSeq" id="stockGradeSeq" value = {newProduct.stockGradeSeq} onChange={handleProductChange}>
                                <option value="default">---</option>
                                {
                                    grade.map((item) => {
                                        return <option key={item.stockGradeSeq} value = {item.stockGradeSeq}>{item.grade}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className='form-group'>
                            <label>재배 방식</label>
                            <select name="stockOrganicSeq" id="stockOrganicSeq" value = {newProduct.stockOrganicSeq} onChange={handleProductChange}>
                                <option value="default">---</option>
                                {
                                    organic.map((item) => {
                                        return <option key = {item.stockOrganicSeq} value = {item.stockOrganicSeq}>{item.organicStatus}</option>
                                    })
                                }
                            </select>
                        </div>

                        <div className="form-group">
                            <label>색상 코드 <span className='colorBox'
                                style={{
                                    display: 'inline-block',
                                    justifyContent:'center',
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: selectedColor,
                                    border: '1px solid #ccc',
                                    borderRadius: '10px',
                                    marginLeft: '5px',
                                    verticalAlign: 'text-top',
                                }}
                            ></span></label>
                            
                            <select name="color" id={selectedColor} value = {newProduct.color} onChange={changeColor}>
                                <option value="default">---</option>
                                <option value="1" data-color = "#be2e22">빨간색</option>
                                <option value="2" data-color = "#ffa500">주황색</option>
                                <option value="3" data-color = "#7ec850">초록색</option>
                                <option value="4" data-color = "#9d4ccc">보라색</option>
                                <option value="5" data-color = "#ffffff">흰색</option>
                            </select>
                            
                        </div>
                        
                        <div className="form-group">
                            <label>수량</label>
                            <input
                                type="number"
                                name="count"
                                value={newProduct.count}
                                onChange={handleProductChange}
                                placeholder="수량 입력"
                            />
                        </div>
                        <div className="product-description">
                            <label>상품 설명</label>
                            <textarea
                                name="content"
                                value={newProduct.content}
                                onChange={handleProductChange}
                                placeholder="상품 설명 입력"
                            />
                        </div>
                        <div className="form-group">
                        <label>상품 사진 등록</label>
                            <input type = "file" accept = "image/*" onChange = {(e)=>{setUploadImg(e.target.files[0]);}}/>
                        </div>
                    
                    </div>
                    <div className='btn'>
                            <button type='submit' className='stock-submit-btn'>등록</button> 
                            <button type='reset' className='stock-reset-btn'>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterStock;