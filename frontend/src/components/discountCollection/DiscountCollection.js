import React, { useContext, useEffect, useState } from 'react';
import './DiscountCollection.css';
import Item from '../item/Item';
import { ShopContext } from '../../context/ShopContext';

const DiscountCollection = () => {
    const { all_product: allProducts, loading } = useContext(ShopContext);
    const [discountedProducts, setDiscountedProducts] = useState([]);

    useEffect(() => {
        if (!loading && allProducts.length > 0) {
            const productsWithDiscount = allProducts.filter(product => product.discountedPrice !== undefined && product.discountedPrice > 0);
            setDiscountedProducts(productsWithDiscount);
        }
    }, [allProducts, loading]);

    return (
        <div className='collection'>
            <h1>Colecție redusă</h1>
            <div className='collection-item'>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    discountedProducts.map((item, i) => (
                        <Item
                            key={i}
                            id={item.id}
                            name={item.name}
                            image={item.image}
                            new_price={item.discountedPrice ? item.discountedPrice : item.price}
                            old_price={item.discountedPrice ? item.price : null}
                            price={item.price}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default DiscountCollection;
