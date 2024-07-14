import React, { useContext } from 'react';
import './RelatedProducts.css';
import Item from '../item/Item';
import { ShopContext } from '../../context/ShopContext';

const RelatedProducts = () => {
  const { all_product: allProducts } = useContext(ShopContext);

  const relatedProducts = allProducts.slice(0, 6);

  return (
    <div className='relatedproducts'>
      <h1>Te-ar putea interesa și</h1>
      <div className='relatedproducts-item'>
        {relatedProducts.map((item, i) => (
          <Item
          key={i}
          id={item.id}
          name={item.name}
          image={item.image}
          new_price={item.discountedPrice ? item.discountedPrice : item.price}
          old_price={item.discountedPrice ? item.price : null}
          price={item.price}
      />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
