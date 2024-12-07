import React from 'react';
import './PurchaseList.css';

const PurchaseList = ({items}) => {
    return (
        <div>
            <table className="purchase-table">
                <thead>
                    <tr>
                        <th>상품 사진</th>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>가격</th>
                    </tr>
                </thead>
                <tbody>
                { items.map((item) => (
                    <tr key = {item.stockSeq}>
                        <td>
                            <div className='cart-purchase-image-container'>
                                <img src={item.imageUrl || 'https://placehold.co/150x150?text=vegetable'} alt={item.productName} className='cart-purchase-image' />
                            </div>
                        </td>
                        <td>{item.productName}</td>
                        <td>{item.quantity}개</td>
                        <td>{item.price.toLocaleString()}원</td>
                        
                    </tr>
                ))
                }
                </tbody>
            </table>
        </div>
    );
};

export default PurchaseList;