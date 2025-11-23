import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
export default function Register(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const register = useAuthStore(s=>s.register); const navigate = useNavigate();
  const handle = async (e)=>{ e.preventDefault(); try{ await register(email,password); alert("Compte créé — connecte-toi"); navigate("/login"); }catch(e){ console.error(e); alert("Erreur inscription"); } };
  return (<div className="max-w-md mx-auto py-10"><h1 className="text-2xl font-bold mb-4">Inscription</h1><form onSubmit={handle} className="space-y-4"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="border w-full p-2 rounded"/><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" type="password" className="border w-full p-2 rounded"/><button className="bg-pink-600 text-white px-4 py-2 rounded">S'inscrire</button></form></div>);
}
