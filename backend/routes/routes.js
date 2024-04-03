const express = require('express');
const axios = require('axios');

const router = express.Router();

const BASE_URL = 'http://20.244.56.144/test/companies';

router.get('/categories/:categoryname/products', async (req, res) => {
  try {
    const { categoryname } = req.params;
    const { top, minPrice, maxPrice, page, sort } = req.query;

    const companyNames = ['FLP', 'SUP', 'MYN', 'AZO'];

    
    
    // Array to hold promises for each API call
    const apiPromises = companyNames.map(async () => {


      let data = JSON.stringify({        
          "companyName": "goMart",
          "clientID": "02367c89-3455-4653-bfd2-9e7182d31bfa",
          "clientSecret": "QQwOvcLEmSkrAQSt",
          "ownerName": "abhinandan",
          "ownerEmail": "ag0346@srmist.edu.in",
          "rollNo": "RA2111051010006"    
      });
      const headers = {
        'Content-Type': 'application/json'
      };
      const response = await axios.post('http://20.244.56.144/test/auth', data, headers); 


      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://20.244.56.144/test/companies/AMZ/categories/Laptop/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
        headers: { 
          'Authorization': `Bearer ${response.data.access_token}`
        }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(response.data);
       
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    });

    // Wait for all promises to resolve
    const results = await Promise.all(apiPromises);

    // Combine results from all companies
    const combinedResults = results.flat();

    // Sorting based on sort parameter if provided
    if (sort) {
      combinedResults.sort((a, b) => {
        return a[sort] - b[sort]; // Assuming sort is numeric
      });
    }

    // Pagination
    const pageSize = Number(top) || 10;
    const startIdx = (Number(page) - 1) * pageSize || 0;
    const paginatedResults = combinedResults.slice(startIdx, startIdx + pageSize);

    res.json(paginatedResults);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/categories/:categoryname/products/:productid
router.get('/categories/:categoryname/products/:productid', async (req, res) => {
  try {
    const { categoryname, productid } = req.params;
    const companyNames = ['FLP', 'SUP', 'MYN', 'AZO']; // Your company names

    // Array to hold promises for each API call
    const apiPromises = companyNames.map(async (companyName) => {
      const url = `${BASE_URL}/${companyName}/categories/${categoryname}/products/${productid}`;
      const response = await axios.get(url);
      return response.data;
    });

    const results = await Promise.all(apiPromises);

    // Find the product in the combined results
    const product = results.find((result) => result.id === productid);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
