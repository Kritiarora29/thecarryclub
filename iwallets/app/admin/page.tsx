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
import { Download, LogOut, TrendingUp, ShoppingBag, Search, Eye, Plus, Image as ImageIcon, Video, Box, Palette, AlignLeft, DollarSign, Settings, ShieldCheck, Activity, Info, Truck, HelpCircle, Save, CheckCircle, AlertCircle, RefreshCw, Loader2 } from "lucide-react";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "settings">("orders");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  // Product Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const [adminProducts, setAdminProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");

  // Nimbus Config State
  const [nimbusEmail, setNimbusEmail] = useState("");
  const [nimbusPassword, setNimbusPassword] = useState("");
  const [nimbusMode, setNimbusMode] = useState<"sandbox" | "production">("sandbox");
  const [nimbusIsSimulator, setNimbusIsSimulator] = useState(true);
  const [nimbusPickupName, setNimbusPickupName] = useState("");
  const [nimbusPickupPhone, setNimbusPickupPhone] = useState("");
  const [nimbusPickupAddress, setNimbusPickupAddress] = useState("");
  const [nimbusPickupCity, setNimbusPickupCity] = useState("");
  const [nimbusPickupState, setNimbusPickupState] = useState("");
  const [nimbusPickupPincode, setNimbusPickupPincode] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // Nimbus Warehouse Fetch State
  const [warehousesList, setWarehousesList] = useState<any[]>([]);
  const [isFetchingWarehouses, setIsFetchingWarehouses] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Fetch Nimbus Config on mount
  useEffect(() => {
    fetch("/api/nimbus/config")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setNimbusEmail(data.email || "");
          setNimbusPassword(data.password || "");
          setNimbusMode(data.mode || "sandbox");
          setNimbusIsSimulator(data.isSimulator !== undefined ? data.isSimulator : true);
          setNimbusPickupName(data.pickupName || "");
          setNimbusPickupPhone(data.pickupPhone || "");
          setNimbusPickupAddress(data.pickupAddress || "");
          setNimbusPickupCity(data.pickupCity || "");
          setNimbusPickupState(data.pickupState || "");
          setNimbusPickupPincode(data.pickupPincode || "");
        }
      })
      .catch((err) => console.error("Error fetching Nimbus config:", err));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSaveStatus("Saving settings...");
    try {
      const res = await fetch("/api/nimbus/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: nimbusEmail,
          password: nimbusPassword,
          mode: nimbusMode,
          isSimulator: nimbusIsSimulator,
          pickupName: nimbusPickupName,
          pickupPhone: nimbusPickupPhone,
          pickupAddress: nimbusPickupAddress,
          pickupCity: nimbusPickupCity,
          pickupState: nimbusPickupState,
          pickupPincode: nimbusPickupPincode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus("Settings saved successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
      } else {
        setSaveStatus(`Error: ${data.error || "Failed to save settings"}`);
      }
    } catch (err) {
      setSaveStatus("An unexpected error occurred.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/nimbus/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: nimbusEmail,
          password: nimbusPassword,
          mode: nimbusMode,
          isSimulator: nimbusIsSimulator,
        }),
      });
      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message || "Failed to test connection",
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "An unexpected error occurred.",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleFetchWarehouses = async () => {
    setIsFetchingWarehouses(true);
    setFetchError("");
    try {
      const res = await fetch("/api/nimbus/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: nimbusEmail,
          password: nimbusPassword,
          mode: nimbusMode,
          isSimulator: nimbusIsSimulator,
        }),
      });
      const data = await res.json();
      if (data.success && data.warehouses?.length > 0) {
        setWarehousesList(data.warehouses);
      } else {
        setFetchError(data.message || "No warehouses found.");
      }
    } catch (err: any) {
      setFetchError(err.message || "An error occurred while fetching.");
    } finally {
      setIsFetchingWarehouses(false);
    }
  };

  // 🔐 Auth check
  useEffect(() => {
    fetch("/api/admin-check").then((res) => {
      if (!res.ok) router.push("/");
    });
  }, [router]);

  // 📊 Fetch orders
  const fetchOrders = async () => {
    setIsRefreshing(true);
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
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
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

  const fetchAdminProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch("/api/admin-product");
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminProducts(data.products || []);
      }
    } catch (err) {
      console.error("Error fetching admin products:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This will delete all uploaded files and database records.")) return;
    setDeleteStatus("Deleting product...");
    try {
      const res = await fetch("/api/admin-product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeleteStatus("Product deleted successfully!");
        fetchAdminProducts();
        setTimeout(() => setDeleteStatus(""), 3000);
      } else {
        setDeleteStatus(`Error: ${data.error || "Failed to delete"}`);
      }
    } catch (err) {
      setDeleteStatus("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    if (activeTab === "products") {
      fetchAdminProducts();
    }
  }, [activeTab]);

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
        fetchAdminProducts();
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
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "settings" ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-black"}`}
              >
                Settings
              </button>
            </div>

            {activeTab === "orders" && (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={fetchOrders}
                  disabled={isRefreshing}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-full transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={exportCSV}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-full transition-colors w-full sm:w-auto"
                >
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
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
        ) : activeTab === "products" ? (
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

            <form ref={formRef} onSubmit={handleAddProduct} className="max-w-4xl mx-auto space-y-10">

              {/* Part 1: Product Settings */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <Box className="text-[#ff3366]" size={20} />
                  <h3 className="text-lg font-bold text-black tracking-tight">Basic Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Product Title *</label>
                    <input name="title" required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium" placeholder="e.g. Premium iWallet - Stealth Black" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Price (₹) *</label>
                    <input name="price" type="number" required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium" placeholder="1599" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Color / Variant</label>
                    <input name="color" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium" placeholder="e.g. Matte Black" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Collection Name</label>
                    <input name="collectionName" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium" placeholder="e.g. Collection 01" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Brand / Badge Label</label>
                    <input name="brand" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium" placeholder="e.g. theCarryClub Premium" />
                  </div>
                </div>
              </div>

              {/* Part 2: Product Copywriting */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <AlignLeft className="text-[#ff3366]" size={20} />
                  <h3 className="text-lg font-bold text-black tracking-tight">Copywriting & Description</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Description</label>
                    <textarea name="description" rows={3} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium resize-none" placeholder="General product description..."></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Tagline</label>
                    <input name="tagline" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium" placeholder="e.g. Bold. Matte. Timeless." />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Main Quote</label>
                    <input name="quote" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium" placeholder='e.g. "We really took the Apple Wallet App Logo..."' />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Sub-quote / Disclaimer</label>
                    <input name="subQuote" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium" placeholder='e.g. "Not an official apple product, obviously..."' />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex flex-col">
                    <span>Feature Bullet Points</span>
                    <span className="text-xs text-gray-400 font-medium mt-0.5">Enter one bullet point per line (e.g. Premium Vegan Leather)</span>
                  </label>
                  <textarea name="bullets" rows={4} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium resize-none" placeholder="Premium Vegan Leather&#10;Ultra-slim Profile&#10;Holds 6-8 Cards"></textarea>
                </div>
              </div>

              {/* Part 3: Media Upload */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <ImageIcon className="text-[#ff3366]" size={20} />
                  <h3 className="text-lg font-bold text-black tracking-tight">Product Media</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Product Images (Can upload multiple) *</label>
                    <input name="images" type="file" accept="image/*" multiple required className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-[#ff3366] hover:file:bg-rose-100 transition-all cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Product Video</label>
                    <input name="video" type="file" accept="video/*" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-gray-300 transition-all cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Submit Section */}
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

            {/* List of Published Products */}
            <div className="mt-16 border-t border-gray-100 pt-16">
              <h3 className="text-2xl font-black tracking-tighter text-center mb-8">Published Products ({adminProducts.length})</h3>

              {deleteStatus && (
                <p className="text-center font-bold text-sm text-[#ff3366] mb-6">{deleteStatus}</p>
              )}

              {isLoadingProducts ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="animate-spin text-[#ff3366]" size={36} />
                </div>
              ) : adminProducts.length === 0 ? (
                <p className="text-center text-gray-400 font-medium py-10">No products found. Publish a new product above!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {adminProducts.map((prod) => (
                    <div key={prod._id} className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
                      <div>
                        <div className="aspect-square bg-white rounded-xl overflow-hidden mb-4 relative border border-gray-100">
                          {prod.imageUrl ? (
                            <img src={prod.imageUrl} alt={prod.title} className="object-contain w-full h-full p-2" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                          )}
                        </div>
                        <h4 className="font-bold text-lg text-black leading-snug">{prod.title}</h4>
                        <p className="text-sm text-gray-500 font-bold mt-1">₹{prod.price}</p>
                        {prod.brand && (
                          <span className="inline-block bg-rose-50 text-[#ff3366] text-[10px] font-black uppercase px-2 py-0.5 rounded-md mt-2 tracking-widest">{prod.brand}</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="mt-6 w-full py-2.5 bg-rose-50 text-rose-600 hover:bg-[#ff3366] hover:text-white font-bold rounded-xl text-xs tracking-wider transition-all duration-300 uppercase"
                      >
                        Delete Product
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                <Settings size={30} className="text-[#ff3366]" strokeWidth={2.2} />
              </div>
              <h2 className="text-3xl font-black tracking-tighter">NimbusPost Integration</h2>
              <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">
                Configure your shipping aggregator credentials and warehouse details to enable direct fulfillment.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="max-w-4xl mx-auto space-y-10">

              {/* Credentials Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <ShieldCheck className="text-[#ff3366]" size={20} />
                  <h3 className="text-lg font-bold text-black tracking-tight">API Credentials</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nimbus Email Address</label>
                    <input
                      type="email"
                      required
                      value={nimbusEmail}
                      onChange={(e) => setNimbusEmail(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium text-black animate-fade-in"
                      placeholder="seller@domain.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nimbus Password</label>
                    <input
                      type="password"
                      required
                      value={nimbusPassword}
                      onChange={(e) => setNimbusPassword(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium text-black animate-fade-in"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center pt-2">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-black">Simulator Mode</p>
                      <p className="text-xs text-gray-400 font-medium">Test shipping flows without hitting live endpoints</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={nimbusIsSimulator}
                        onChange={(e) => setNimbusIsSimulator(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff3366]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-black">API Environment</p>
                      <p className="text-xs text-gray-400 font-medium">Use Sandbox (testing) or Production (live)</p>
                    </div>
                    <div className="flex bg-gray-200 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setNimbusMode("sandbox")}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${nimbusMode === "sandbox"
                            ? "bg-white text-black shadow-sm"
                            : "text-gray-500 hover:text-black"
                          }`}
                      >
                        Sandbox
                      </button>
                      <button
                        type="button"
                        onClick={() => setNimbusMode("production")}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${nimbusMode === "production"
                            ? "bg-white text-black shadow-sm"
                            : "text-gray-500 hover:text-black"
                          }`}
                      >
                        Production
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-xl text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Activity size={14} className={testingConnection ? "animate-spin" : ""} />
                    {testingConnection ? "TESTING..." : "TEST CONNECTION"}
                  </button>

                  {testResult && (
                    <div className="flex items-center gap-2 animate-fade-in">
                      {testResult.success ? (
                        <CheckCircle size={16} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={16} className="text-rose-500" />
                      )}
                      <p
                        className={`text-xs font-bold ${testResult.success ? "text-emerald-600" : "text-rose-600"
                          }`}
                      >
                        {testResult.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Warehouse Details Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <Truck className="text-[#ff3366]" size={20} />
                    <h3 className="text-lg font-bold text-black tracking-tight">Pickup / Warehouse Location</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchWarehouses}
                    disabled={isFetchingWarehouses || !nimbusEmail || !nimbusPassword}
                    className="px-4 py-2 bg-rose-50 text-[#ff3366] hover:bg-rose-100 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetchingWarehouses ? "FETCHING..." : "FETCH SAVED LOCATIONS"}
                  </button>
                </div>

                {fetchError && <p className="text-xs text-rose-500 font-bold">{fetchError}</p>}

                {warehousesList.length > 0 && (
                  <div className="space-y-2 p-4 bg-gray-50 border border-rose-100 rounded-xl mb-4 animate-fade-in">
                    <label className="text-sm font-bold text-rose-600">Select a Saved Warehouse</label>
                    <select
                      className="w-full p-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-[#ff3366] font-medium text-black"
                      onChange={(e) => {
                        if (e.target.selectedIndex === 0) return;
                        const w = warehousesList[e.target.selectedIndex - 1];
                        if (w) {
                          setNimbusPickupName(w.warehouse_name || w.name || "");
                          setNimbusPickupPhone(w.phone || w.contact_number || "");
                          setNimbusPickupAddress(w.address || w.address_line_1 || "");
                          setNimbusPickupCity(w.city || "");
                          setNimbusPickupState(w.state || "");
                          setNimbusPickupPincode(w.pincode || "");
                        }
                      }}
                    >
                      <option value="">-- Click to choose a warehouse --</option>
                      {warehousesList.map((w, i) => (
                        <option key={i} value={w.warehouse_name || w.name}>
                          {w.warehouse_name || w.name} ({w.city || "Unknown City"})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Warehouse Name</label>
                    <input
                      type="text"
                      required
                      value={nimbusPickupName}
                      onChange={(e) => setNimbusPickupName(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium text-black"
                      placeholder="e.g. Primary Delhi Warehouse"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Contact Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={nimbusPickupPhone}
                      onChange={(e) => setNimbusPickupPhone(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium text-black"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Warehouse Street Address</label>
                  <input
                    type="text"
                    required
                    value={nimbusPickupAddress}
                    onChange={(e) => setNimbusPickupAddress(e.target.value)}
                    className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium text-black"
                    placeholder="Floor, Building, Industrial Area"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">City</label>
                    <input
                      type="text"
                      required
                      value={nimbusPickupCity}
                      onChange={(e) => setNimbusPickupCity(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium text-black"
                      placeholder="New Delhi"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">State</label>
                    <input
                      type="text"
                      required
                      value={nimbusPickupState}
                      onChange={(e) => setNimbusPickupState(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium text-black"
                      placeholder="Delhi"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Pincode (Postal Code)</label>
                    <input
                      type="text"
                      required
                      value={nimbusPickupPincode}
                      onChange={(e) => setNimbusPickupPincode(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all font-medium text-black"
                      placeholder="110001"
                    />
                  </div>
                </div>
              </div>

              {/* Form Submission */}
              <div className="pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
                <button
                  disabled={savingSettings}
                  className="px-10 py-4 bg-black hover:bg-[#ff3366] text-white font-black rounded-full shadow-xl shadow-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto min-w-[250px] flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {savingSettings ? "SAVING..." : "SAVE CONFIGURATION"}
                </button>

                <AnimatePresence>
                  {saveStatus && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`font-bold text-sm ${saveStatus.includes("Error") ? "text-red-500" : "text-emerald-500"
                        }`}
                    >
                      {saveStatus}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
}