import React, { useEffect, useState } from 'react';
import './NewCollection.css';
import Item from '../item/Item';

const NewCollection = () => {
    const [newCollectionProducts, setNewCollectionProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewCollection = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/products/newcollection');
                const data = await response.json();

                const mappedData = data.map(product => ({
                    ...product,
                    new_price: product.discountedPrice !== undefined ? product.discountedPrice : product.price,
                    old_price: product.discountedPrice !== undefined ? product.price : undefined,
                    price: product.price
                }));

                setNewCollectionProducts(mappedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching new collection:', error);
                setLoading(false);
            }
        };

        fetchNewCollection();
    }, []);

    return (
        <div className='newCollection'>
            <h1>Colecție Nouă</h1>
            <div className='newCollection-item'>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    newCollectionProducts.map((item, i) => (
                        <Item
                            key={i}
                            id={item.id}
                            name={item.name}
                            image={item.image}
                            new_price={item.new_price}
                            old_price={item.old_price}
                            price={item.price}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default NewCollection;
