import { create } from "zustand";
export const useCartStore = create((set)=>({
  items: [],
  addToCart: (product) => set(state=>{
    const existing = state.items.find(p=>p._id===product._id);
    if(existing){
      return { items: state.items.map(p=> p._id===product._id ? {...p, quantity: p.quantity+1} : p) };
    }
    return { items:[...state.items, {...product, quantity:1}] };
  }),
  removeFromCart: (id) => set(state=>({ items: state.items.filter(i=>i._id!==id) })),
  clearCart: () => set({ items: [] })
}));
