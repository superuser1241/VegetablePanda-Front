import React from 'react';
import './BidHistoryModal.css';

const BidHistoryModal = ({ isOpen, onClose, bidHistory }) => {
    if (!isOpen) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\./g, '-');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>입찰 기록</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="bid-table">
                    <div className="bid-table-header">
                        <div className="bid-column">번호</div>
                        <div className="bid-column">입찰자</div>
                        <div className="bid-column">입찰 가격</div>
                        <div className="bid-column">입찰 시간</div>
                    </div>
                    <div className="bid-table-body">
                        {bidHistory && bidHistory.length > 0 ? (
                            bidHistory.map((bid, index) => (
                                <div key={index} className="bid-table-row">
                                    <div className="bid-column">{bidHistory.length - index}</div>
                                    <div className="bid-column">{bid.comName}</div>
                                    <div className="bid-column price">{bid.price}원</div>
                                    <div className="bid-column">{formatDate(bid.insertDate)}</div>
                                </div>
                            ))
                        ) : (
                            <div className="no-bids">입찰 기록이 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BidHistoryModal; 