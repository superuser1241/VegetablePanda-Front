import React from 'react';

const SalesHistoryModal = ({ isOpen, onClose, salesHistory }) => {
    if (!isOpen) return null;

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
                }}>판매 기록</h3>
                {salesHistory && salesHistory.length > 0 ? (
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
                                    fontWeight: 'normal',
                                    whiteSpace: 'nowrap'
                                }}>상품명</th>
                                <th style={{ 
                                    padding: '8px',
                                    textAlign: 'right',
                                    fontWeight: 'normal',
                                    whiteSpace: 'nowrap'
                                }}>가격</th>
                                <th style={{ 
                                    padding: '8px',
                                    textAlign: 'center',
                                    fontWeight: 'normal',
                                    whiteSpace: 'nowrap'
                                }}>수량</th>
                                <th style={{ 
                                    padding: '8px',
                                    textAlign: 'center',
                                    fontWeight: 'normal',
                                    whiteSpace: 'nowrap'
                                }}>구매날짜</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesHistory.map((item, index) => (
                                <tr key={index} style={{ 
                                    borderBottom: '1px solid #eee'
                                }}>
                                    <td style={{ 
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>
                                        {item.productName}
                                        <br />
                                        <small style={{ color: '#666' }}>
                                            {item.productCategory} / {item.productGrade} / {item.organicStatus}
                                        </small>
                                    </td>
                                    <td style={{ 
                                        padding: '8px',
                                        textAlign: 'right',
                                        whiteSpace: 'nowrap'
                                    }}>{item.price.toLocaleString()}원</td>
                                    <td style={{ 
                                        padding: '8px',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap'
                                    }}>{item.count}</td>
                                    <td style={{ 
                                        padding: '8px',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap'
                                    }}>{new Date(item.buyDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>판매 기록이 없습니다.</p>
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

export default SalesHistoryModal; 