import { create } from "zustand";
import api from "../api/axios";
export const useAuthStore = create((set)=>({
  user: null, token: localStorage.getItem("token")||null,
  setUserFromLocal: async ()=>{
    const token = localStorage.getItem("token");
    if(!token) return;
    try{
      const res = await api.get("/users/me");
      set({ user: res.data, token });
    }catch(e){ localStorage.removeItem("token"); set({user:null, token:null}); }
  },
  login: async(email,password)=>{
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    const res = await api.post("/auth/login", form);
    const token = res.data.access_token;
    const user = res.data.user;
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    set({ user, token });
    return res;
  },
  register: async(email,password)=>{
    const form=new URLSearchParams();
    form.append("username", email); form.append("password", password);
    return api.post("/auth/register", form);
  },
  logout: ()=>{ localStorage.removeItem("token"); delete api.defaults.headers.common["Authorization"]; set({user:null, token:null}); }
}));
