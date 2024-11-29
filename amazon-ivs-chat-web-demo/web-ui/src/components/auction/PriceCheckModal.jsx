import React from 'react';

const PriceCheckModal = ({ isOpen, onClose, priceInfo }) => {
    if (!isOpen) return null;

    const getCategoryName = (category) => {
        const categories = {
            1: '채소류',
            2: '과일류',
            3: '곡물류',
            4: '버섯류',
            5: '뿌리채소',
            6: '잎채소',
            7: '쌈채소',
            8: '산나물',
            9: '건농산물',
            10: '견과류'
        };
        return categories[category] || '알 수 없음';
    };

    const getGradeName = (grade) => {
        const grades = {
            1: '특(1등)',
            2: '상(2등)',
            3: '중(3등)',
            4: '4등',
            5: '5등',
            6: '9등(등외)'
        };
        return grades[grade] || '알 수 없음';
    };

    const getTypeName = (type) => {
        const types = {
            1: '우수농산물',
            2: '일반'
        };
        return types[type] || '알 수 없음';
    };

    return (
        <div className="modal-overlay" 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}
        >
            <div className="modal-content"
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '400px',
                }}
            >
                <h3 style={{ 
                    margin: '0 0 15px 0',
                    fontSize: '16px',
                    fontWeight: 'bold' 
                }}>가격 정보</h3>
                {priceInfo && priceInfo.length > 0 ? (
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        fontSize: '14px'
                    }}>
                        <thead>
                            <tr style={{ 
                                borderBottom: '1px solid #eee',
                                backgroundColor: '#f8f9fa'
                            }}>
                                <th style={{ 
                                    padding: '8px',
                                    textAlign: 'left',
                                    fontWeight: 'normal'
                                }}>상품명</th>
                                <th style={{ 
                                    padding: '8px',
                                    textAlign: 'right',
                                    fontWeight: 'normal'
                                }}>가격</th>
                                <th style={{ 
                                    padding: '8px',
                                    textAlign: 'center',
                                    fontWeight: 'normal'
                                }}>구분</th>
                                <th style={{ 
                                    padding: '8px',
                                    textAlign: 'center',
                                    fontWeight: 'normal'
                                }}>등급</th>
                                <th style={{ 
                                    padding: '8px',
                                    textAlign: 'center',
                                    fontWeight: 'normal'
                                }}>카테고리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {priceInfo.map((item, index) => (
                                <tr key={index} style={{ 
                                    borderBottom: '1px solid #eee'
                                }}>
                                    <td style={{ 
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>{item.garak_name}</td>
                                    <td style={{ 
                                        padding: '8px',
                                        textAlign: 'right'
                                    }}>{item.garak_price.toLocaleString()}원</td>
                                    <td style={{ 
                                        padding: '8px',
                                        textAlign: 'center'
                                    }}>{getTypeName(item.garak_type)}</td>
                                    <td style={{ 
                                        padding: '8px',
                                        textAlign: 'center'
                                    }}>{getGradeName(item.garak_grade)}</td>
                                    <td style={{ 
                                        padding: '8px',
                                        textAlign: 'center'
                                    }}>{getCategoryName(item.garak_category)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>가격 정보가 없습니다.</p>
                )}
                <button 
                    onClick={onClose}
                    style={{
                        width: '100%',
                        marginTop: '15px',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default PriceCheckModal; 