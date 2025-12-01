import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Product Detail {id}</h1>
      <p>Product details go here.</p>
    </div>
  );
};

export default ProductDetail;
