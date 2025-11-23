import React from "react";
import { useCartStore } from "../store/cartStore";
import api from "../api/axios";
export default function Cart(){
  const items = useCartStore(s=>s.items) || [];
  const removeFromCart = useCartStore(s=>s.removeFromCart);
  const clearCart = useCartStore(s=>s.clearCart);
  const total = items.reduce((a,it)=>a+(Number(it.price)||0)*(Number(it.quantity)||0),0);
  const token = localStorage.getItem("token");
  const handlePay = async ()=>{
    if(!token){ alert("Merci de vous connecter avant de payer."); return; }
    try{
      const payload = { items: items.map(({_id,name,price,quantity})=>({ product_id:_id, name, price: Number(price), quantity })), amount: total };
      const res = await api.post("/paiements/create", payload);
      const paymentUrl = res.data.payment_url || res.data.redirect_url || res.data.url || res.data.data?.payment_url;
      if(!paymentUrl){ alert("Erreur : PayTech n'a pas retourné de lien."); return; }
      window.location.href = paymentUrl;
    }catch(err){ console.error(err); alert("Erreur pendant la création du paiement."); }
  };
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Votre panier</h1>
      {items.length===0 ? <p>Votre panier est vide.</p> : <>
        <ul className="space-y-4">{items.map(it=>(
          <li key={it._id} className="flex justify-between items-center p-4 border rounded">
            <div><div className="font-semibold">{it.name}</div><div className="text-sm text-gray-600">{it.quantity} × {it.price} FCFA</div></div>
            <div className="flex items-center gap-3"><button onClick={()=>removeFromCart(it._id)} className="text-red-500">Supprimer</button></div>
          </li>
        ))}</ul>
        <div className="mt-6 p-4 bg-gray-50 rounded"><div className="text-xl font-semibold">Total : {total} FCFA</div><div className="mt-4 flex gap-4"><button onClick={handlePay} className="bg-pink-600 text-white px-6 py-2 rounded">Payer maintenant</button><button onClick={clearCart} className="text-gray-600 underline">Vider le panier</button></div></div>
      </>}
    </div>
  );
}
