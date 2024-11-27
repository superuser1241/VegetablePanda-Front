import React from 'react';

const SelectBox = ({list, seq, name, changeFn}) => {
    return (
        <div>
            <select name="product-category" id="product-category" onChange={changeFn}>
                        <option value="default">---</option>
                        {
                            list.map((item) => {
                                return <option key = {item.productCategorySeq} id = {item.productCategorySeq} value = {item.productCategorySeq}>{item.content}</option>
                            })
                        }
                    </select>
        </div>
    );
};

export default SelectBox;