import React from "react";
import { useAuthStore } from "../store/authStore";
export default function Profile(){ const user = useAuthStore(s=>s.user); if(!user) return <p className="py-10 text-center">Connecte-toi</p>; return (<div className="max-w-4xl mx-auto py-10"><h1 className="text-2xl font-bold mb-4">Profil</h1><div>Email: {user.email}</div><div>Rôle: {user.role}</div></div>); }
