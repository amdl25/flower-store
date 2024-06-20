import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import './Search.css';
import { ShopContext } from '../../context/ShopContext';
import Item from '../../components/item/Item';

function Search() {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const { all_product: allproducts } = useContext(ShopContext);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const searchTerms = searchQuery.toLowerCase().split(' ');

      const filteredProducts = allproducts.filter(product => {
        return searchTerms.some(term =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          (Array.isArray(product.flowers) && product.flowers.some(flower => String(flower.flower).toLowerCase().includes(term)))
        );
      });

      setSearchResults(filteredProducts);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allproducts]);

  return (
    <div className="search-container">
      <h1>Rezultatele căutării: {searchQuery}</h1>
      <div className='search-grid'>
        {searchResults.map((item, i) => (
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
}

export default Search;
