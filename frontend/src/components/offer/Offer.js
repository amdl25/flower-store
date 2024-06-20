import React, { useContext, useEffect, useState } from 'react';
import './Offer.css';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';

const Offer = () => {
    const { all_product: allProducts } = useContext(ShopContext);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (allProducts.length > 0) {
            const minPriceProduct = allProducts.reduce((minProduct, currentProduct) => {
                const minPrice = minProduct.new_price || minProduct.price;
                const currentPrice = currentProduct.new_price || currentProduct.price;
                return currentPrice < minPrice ? currentProduct : minProduct;
            }, allProducts[0]);

            const minPrice = minPriceProduct.new_price || minPriceProduct.price;
            const productsWithMinPrice = allProducts.filter(product => {
                const productPrice = product.new_price || product.price;
                return productPrice === minPrice;
            });

            const randomIndex = Math.floor(Math.random() * productsWithMinPrice.length);
            setSelectedProduct(productsWithMinPrice[randomIndex]);
        }
    }, [allProducts]);

    const handleProductClick = () => {
        if (selectedProduct) {
            navigate(`/produs/${selectedProduct.id}`, { state: { product: selectedProduct } });
        }
    };

    return (
        <div className='offer'>
            {selectedProduct ? (
                <>
                    <div className='offer-left'>
                        <h1>{selectedProduct.name}</h1>
                        <div className='btn-reducere'>
                            <button onClick={handleProductClick}>Vezi produsul</button>
                            <p>15% reducere</p>
                        </div>
                    </div>
                    <div className='offer-right'>
                        <img src={selectedProduct.image} alt={selectedProduct.name} className='offer-right-img' />
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Offer;
