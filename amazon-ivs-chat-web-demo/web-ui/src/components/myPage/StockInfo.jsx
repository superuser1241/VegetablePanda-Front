import React from 'react';
import { useLocation } from 'react-router-dom';
import './StockInfo.css';

const StockInfo = ({onUpdateStock, setActiveTab, stock, onBack}) => {

    const { state } = useLocation();
    const item = state?.item;
    const getColorName = (colorCode) => {
        const colorMap = {
            1: '빨간색',
            2: '주황색',
            3: '초록색',
            4: '보라색',
            5: '흰색'
        };
        return colorMap[colorCode] || '정보없음';
    };

    return (
        <div>
            <div className="stock-info-container">
            <div className="stock-info-header">
                <h3>재고 상세 정보</h3>
                <button onClick={onBack} className="back-button">
                    목록으로 돌아가기
                </button>
            </div>
            
            <div className="stock-info-content">
                <div className='info-row'>
                    <img src ={stock.filePath ? stock.filePath : 'https://placehold.co/200x200?text=vegetable'} alt='{item.fileName}'/>
                </div>
                <div className="info-grid">
                        <div className="info-item">
                            <label>상품 카테고리</label>
                            <span>{stock.productCategoryContent}</span>
                        </div>
                        <div className="info-item">
                            <label>상품명</label>
                            <span>{stock.productName}</span>
                        </div>
                        <div className="info-item">
                            <label>수량</label>
                            <span>{stock.count}</span>
                        </div>

                        <div className="info-item">
                            <label>등급</label>
                            <span>{stock.stockGrade}</span>
                        </div>
                            <div className="info-item">
                                <label>인증</label>
                                <span>{stock.stockOrganic}</span>
                            </div>
                            <div className="info-item">
                                <label>색상</label>
                                <div className='color-fair'>
                                    <span className="color-value">
                                    {getColorName(stock.color)}
                                    <span 
                                        className="color-circle"
                                        style={{ backgroundColor: 
                                            stock.color === 1 ? '#FF0000' :  // 빨간색
                                            stock.color === 2 ? '#FFA500' :  // 주황색
                                            stock.color === 3 ? '#008000' :  // 초록색
                                            stock.color === 4 ? '#800080' :  // 보라색
                                            stock.color === 5 ? '#FFFFFF' :  // 흰색
                                            'transparent'
                                        }}
                                    ></span>
                                    </span>
                                </div>
                            </div>
                            <div className="info-item explanation" style={{ gridColumn: 'span 2' }}>
                                <label>설명</label>
                                <span>{stock.content}</span>
                            </div>
                    
                    </div>
                    <div className='update-button-container' onClick={()=>{
                        onUpdateStock(stock);
                        setActiveTab('updateStock');
                    }}><button>수정하기</button></div>

                {/* 필요한 다른 정보들도 추가 */}
                </div>
            </div>
        </div>
    );
};

export default StockInfo;