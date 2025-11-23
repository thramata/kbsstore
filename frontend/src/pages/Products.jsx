import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
export default function Products(){
  const [products,setProducts]=useState([]);
  useEffect(()=>{ api.get("/produits").then(r=>setProducts(r.data)).catch(console.error); },[]);
  return (
    <div className="max-w-6xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.length===0 && <p className="col-span-3 text-center text-gray-500">Aucun produit (ajoute-en un depuis Admin).</p>}
      {products.map(p=>(
        <div key={p._id} className="border rounded p-4">
          <img src={p.image?`http://localhost:8000/${p.image}`:"/placeholder.png"} alt={p.name} className="w-full h-48 object-cover mb-2"/>
          <h2 className="font-semibold">{p.name}</h2>
          <p className="text-pink-600 font-bold">{p.price} FCFA</p>
          <p className="text-sm text-gray-600">{p.description?.slice(0,80)}</p>
          <Link to={`/produits/${p._id}`} className="mt-3 inline-block text-sm text-blue-600">Voir</Link>
        </div>
      ))}
    </div>
  );
}
