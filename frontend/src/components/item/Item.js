import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
    const { id, name, image, new_price, old_price, price } = props;
    const displayPrice = new_price !== undefined ? new_price : price;
    const displayOldPrice = new_price !== undefined ? old_price : null;

    return (
        <div className='item'>
            <Link to={`/produs/${id}`}>
                <img 
                    onClick={() => window.scrollTo(0, 0)} 
                    src={image} 
                    alt={name} 
                    className='item-img' 
                />
            </Link>
            <p>{name}</p>
            <div className='item-prices'>
                {displayOldPrice && <div className='item-price-old'>{displayOldPrice} lei</div>}
                <div className='item-price-new'>{displayPrice} lei</div>
            </div>
        </div>
    );
};

export default Item;
