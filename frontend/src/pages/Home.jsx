import React from "react";
import { Link } from "react-router-dom";
export default function Home(){
  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Bienvenue sur KBS Store</h1>
      <p className="mb-6 text-gray-700">Boutique de test — ajoutez des produits pour commencer.</p>
      <Link to="/produits" className="bg-pink-600 text-white px-4 py-2 rounded">Voir les produits</Link>
    </div>
  );
}
