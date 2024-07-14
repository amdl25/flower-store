import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useParams, useLocation } from 'react-router-dom';
import Breadcrum from '../components/breadcrums/Breadcrum';
import ProductDisplay from '../components/productDisplay/ProductDisplay';
import DescriptionBox from '../components/descriptionBox/DescriptionBox';
import RelatedProducts from '../components/relatedProducts/RelatedProducts';

function Produs() {
  const { all_product: allproducts, loading } = useContext(ShopContext); 
  const { idProdus } = useParams();
  const location = useLocation();
  const [produs, setProdus] = useState(null);

  useEffect(() => {
    if (location.pathname === '/produse/buchet-surpriza') {
      fetch(`http://localhost:4000/api/products/surpriseProduct`)
        .then(response => response.json())
        .then(data => {
          setProdus(data);
        })
        .catch(error => console.error('Error fetching product details:', error));
    } else {
      if (allproducts && Array.isArray(allproducts)) {
        const foundProduct = allproducts.find(e => e.id === idProdus || e.id === Number(idProdus));
        setProdus(foundProduct);
      }
    }
  }, [location.pathname, allproducts, idProdus]);

  if (loading || !produs) {
    return <div>Loading...</div>; 
  }

  if (!produs) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Breadcrum produs={produs} />
      <ProductDisplay produs={produs} />
      <DescriptionBox />
      <RelatedProducts currentProduct={produs}/>
    </div>
  );
}

export default Produs;
