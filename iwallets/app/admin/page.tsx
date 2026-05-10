"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Download, LogOut, TrendingUp, ShoppingBag, Search, Eye, Plus, Image as ImageIcon, Video, Box, Palette, AlignLeft, DollarSign } from "lucide-react";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const router = useRouter();

  // Product Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // 🔐 Auth check
  useEffect(() => {
    fetch("/api/admin-check").then((res) => {
      if (!res.ok) router.push("/");
    });
  }, [router]);

  // 📊 Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin-orders");
        if (!res.ok) return;
        const text = await res.text();
        if (!text) return;
        const data = JSON.parse(text);
        setOrders(data);
        setFiltered(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchOrders();
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    const result = orders.filter(
      (o) =>
        o.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.paymentId?.toLowerCase().includes(search.toLowerCase()) ||
        o.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, orders]);

  // 💰 Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalOrders = orders.length;

  const chartData = Object.values(
    orders.reduce((acc: any, order: any) => {
      const date = new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      if (!acc[date]) acc[date] = { date, revenue: 0 };
      acc[date].revenue += order.amount;
      return acc;
    }, {})
  );

  const logout = async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/");
  };

  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Phone", "Amount", "Payment ID", "Date"],
      ...orders.map((o) => [
        o.name, o.email, o.phone, o.amount, o.paymentId, new Date(o.createdAt).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadStatus("Uploading product to CMS...");

    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch("/api/admin-product", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadStatus("Product successfully published!");
        formRef.current?.reset();
        setTimeout(() => setUploadStatus(""), 3000);
      } else {
        setUploadStatus(`Error: ${data.error || "Failed to publish"}`);
      }
    } catch (err) {
      setUploadStatus("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-3 md:p-10 pb-24 text-black font-sans">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-black">Dashboard</h1>
            <p className="text-sm md:text-base text-gray-500 font-medium mt-1">Manage your storefront and orders seamlessly.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* TABS */}
            <div className="flex p-1 bg-gray-50 rounded-full border border-gray-100 w-full sm:w-auto mb-4 sm:mb-0">
              <button 
                onClick={() => setActiveTab("orders")}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "orders" ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-black"}`}
              >
                Orders
              </button>
              <button 
                onClick={() => setActiveTab("products")}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "products" ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-black"}`}
              >
                Products
              </button>
            </div>

            {activeTab === "orders" && (
              <button 
                onClick={exportCSV} 
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-full transition-colors w-full sm:w-auto"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            )}

            <button 
              onClick={logout} 
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black hover:bg-[#ff3366] text-white font-bold rounded-full transition-colors w-full sm:w-auto"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {activeTab === "orders" ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* METRICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 md:p-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group">
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1 md:mb-2">Total Revenue</p>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter">₹{totalRevenue.toLocaleString()}</h2>
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <TrendingUp className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                </div>
              </div>

              <div className="p-6 md:p-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group">
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1 md:mb-2">Total Orders</p>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter">{totalOrders}</h2>
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-rose-50 text-[#ff3366] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* CHART */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-black tracking-tight mb-8">Revenue Overview</h2>
              <div className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#ff3366', fontWeight: '900' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#ff3366" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-black tracking-tight">Recent Orders</h2>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    placeholder="Search orders..."
                    className="w-full md:w-64 pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-full text-sm font-medium focus:outline-none focus:border-[#ff3366] transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Customer</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Contact</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Amount</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Payment ID</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-center whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((o, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <p className="font-bold text-gray-900">{o.name}</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">{o.email}</p>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap"><p className="text-sm font-medium text-gray-600">{o.phone}</p></td>
                        <td className="py-4 px-6 whitespace-nowrap"><p className="font-black text-gray-900">₹{o.amount}</p></td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <p className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block">{o.paymentId || "N/A"}</p>
                        </td>
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <Link href={`/admin/orders/${o._id}`} className="inline-flex p-2 text-gray-400 hover:text-[#ff3366] hover:bg-rose-50 rounded-full transition-colors">
                            <Eye size={20} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-12"
          >
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={30} className="text-[#ff3366]" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-black tracking-tighter">Publish New Product</h2>
              <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">Upload images, videos, and product details directly to the database from here.</p>
            </div>

            <form ref={formRef} onSubmit={handleAddProduct} className="max-w-4xl mx-auto space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Box size={16}/> Product Title</label>
                    <input name="title" required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium" placeholder="e.g. Premium iWallet - Stealth Black" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><DollarSign size={16}/> Price (₹)</label>
                    <input name="price" type="number" required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium" placeholder="1599" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Palette size={16}/> Color / Variant</label>
                    <input name="color" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium" placeholder="e.g. Matte Black" />
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><AlignLeft size={16}/> Description</label>
                    <textarea name="description" rows={4} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium resize-none" placeholder="Product features and details..."></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><ImageIcon size={16}/> Product Image</label>
                      <input name="image" type="file" accept="image/*" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-[#ff3366] hover:file:bg-rose-100 transition-all cursor-pointer" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Video size={16}/> Product Video</label>
                      <input name="video" type="file" accept="video/*" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-gray-300 transition-all cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
                <button 
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-black hover:bg-[#ff3366] text-white font-black rounded-full shadow-xl shadow-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto min-w-[250px]"
                >
                  {isSubmitting ? "PUBLISHING..." : "PUBLISH PRODUCT"}
                </button>

                <AnimatePresence>
                  {uploadStatus && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`font-bold text-sm ${uploadStatus.includes("Error") ? "text-red-500" : "text-emerald-500"}`}
                    >
                      {uploadStatus}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Database Ready</p>
                <p className="text-sm text-emerald-800 font-medium mt-1">Products are securely uploaded and stored directly in your MongoDB database.</p>
              </div>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
}