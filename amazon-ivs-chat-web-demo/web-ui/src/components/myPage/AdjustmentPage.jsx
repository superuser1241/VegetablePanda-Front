import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdjustmentPage.css';

const AdjustmentPage = () => {
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const token = localStorage.getItem('token');
    const serverIp = process.env.REACT_APP_SERVER_IP;

    useEffect(() => {
        fetchSettlements();
    }, []);

    const fetchSettlements = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverIp}/api/admin/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSettlements(response.data);
        } catch (error) {
            console.error('정산 목록 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (buySeq) => {
        try {
            await axios.post(`${serverIp}/api/admin/approve/${buySeq}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('정산이 승인되었습니다.');
            fetchSettlements();
        } catch (error) {
            console.error('정산 승인 실패:', error);
            alert('정산 승인 중 오류가 발생했습니다.');
        }
    };

    // 페이징 처리 로직
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = settlements.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(settlements.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>로딩 중...</div>;

    return (
        <div className="settlement-approval">
            <h2>정산 승인 관리</h2>
            {settlements.length > 0 ? (
                <>
                    <table className="settlement-table">
                        <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>농가명</th>
                                <th>상품명</th>
                                <th>금액</th>
                                <th>신청일</th>
                                <th>액션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((settlement) => (
                                <tr key={settlement.buySeq}>
                                    <td>{settlement.buySeq}</td>
                                    <td>{settlement.farmerName}</td>
                                    <td>{settlement.productName}</td>
                                    <td>{settlement.totalPrice.toLocaleString()}원</td>
                                    <td>{new Date(settlement.buyDate).toLocaleDateString()}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleApprove(settlement.buySeq)}
                                            className="approve-button"
                                        >
                                            승인
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <p className="no-data">승인 대기중인 정산 신청이 없습니다.</p>
            )}
        </div>
    );
};

export default AdjustmentPage; 