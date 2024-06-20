import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../components/breadcrums/Breadcrum';
import ProductDisplay from '../components/productDisplay/ProductDisplay';
import DescriptionBox from '../components/descriptionBox/DescriptionBox';
import RelatedProducts from '../components/relatedProducts/RelatedProducts';

function Produs() {
  const { all_product: allproducts, loading } = useContext(ShopContext);
  const { idProdus } = useParams();

  console.log("Product ID from URL params:", idProdus);
  console.log("All products in Produs component:", allproducts);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!allproducts || !Array.isArray(allproducts)) {
    return <div>Error loading products. Please try again later.</div>;
  }

  const produs = allproducts.find((e) => e.id === idProdus || e.id === Number(idProdus));

  console.log("Selected product:", produs);

  if (!produs) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Breadcrum produs={produs} />
      <ProductDisplay produs={produs} />
      <DescriptionBox />
      <RelatedProducts />
    </div>
  );
}

export default Produs;
