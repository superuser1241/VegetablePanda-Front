import React, { useState } from 'react';

const SalesHistoryModal = ({ isOpen, onClose, salesHistory }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    if (!isOpen) return null;
    if (!salesHistory) return null;

    // 현재 페이지에 표시할 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = salesHistory.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(salesHistory.length / itemsPerPage);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    console.log('Current Page:', currentPage);
    console.log('Total Pages:', totalPages);
    console.log('Current Items:', currentItems);
    console.log('Total Items:', salesHistory.length);

    return (
        <div className="modal-overlay" style={{
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
        }}>
            <div className="modal-content" style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                width: '500px',
                maxWidth: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
                margin: '20px'
            }}>
                <h3 style={{margin: '0 0 15px 0'}}>판매 기록</h3>
                {currentItems && currentItems.length > 0 ? (
                    <>
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                                <tr style={{borderBottom: '1px solid #eee'}}>
                                    <th>상품명</th>
                                    <th>1kg당 가격</th>
                                    <th>수량</th>
                                    <th>구매날짜</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={index} style={{borderBottom: '1px solid #eee'}}>
                                        <td>{item.productName}</td>
                                        <td>{(item.price / item.count).toLocaleString()}원</td>
                                        <td>{item.count}</td>
                                        <td>{new Date(item.buyDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '8px',
                                marginTop: '15px'
                            }}>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: currentPage === i + 1 ? '#007bff' : 'white',
                                            color: currentPage === i + 1 ? 'white' : '#007bff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
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