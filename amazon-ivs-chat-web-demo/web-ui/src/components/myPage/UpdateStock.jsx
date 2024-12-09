import React, { useEffect, useRef, useState } from 'react';
import './UpdateStock.css';
import axios from 'axios';

const UpdateStock = ({stock, onBack}) => {
    const token = localStorage.getItem('token');

    const [userId, setUserId] = useState();

    const [newProduct, setNewProduct] = useState({
        color: stock.color,
        count: stock.count,
        status: 0,
        content: stock.content,
        productSeq: stock.productSeq,
        stockGradeSeq: '',
        stockOrganicSeq: '',
        file : {fileSeq: stock.fileSeq || '', name: stock.fileName || '', path: stock.filePath || ''},
        // 'Content-Type': 'multipart/form-data'
    });

    const [updateStock, setUpdateStock] = useState({
        stockSeq: 0,
        content: '',
        count: 0,
        color: '',
        productSeq: 0,
        stockGradeSeq: 0,
        stockOrganicSeq: 0,
        userSeq: 0,
        regDate: '',
        file: {fileSeq: 0, name: '', path: ''}
    });

    const [productCategory, setProductCategory] = useState([]);
    const [products, setProducts] = useState([]);
    const [grade, setGrade] = useState([]);
    const [organic, setOrganic] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedColor, setSelectedColor] = useState('#8f8f8f'); // 초기 색상

    const [image, setImage] = useState(null);

    const textarea = useRef();

    const serverIp = process.env.REACT_APP_SERVER_IP;

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                //setUserId(payload.user_seq);
                setUserId(localStorage.getItem('userSeq'));
                console.log("사용자 시퀀스 : ", userId);
                console.log("userSeq : ", localStorage.getItem('userSeq'));
            } catch (error) {
                console.error('토큰 파싱 실패:', error);
            }
        }
    }, [token]);

    useEffect(()=>{
        console.log("카테고리 가져오기");
        fetchProductCategory();
        console.log("카테고리 정보");
        console.log(productCategory);
        
        fetchStockGrade();
        console.log('등급 분류 정보');
        console.log(grade);
        
        fetchOrganic();
        console.log('유기농 분류 정보');
        console.log(organic);
        
        fetchStock();
        console.log("updateStock 정보");
        console.log(updateStock);

        const category = stock.productCategoryContent === '식량작물' ? 1
        : stock.productCategoryContent === '엽채류' ? 2
        : stock.productCategoryContent === '과채류' ? 3
        : stock.productCategoryContent === '근채류' ? 4
        : stock.productCategoryContent === '양채류' ? 5
        : stock.productCategoryContent === '과수' ? 6
        : stock.productCategoryContent === '기타작물' ? 7
        : 0;

        setSelectedCategory(category);
        fetchProductInfo(selectedCategory);
        // setUpdateStock(prev => ({
        //     ...prev,
        //     productSeq: stock.productSeq
        // }));

    },[]);

   
    const fetchStock = async () => {
        try {
            const response = await axios.get(`${serverIp}/stock/`+stock.stockSeq, {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        console.log("stockSeq로 stock정보 찾아오기");
        console.log(response.data);
        setUpdateStock({...response.data});

        } catch (error) {
            console.error('상품 정보 조회 실패', error);
        }
    }
    

    const fetchProductCategory = async () => {
        try {
            const response = await axios.get(`${serverIp}/category`, {
                headers: { Authorization: `Bearer ${token}` }
            });
                        
            setProductCategory(response.data);

        } catch (error) {
            console.error('상품 카테고리 정보 조회 실패', error);
        }
    };

    const fetchProductInfo = async (categorySeq) => {
        try{
            const response = await axios.get(`${serverIp}/product/`+categorySeq, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProducts(response.data);

        } catch (error) {
            console.error('상품 정보 조회 실패', error);
        }
    }

    const fetchStockGrade = async () => {
        try{
            const response = await axios.get(`${serverIp}/stockGrade`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setGrade(response.data);

        } catch (error) {
            console.error('상품 등급 정보 조회 실패', error);
        }
    }

    const fetchOrganic = async () => {
        try{
            const response = await axios.get(`${serverIp}/stockOrganic`, {
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

    const changeFileName = (e) => {
        const { name, value } = e.target;
        setUpdateStock(prev => ({
            ...prev, 
            file : {
                [name] : value,
            }
        }));
    }

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        
        if(!updateStock.color) return alert('색상을 선택해주세요.');
        if(!updateStock.count) return alert('수량을 입력해주세요.');
        if(!updateStock.content) return alert('내용을 입력해주세요.');
        

        try{
            e.preventDefault();

            const url = `${serverIp}/stock`;
            
            const stockData = {
                stockSeq: stock.stockSeq,
                productSeq:updateStock.productSeq,
                stockGradeSeq: parseFloat(updateStock.stockGradeSeq),
                stockOrganicSeq: parseFloat(updateStock.stockOrganicSeq),
                color: updateStock.color,
                count: updateStock.count,
                content: updateStock.content,
                status: 0,
                file : {fileSeq: updateStock.file.fileSeq, name: updateStock.file.name, path: updateStock.file.path},
                regDate: updateStock.regDate,
                userSeq: updateStock.userSeq
            };

            console.log(newProduct);
            console.log(stockData);

            const formData = new FormData();
            formData.append("stockDTO", new Blob([JSON.stringify(stockData)], {
                type: "application/json"
            }));

            if(image) {
                formData.append("image", image);
            }

            // for(let [key, value] of formData.entries()) {
            //     console.log(key, value);
            // }

            const response = await axios.put(url, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert('상품이 수정되었습니다.');

                handleImageReset();
            }
        } catch (error) {
            if (error.response?.status === 400) {
                alert('하루에 한 상품만 등록할 수 있습니다.');
            } else {
                alert('상품 수정에 실패했습니다.');
            }
            console.error('상품 수정 실패:', error);
        }
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        
        console.log("handleProductChange");
        console.log(name, value);
        setUpdateStock(prev => ({
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
        setImage(e.target.files[0]);
   }

   const handleImageReset = () => {
    setImage(null);
  };

   // 이미지 업로드 메소드
   const handleUpload = async () => {
    if (!image) return alert("사진을 선택해주세요.");

    const formData = new FormData();
    formData.append("image", image);

    try {
        const response = await axios.post(`${serverIp}/s3/upload`, formData, {
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
                                {/* 한번 설정되면 바뀌지 않는 값이므로 직접 넣기 */}
                                <option value="default">---</option>
                                <option value="1">식량작물</option>
                                <option value="2">엽채류</option>
                                <option value="3">과채류</option>
                                <option value="4">근채류</option>
                                <option value="5">양채류</option>
                                <option value="6">과수</option>
                                <option value="7">기타작물</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label>상품 종류</label>
                            <select name="productSeq" id="productSeq" value={updateStock.productSeq} onChange={handleProductChange}>
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
                            <select name="stockGradeSeq" id="stockGradeSeq" value = {updateStock.stockGradeSeq} onChange={handleProductChange}>
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
                            <select name="stockOrganicSeq" id="stockOrganicSeq" value = {updateStock.stockOrganicSeq} onChange={handleProductChange}>
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
                            
                            <select name="color" id={selectedColor} value = {updateStock.color} onChange={changeColor}>
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
                                value={updateStock.count}
                                onChange={handleProductChange}
                                placeholder="수량 입력"
                            />
                        </div>
                        <div className="product-description">
                            <label>상품 설명</label>
                            <textarea
                                name="content"
                                value={updateStock.content}
                                onChange={handleProductChange}
                                placeholder="상품에 대한 설명을 입력해주세요"
                            />
                        </div>
                        <div className="form-group">
                        <label>상품 사진 등록</label>
                            <div className="stock-image-upload-container">
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="stock-image-upload-input"
                                />
                                
                                <div className='stock-image-component'>
                                    <div className="stock-image-preview-container">
                                        {image && (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="stock-image-preview"
                                        />
                                        )}
                                    </div>
                                    <div className='stock-image-btn'>
                                        <button
                                            type="button"
                                            className="stock-image-upload-btn"
                                            onClick={() => document.getElementById("image-upload").click()}
                                        >
                                            업로드
                                        </button>

                                        {image && (
                                            <button
                                            type="button"
                                            className="stock-image-reset-btn"
                                            onClick={handleImageReset}
                                            >
                                            삭제
                                        </button>
                                        )}
                                    </div>
                                </div>
                                <div className='stock-image-textarea-container'>
                                    <textarea placeholder='이미지에 대한 설명을 입력해주세요.' id='name' name = 'filename' maxLength={26} value = {updateStock.file.name} onChange={changeFileName}/>
                                </div>
                            </div>
                            
                        </div>
                    
                    </div>
                    <div className='btn'>
                            <button type='submit' className='stock-submit-btn'>수정</button> 
                            <button type='reset' className='stock-reset-btn'>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateStock;