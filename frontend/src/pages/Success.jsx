import React, { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
export default function Success(){ const clearCart = useCartStore(s=>s.clearCart); useEffect(()=>{ clearCart(); },[]); return (<div className="max-w-4xl mx-auto py-10 text-center"><h1 className="text-3xl font-bold mb-4">Paiement réussi 🎉</h1><p>Merci pour votre commande.</p></div>); }
