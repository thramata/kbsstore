import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCartStore } from "../store/cartStore";
export default function ProductDetail(){
  const {id} = useParams();
  const [product,setProduct]=useState(null);
  const addToCart = useCartStore(s=>s.addToCart);
  const navigate = useNavigate();
  useEffect(()=>{ api.get(`/produits/${id}`).then(r=>setProduct(r.data)).catch(console.error); },[id]);
  if(!product) return <p className="text-center mt-10">Chargement...</p>;
  return (
    <div className="max-w-4xl mx-auto py-10">
      <img src={product.image?`http://localhost:8000/${product.image}`:"/placeholder.png"} alt={product.name} className="w-full rounded mb-4"/>
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-pink-600 text-xl font-semibold mt-2">{product.price} FCFA</p>
      <p className="mt-4 text-gray-700">{product.description}</p>
      <div className="mt-6"><button onClick={()=>{addToCart(product); navigate('/panier')}} className="bg-pink-600 text-white px-6 py-2 rounded">Ajouter au panier</button></div>
    </div>
  );
}
