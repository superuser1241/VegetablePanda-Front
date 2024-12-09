import React from 'react';
import './UserAuctionHistory.css';

const UserAuctionHistory = ({auctions, loading1, error}) => {
    return (
        <div>
            <div className="auction-history-display">
              <h3>경매 참여 내역</h3>
              {loading1 ? (
                <div>로딩 중...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : auctions.length > 0 ? (
                <table className="auction-history-table-container">
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>상품명</th>
                      <th>수량</th>
                      <th>낙찰 금액</th>
                      <th>참여 일자</th>
                      <th>판매자명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auctions.map((auction, index) => {
                      // 날짜 포맷 변경 함수
                      const formatDate = (dateString) => {
                        const date = new Date(dateString);
                        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
                        return `${formattedDate} ${formattedTime}`;
                      };
                      return (
                      <tr key={auction.bidSeq}>
                        <td>{auction.buySeq}</td> {/* 경매번호 */}
                        <td>{auction.productName}</td> {/* 상품명 */}
                        <td>{auction.count}</td> {/* 수량*/}
                        <td>{auction.totalPrice}원</td> {/* 입찰할 금액 */}
                        <td>{formatDate(auction.insertDate)}</td> {/* 입찰한 날짜 */}
                        <td>{auction.name}</td> {/* 판매자명 */}
                        {/* 현재 상태 */}
                      </tr>
                      )
                      })}
                  </tbody>
                </table>
              ) : (
                <div className="no-data-notification">
                  경매 참여 내역이 없습니다.
                </div>
              )}
            </div>
        </div>
    );
};

export default UserAuctionHistory;