const express = require('express');
const axios = require('axios');

const router = express.Router();


router.get('/categories/:categoryname/products', async (req, res) => {
  try {
    const { categoryname } = req.params;
    const { top, minPrice, maxPrice, page, sort } = req.query;
    const companyNames = ['FLP', 'SUP', 'MYN', 'AZO'];
    
    const apiPromises = companyNames.map(async (companyName) => {
      try {
        // Get access token
        const authResponse = await axios.post('http://20.244.56.144/test/auth', {
          companyName: "goMart",
          clientID: "02367c89-3455-4653-bfd2-9e7182d31bfa",
          clientSecret: "QQwOvcLEmSkrAQSt",
          ownerName: "abhinandan",
          ownerEmail: "ag0346@srmist.edu.in",
          rollNo: "RA2111051010006"
        });

        // Fetch products
        const response = await axios.get(`http://20.244.56.144/test/companies/${companyName}/categories/${categoryname}/products`, {
          params: {
            top,
            minPrice,
            maxPrice
          },
          headers: {
            'Authorization': `Bearer ${authResponse.data.access_token}`
          }
        });

        return response.data;
      } catch (error) {
        console.error(`Error fetching products from ${companyName}:`, error);
        return [];
      }
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

    res.status(200).json(paginatedResults);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/categories/:categoryname/products/:productid
router.get('/categories/:categoryname/products/:productid', async (req, res) => {
  try {
    const { categoryname, productid } = req.params;
    const companyNames = ['FLP', 'SUP', 'MYN', 'AZO'];

    const apiPromises = companyNames.map(async (companyName) => {
      try {
        // Get access token
        const authResponse = await axios.post('http://20.244.56.144/test/auth', {
          companyName: "goMart",
          clientID: "02367c89-3455-4653-bfd2-9e7182d31bfa",
          clientSecret: "QQwOvcLEmSkrAQSt",
          ownerName: "abhinandan",
          ownerEmail: "ag0346@srmist.edu.in",
          rollNo: "RA2111051010006"
        });

        // Fetch product details
        const response = await axios.get(`http://20.244.56.144/test/companies/${companyName}/categories/${categoryname}/products/${productid}`, {
          params: {
            top,
            minPrice,
            maxPrice
          },
          headers: {
            'Authorization': `Bearer ${authResponse.data.access_token}`
          }
        });

        return response.data;
      } catch (error) {
        console.error(`Error fetching product details from ${companyName}:`, error);
        return null;
      }
    });

    const results = await Promise.all(apiPromises);

    // Find the product in the combined results
    const product = results.find((result) => result !== null);

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
