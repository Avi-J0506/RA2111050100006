import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import products from "./sampleProducts";

const ProductPage = (props) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const productId = parseInt(id);
    const foundProduct = products.find((product) => product.id === productId);
    setProduct(foundProduct);
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 h-screen flex flex-col justify-center items-center sm:flex-row sm:justify-around sm:items-center px-10">
    <div className="w-full sm:w-1/3 flex flex-col justify-start items-start">
      <h1 className="md:text-3xl text-xl text-gray-800 font-bold mb-8">
        {product.productName}
      </h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-0">
        <p className="text-md text-black font-bold ">
          {product.price} <span className="text-[10px]">M.R.P</span>
        </p>
        <p className="text-sm text-black font-bold">
          ({product.discount}% off)
        </p>
      </div>
    </div>
  </div>
  
  );
};

export default ProductPage;