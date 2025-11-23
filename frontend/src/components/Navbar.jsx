import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

export default function Navbar(){
  const items = useCartStore(s=>s.items) || [];
  const count = Array.isArray(items) ? items.reduce((a,it)=>a+(Number(it.quantity)||0),0) : 0;
  const user = useAuthStore(s=>s.user);
  const setUserFromLocal = useAuthStore(s=>s.setUserFromLocal);
  const logout = useAuthStore(s=>s.logout);
  useEffect(()=>{ setUserFromLocal(); },[]);
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow z-50 h-16 flex items-center px-6">
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold">KBS Store</Link>
        <div className="flex items-center gap-6">
          <Link to="/produits" className="hover:text-pink-600">Produits</Link>
          <Link to="/panier" className="relative hover:text-pink-600">Panier{count>0 && <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{count}</span>}</Link>
          {!user ? <>
            <Link to="/login" className="hover:text-pink-600">Connexion</Link>
            <Link to="/register" className="hover:text-pink-600">Inscription</Link>
          </> : <>
            <Link to="/profil" className="hover:text-pink-600">Profil</Link>
            {user.role==="admin" && <Link to="/admin/add-product" className="hover:text-pink-600">Admin</Link>}
            <button onClick={logout} className="text-sm text-gray-600">Déconnexion</button>
          </>}
        </div>
      </div>
    </nav>
);
}
