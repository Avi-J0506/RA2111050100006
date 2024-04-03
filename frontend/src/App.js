// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductPage from "./components/pages/ProductPage";
import ProductList from "./components/pages/ProductList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<ProductList/>} />
        <Route path="/product" component={<ProductPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
