import React, { useContext, useState, useEffect } from 'react';
import './CategorieMeniu.css';
import { ShopContext } from '../../context/ShopContext';
import Item from '../../components/item/Item';
import { useParams, useLocation } from 'react-router-dom';
import Filtering from '../../components/filtering/Filtering';

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF-]/g, '')
        .replace(/-+/g, '-');
};

const CategorieMeniu = () => {
    const { all_product: allProducts = [], loading } = useContext(ShopContext);
    const { subcategorie } = useParams();
    const location = useLocation();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        priceRange: '',
        flowers: [],
        colors: []
    });
    const [noProductsMessage, setNoProductsMessage] = useState('');
    const [occasions, setOccasions] = useState([]);
    const [flowers, setFlowers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/flowers/allflowers')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Flowers:", data);
                setFlowers(data);
            })
            .catch(error => console.error('Error fetching flowers:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:4000/api/occasions/alloccasions')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Occasions:", data);
                setOccasions(data);
            })
            .catch(error => console.error('Error fetching occasions:', error));
    }, []);

    useEffect(() => {
        console.log("Subcategory from URL:", subcategorie);
        console.log("All Products:", allProducts);
        console.log("Fetched Occasions:", occasions);

        let results = [];

        if (allProducts.length > 0) {
            if (subcategorie) {
                const normalizedSubcategorie = slugify(decodeURIComponent(subcategorie));
                console.log("Normalized Subcategory:", normalizedSubcategorie);

                if (location.pathname.includes('/produse/')) {
                    results = allProducts.filter(product => slugify(product.category) === normalizedSubcategorie);
                    console.log("Filtered Products by Category:", results);
                } else if (location.pathname.includes('/ocazii/')) {
                    const occasion = occasions.find(o => slugify(o.name) === normalizedSubcategorie);
                    const occasionID = occasion ? occasion.id : null;
                    console.log("Mapped Occasion ID:", occasionID);

                    if (occasionID) {
                        results = allProducts.filter(product => product.occasions && product.occasions.includes(occasionID));
                        console.log("Filtered Products by Occasion ID:", results);
                    } else {
                        setNoProductsMessage('Nu există produse pentru selecția dvs.');
                        setFilteredProducts([]);
                        return;
                    }
                }
            } else {
                results = allProducts;
                console.log("Displaying all products because no subcategorie is chosen");
            }

            const flowerNameToIDMap = Object.fromEntries(flowers.map(f => [f.name, f.id]));
            console.log("Flower Name to ID Map:", flowerNameToIDMap);

            const filteredResults = results.filter(product => {
                const productPrice = product.discountedPrice !== undefined ? product.discountedPrice : product.price;

                const selectedFlowerIDs = filters.flowers.map(name => flowerNameToIDMap[name] || null).filter(id => id !== null);
                console.log("Selected Flower IDs:", selectedFlowerIDs);

                const matchesFlowers = !filters.flowers.length || product.flowers.some(pFlower => {
                    return selectedFlowerIDs.includes(pFlower.flower);
                });

                const matchesColors = !filters.colors.length || product.flowers.some(pFlower => {
                    const flower = flowers.find(f => f.id === pFlower.flower);
                    return flower && filters.colors.some(color => flower.colors.includes(color));
                });

                const matchesPriceRange = !filters.priceRange || (
                    (filters.priceRange === "100-200" && productPrice >= 100 && productPrice <= 200) ||
                    (filters.priceRange === "200-300" && productPrice >= 200 && productPrice <= 300) ||
                    (filters.priceRange === "300-500" && productPrice >= 300 && productPrice <= 500)
                );

                const matchesCategory = !filters.category || product.category === filters.category;

                return matchesFlowers && matchesColors && matchesPriceRange && matchesCategory;
            });

            if (filteredResults.length === 0) {
                setNoProductsMessage('Nu există produse pentru selecția dvs.');
            } else {
                setNoProductsMessage('');
            }

            console.log("Final Filtered Products:", filteredResults);
            setFilteredProducts(filteredResults);
        }
    }, [allProducts, subcategorie, occasions, filters, flowers, location.pathname]);

    const applyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className='shop-category'>
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <>
                    <Filtering filters={filters} applyFilters={applyFilters} />
                    <div className='shopcategory-indexSort'>
                        {noProductsMessage && <p>{noProductsMessage}</p>}
                        {!noProductsMessage && filteredProducts.length > 0 && (
                            <p>
                                <span>
                                    Afișare 1-{filteredProducts.length} din totalul de produse
                                </span>
                            </p>
                        )}
                    </div>
                    <div className='shopcategory-products'>
                        {filteredProducts.map((item, i) => (
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
                </>
            )}
        </div>
    );
};

export default CategorieMeniu;
