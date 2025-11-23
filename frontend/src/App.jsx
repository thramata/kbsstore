import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";

export default function App(){
  return (
    <BrowserRouter>
      <Navbar/>
      <div className="pt-20 px-4">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/produits" element={<Products/>}/>
          <Route path="/produits/:id" element={<ProductDetail/>}/>
          <Route path="/panier" element={<Cart/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/profil" element={<Profile/>}/>
          <Route path="/admin/add-product" element={<AddProduct/>}/>
          <Route path="/success" element={<Success/>}/>
          <Route path="/cancel" element={<Cancel/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
