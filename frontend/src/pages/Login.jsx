import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
export default function Login(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const login = useAuthStore(s=>s.login); const navigate = useNavigate();
  const handle = async (e)=>{ e.preventDefault(); try{ await login(email,password); navigate("/"); }catch(e){ console.error(e); alert("Erreur login"); } };
  return (<div className="max-w-md mx-auto py-10"><h1 className="text-2xl font-bold mb-4">Connexion</h1><form onSubmit={handle} className="space-y-4"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="border w-full p-2 rounded"/><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" type="password" className="border w-full p-2 rounded"/><button className="bg-pink-600 text-white px-4 py-2 rounded">Se connecter</button></form></div>);
}
