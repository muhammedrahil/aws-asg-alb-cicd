"use client";

import { useState, useEffect } from "react";
import { User, Package, ShoppingCart, Activity, RefreshCw, UserPlus, Plus, Send } from "lucide-react";

const USER_API = process.env.NEXT_PUBLIC_USER_API || "http://localhost:8000";
const PRODUCT_API = process.env.NEXT_PUBLIC_PRODUCT_API || "http://localhost:8001";
const ORDER_API = process.env.NEXT_PUBLIC_ORDER_API || "http://localhost:8002";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [uRes, pRes, oRes] = await Promise.all([
        fetch(`${USER_API}/users/`),
        fetch(`${PRODUCT_API}/products/`),
        fetch(`${ORDER_API}/orders/`)
      ]);

      const [u, p, o] = await Promise.all([uRes.json(), pRes.json(), oRes.json()]);
      setUsers(Array.isArray(u) ? u : []);
      setProducts(Array.isArray(p) ? p : []);
      setOrders(Array.isArray(o) ? o : []);
    } catch (err: any) {
      setError("Failed to connect to one or more services. Make sure they are running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createSampleData = async () => {
    try {
      // Create User
      const uRes = await fetch(`${USER_API}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Demo User", email: `user_${Date.now()}@example.com`, password: "password123" })
      });
      const newUser = await uRes.json();

      // Create Product
      const pRes = await fetch(`${PRODUCT_API}/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Test Product", description: "Awesome sample product", price: 99.99, stock: 10 })
      });
      const newProduct = await pRes.json();

      // Create Order
      await fetch(`${ORDER_API}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: newUser.id, product_id: newProduct.id, quantity: 1, total_price: 99.99 })
      });

      fetchData();
    } catch (err) {
      alert("Error creating sample data");
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Microservices Dashboard</h1>
          <p className="text-slate-400">Testing 3 isolated services: User, Product, Service (Order)</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={createSampleData} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-900/20">
            <Send className="w-4 h-4" />
            Seed All Services
          </button>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3">
          <Activity className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Service Section */}
        <div className="glass-card p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="text-blue-400" />
              <h2 className="text-xl font-bold">Users</h2>
            </div>
            <span className="service-badge badge-user">Port 8000</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {users.length === 0 ? (
              <p className="text-slate-500 italic text-sm py-4 text-center">No users found</p>
            ) : users.map(u => (
              <div key={u.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-blue-500/30 transition-colors">
                <p className="font-medium text-slate-200">{u.name}</p>
                <p className="text-xs text-slate-500 font-mono truncate">{u.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Service Section */}
        <div className="glass-card p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="text-emerald-400" />
              <h2 className="text-xl font-bold">Products</h2>
            </div>
            <span className="service-badge badge-product">Port 8001</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {products.length === 0 ? (
              <p className="text-slate-500 italic text-sm py-4 text-center">No products found</p>
            ) : products.map(p => (
              <div key={p.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-emerald-500/30 transition-colors">
                <p className="font-medium text-slate-200">{p.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-emerald-400 tracking-wider">${p.price}</p>
                  <p className="text-[10px] text-slate-500 uppercase">Stock: {p.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Service Section */}
        <div className="glass-card p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-amber-400" />
              <h2 className="text-xl font-bold">Orders</h2>
            </div>
            <span className="service-badge badge-order">Port 8002</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {orders.length === 0 ? (
              <p className="text-slate-500 italic text-sm py-4 text-center">No orders found</p>
            ) : orders.map(o => (
              <div key={o.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-amber-500/30 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">{o.status}</p>
                  <p className="text-xs text-slate-400 font-mono">#{o.id.slice(0, 8)}</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs text-slate-500">Qty: {o.quantity}</p>
                  <p className="font-bold text-slate-200">${o.total_price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>Production Ready Microservices Architecture - Testing Deployment</p>
      </footer>
    </div>
  );
}
