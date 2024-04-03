const express = require('express');
const app = express();
const axios = require('axios');
const router = require("./routes/routes");

app.get('/', (req,res)=>{
  res.send("Testing server");
})

app.listen(3000, () => console.log('Server running on port 3000'));
