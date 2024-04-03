import React, { useState} from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Link } from "react-router-dom";
import products from './sampleProducts'
import axios from "axios";

const options = [
  "Laptop",
  "Mouse",
  "Keyboard",
  "Headphones",
];

const ProductList = () => {
  const [category, setCategory] = useState(null);
  const [maxprice, setMaxPrice] = useState(0);
  const [minprice, setMinPrice] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const handleDropdownChange = (option) => {
    setCategory(option.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/categories/${category}/products`, {
        params: {
          top: 10,
          minPrice:minprice,
          maxPrice:maxprice,
        }
      });
      console.log(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };
  return (
    <div className="bg-gray-100 p-4 h-full flex flex-col justify-center items-around px-[10vw] py-[5vw]">
      <div className="md:flex md:justify-between md:items-center" >
      <div className="md:text-3xl text-2xl text-left text-gray-800 font-bold mb-8">Product Results</div>
      <div className="flex justify-end items-center gap-2 mb-8">
        <div className="text-md">Category</div>
        <Dropdown
          options={options}
          onChange={handleDropdownChange}
          value={category}
          placeholder="Select an option"
          className="w-50"
        />
      </div>
      <div className="flex justify-end items-center gap-2 mb-8">
        <div className="text-md">Max Price</div>
        <input type="number"className="w-20" onChange={(e)=>setMaxPrice(e.target.value)} value={maxprice}/>
      </div>
      <div className="flex justify-end items-center gap-2 mb-8">
        <div className="text-md">Min Price</div>
        <input type="number"className="w-20" onChange={(e)=>setMinPrice(e.target.value)} value={minprice}/>
      </div>
      <div className="flex justify-end items-center gap-2 mb-8">
        <button className="bg-green-600 w-20 h-10" onClick={handleSearch}>Search</button>
      </div>
      </div>
       
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {searchResults.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
            <img src={product.image} alt={product.productName} className="w-full mb-4" />
            <div className="text-gray-800 space-y-2">
              <h3 className="text-lg font-semibold mb-2">{product.productName}</h3>
              <p className="text-sm text-gray-600">Rating: {product.rating}</p>
              <div className="flex justify-between ">
                <p className="text-md text-black font-bold "> {product.price} <span className="text-[10px]">M.R.P</span></p>
                <p className="text-sm text-black"> ({product.discount}% off)</p>
              </div>

              <p className="text-sm text-gray-800">Availability: {product.availability}</p>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;