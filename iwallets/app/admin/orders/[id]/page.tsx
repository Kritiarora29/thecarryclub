"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Copy, Check, ExternalLink, FileDown, RefreshCw, 
  Truck, Calendar, MapPin, User, Mail, Phone, ShoppingBag, 
  DollarSign, AlertTriangle, Loader2, CheckCircle2, Package, Star, ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

interface OrderAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

interface OrderDetailsType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: OrderAddress;
  items?: OrderItem[];
  amount: number;
  paymentId?: string;
  createdAt: string;
  nimbusShipmentId?: string;
  nimbusAwb?: string;
  nimbusCourier?: string;
  nimbusLabelUrl?: string;
  nimbusStatus?: string;
  nimbusShippedAt?: string;
}

interface CourierRate {
  courier_id: string;
  name: string;
  rate: number;
  expected_delivery: string;
  etd_days: number;
  service_type: string;
  rating: number;
}

interface TrackingEvent {
  status: string;
  activity: string;
  location: string;
  date: string;
  completed: boolean;
}

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  
  // States
  const [order, setOrder] = useState<OrderDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Nimbus Config State
  const [nimbusConfig, setNimbusConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  
  // Shipping Center Serviceability Rates
  const [rates, setRates] = useState<CourierRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState("");
  const [selectedCourier, setSelectedCourier] = useState<CourierRate | null>(null);
  
  // Shipping Book State
  const [bookingShipment, setBookingShipment] = useState(false);
  
  // Tracking State
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [trackingStatus, setTrackingStatus] = useState("");
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [trackingError, setTrackingError] = useState("");


  // 🔐 Auth check & initial fetch
  useEffect(() => {
    fetch("/api/admin-check").then((res) => {
      if (!res.ok) router.push("/");
    });
  }, [router]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/admin-orders/${id}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
      
      // If already shipped, fetch its tracking details immediately
      if (data.nimbusAwb && data.nimbusAwb !== "check_portal") {
        fetchTrackingDetails(data.nimbusAwb);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const fetchNimbusConfig = async () => {
    try {
      const res = await fetch("/api/nimbus/config");
      const data = await res.json();
      setNimbusConfig(data);
    } catch (err) {
      console.error("Error fetching Nimbus config:", err);
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
      fetchNimbusConfig();
    }
  }, [id]);

  // Fetch Courier serviceability rates
  const fetchServiceabilityRates = async () => {
    if (!id) return;
    setLoadingRates(true);
    setRatesError("");
    try {
      const res = await fetch("/api/nimbus/serviceability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to get courier rates");
      }
      setRates(data.couriers || []);
      if (data.couriers && data.couriers.length > 0) {
        setSelectedCourier(data.couriers[0]); // Select cheapest by default
      }
    } catch (err: any) {
      setRatesError(err.message || "Unable to check courier serviceability.");
      console.error(err);
    } finally {
      setLoadingRates(false);
    }
  };

  // Fetch Serviceability rates once configuration is confirmed loaded
  useEffect(() => {
    if (order && !order.nimbusAwb && nimbusConfig?.isConfigured) {
      fetchServiceabilityRates();
    }
  }, [order, nimbusConfig]);

  // Manifest shipment
  const handleBookShipment = async () => {
    if (!id || !selectedCourier || bookingShipment) return;
    setBookingShipment(true);
    try {
      const res = await fetch("/api/nimbus/ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: id,
          courierId: selectedCourier.courier_id,
          courierName: selectedCourier.name,
          rate: selectedCourier.rate,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to manifest shipment");
      }
      
      toast.success(data.message || "Shipment manifested successfully!");
      setOrder(data.order);
      if (data.order.nimbusAwb) {
        fetchTrackingDetails(data.order.nimbusAwb);
      }
    } catch (err: any) {
      toast.error(err.message || "Error Manifesting Shipment");
      console.error(err);
    } finally {
      setBookingShipment(false);
    }
  };


  // Fetch real-time tracking details
  const fetchTrackingDetails = async (awb: string) => {
    setLoadingTracking(true);
    setTrackingError("");
    try {
      const res = await fetch(`/api/nimbus/track?awb=${awb}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch tracking details");
      }
      setTrackingEvents(data.events || []);
      setTrackingStatus(data.status || "manifested");
    } catch (err: any) {
      setTrackingError(err.message || "Failed to sync tracking data.");
      console.error(err);
    } finally {
      setLoadingTracking(false);
    }
  };

  const handleCopyAwb = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopied(true);
    toast.success("AWB Number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get index of active tracking status
  const getStepIndex = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("delivered")) return 4;
    if (s.includes("out_for_delivery") || s.includes("out for delivery")) return 3;
    if (s.includes("in_transit") || s.includes("transit") || s.includes("dispatched")) return 2;
    if (s.includes("picked_up") || s.includes("picked up") || s.includes("pickup")) return 1;
    return 0; // manifested
  };

  const activeStep = getStepIndex(trackingStatus || order?.nimbusStatus || "manifested");

  // Identify cheapest and fastest couriers in rates list
  const cheapestRate = rates.length ? Math.min(...rates.map(r => r.rate)) : 0;
  const fastestEtd = rates.length ? Math.min(...rates.map(r => r.etd_days)) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center text-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#ff3366] mx-auto" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fafafa] p-6 md:p-12 text-black">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-[2rem] border border-gray-100 text-center shadow-sm space-y-6 mt-12">
          <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-black tracking-tight">Order Not Found</h2>
          <p className="text-gray-500 font-medium">The order details you are looking for do not exist or have been deleted.</p>
          <Link href="/admin" className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-[#ff3366] text-white font-bold rounded-full transition-colors">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-10 pb-24 text-black font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BREADCRUMB & BACK ACTION */}
        <div className="flex items-center justify-between">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-black font-bold rounded-full border border-gray-100 shadow-sm transition-all text-xs md:text-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Admin</span>
            <span>/</span>
            <span>Orders</span>
            <span>/</span>
            <span className="text-[#ff3366]">{order._id.toString().substring(0, 8)}...</span>
          </div>
        </div>

        {/* HEADER CARD */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl md:text-3xl font-black tracking-tighter">
                Order #{order._id.toString().toUpperCase()}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.paymentId === "COD" ? "bg-amber-50 text-amber-600 border border-amber-100" : order.paymentId ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
              }`}>
                {order.paymentId === "COD" ? "Cash on Delivery" : order.paymentId ? "Paid Prepaid" : "Pending Payment"}
              </span>
              {order.nimbusAwb && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                  <Truck size={12} />
                  Shipped
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-gray-500 font-medium flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="text-left md:text-right border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Total Order Value</p>
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-[#ff3366]">₹{order.amount.toLocaleString()}</h2>
          </div>
        </div>

        {/* MAIN BODY DETAILS & SHIPPING CENTER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2/3 COLUMN: ORDER DETAILS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CUSTOMER INFORMATION CARD */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#ff3366]">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Customer Information</h3>
                  <p className="text-xs text-gray-400 font-medium">Contact and shipping destination details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Info</h4>
                  <div className="space-y-3 font-medium">
                    <div className="flex items-center gap-3 text-sm">
                      <User size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="text-black font-bold">{order.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={16} className="text-gray-400 flex-shrink-0" />
                      <a href={`mailto:${order.email}`} className="text-[#ff3366] hover:underline break-all">{order.email}</a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={16} className="text-gray-400 flex-shrink-0" />
                      <a href={`tel:${order.phone}`} className="text-gray-600 hover:text-black">{order.phone}</a>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shipping Address</h4>
                  <div className="space-y-3 font-medium">
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-black font-bold">{order.address?.street || "No street address set"}</p>
                        {order.address?.landmark && (
                          <p className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded inline-block">
                            Landmark: {order.address.landmark}
                          </p>
                        )}
                        <p className="text-gray-600 text-sm">
                          {order.address?.city}, {order.address?.state} - <span className="font-mono font-bold">{order.address?.pincode}</span>
                        </p>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">India</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER ITEMS CARD */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#ff3366]">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Items Ordered</h3>
                  <p className="text-xs text-gray-400 font-medium">Breakdown of purchased products</p>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm md:text-base text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm md:text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-gray-400 font-medium">₹{item.price} each</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 py-4 font-medium">No items registered for this order.</p>
                )}
              </div>

              {/* Order Summary Pricing */}
              <div className="pt-6 border-t border-gray-100 space-y-3 text-sm">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>₹{order.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping Aggregator (NimbusPost)</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-wider text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Free / Included
                  </span>
                </div>
                <div className="flex justify-between text-black font-black text-lg pt-3 border-t border-gray-50">
                  <span>Total Amount</span>
                  <span className="text-[#ff3366]">₹{order.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* TRANSACTION DETAILS CARD */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Transaction Metadata</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Payment Gateway</p>
                  <p className="text-black font-bold flex items-center gap-1">
                    <DollarSign size={14} className="text-emerald-500" />
                    {order.paymentId === "COD" ? "Cash on Delivery" : "Razorpay Online Payments"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Payment ID</p>
                  <p className="font-mono text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-100 inline-block max-w-full truncate">
                    {order.paymentId || "N/A (Pre-checkout)"}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 1/3 COLUMN: NIMBUS SHIPPING CENTER */}
          <div className="space-y-8">
            
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 sticky top-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <Truck className="text-[#ff3366]" size={22} />
                  <h3 className="text-lg font-black tracking-tight">Nimbus Shipping</h3>
                </div>

                {nimbusConfig?.isConfigured && nimbusConfig?.isSimulator && (
                  <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-200 text-yellow-600 font-black rounded text-[9px] uppercase tracking-wider">
                    Simulator Mode
                  </span>
                )}
              </div>

              {/* A. Loading Config */}
              {loadingConfig ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading shipping settings...</p>
                </div>
              ) : !nimbusConfig?.isConfigured ? (
                /* B. Not Configured State */
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl text-center space-y-3">
                    <AlertTriangle className="w-10 h-10 text-[#ff3366] mx-auto" />
                    <h4 className="font-black text-rose-950 text-sm">NimbusPost Integration Incomplete</h4>
                    <p className="text-xs text-rose-700 font-medium leading-relaxed">
                      API credentials and default warehouse locations are not set up. Please configure these in settings first.
                    </p>
                  </div>
                  <Link 
                    href="/admin" 
                    className="w-full py-3 bg-black hover:bg-[#ff3366] text-white font-black text-xs text-center rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    Go to Settings Tab
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : !order.nimbusAwb ? (
                /* C. Unshipped State: Fetch and display courier quotes */
                <div className="space-y-6">
                  
                  {/* Pincode Info summary */}
                  <div className="text-xs font-medium text-gray-500 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Origin:</span>
                      <span className="text-black font-bold font-mono">{nimbusConfig.pickupPincode} ({nimbusConfig.pickupCity})</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Destination:</span>
                      <span className="text-black font-bold font-mono">{order.address?.pincode} ({order.address?.city})</span>
                    </div>
                  </div>

                  {/* Rates Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Services</h4>
                      <button 
                        onClick={fetchServiceabilityRates} 
                        disabled={loadingRates}
                        className="text-[10px] font-black text-[#ff3366] hover:underline flex items-center gap-1 disabled:opacity-50"
                      >
                        <RefreshCw size={10} className={loadingRates ? "animate-spin" : ""} />
                        Refresh
                      </button>
                    </div>

                    {loadingRates ? (
                      /* Rates Loading Skeleton */
                      <div className="space-y-2.5 animate-pulse">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="h-16 bg-gray-50 border border-gray-100 rounded-2xl" />
                        ))}
                      </div>
                    ) : ratesError ? (
                      /* Rates Error State */
                      <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-center space-y-3">
                        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                        <p className="text-xs text-amber-800 font-bold leading-relaxed">{ratesError}</p>
                        <button 
                          onClick={fetchServiceabilityRates}
                          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-black font-bold text-xs rounded-full transition-colors inline-block"
                        >
                          Retry Serviceability
                        </button>
                      </div>
                    ) : rates.length > 0 ? (
                      /* Rates List */
                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {rates.map((rate) => {
                          const isSelected = selectedCourier?.courier_id === rate.courier_id;
                          const isCheapest = rate.rate === cheapestRate;
                          const isFastest = rate.etd_days === fastestEtd;

                          return (
                            <div 
                              key={rate.courier_id}
                              onClick={() => setSelectedCourier(rate)}
                              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                                isSelected 
                                  ? "border-[#ff3366] bg-rose-50/20 shadow-sm" 
                                  : "border-gray-100 bg-white hover:border-gray-300"
                              }`}
                            >
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-sm font-black text-gray-900 truncate">{rate.name}</p>
                                  {isCheapest && (
                                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 font-black rounded text-[8px] uppercase tracking-wider">
                                      Cheapest
                                    </span>
                                  )}
                                  {isFastest && !isCheapest && (
                                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 font-black rounded text-[8px] uppercase tracking-wider">
                                      Fastest
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                  <span className="flex items-center gap-0.5">
                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                    {rate.rating}
                                  </span>
                                  <span>•</span>
                                  <span>EDD: {rate.expected_delivery}</span>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-sm font-black text-black">₹{rate.rate.toFixed(1)}</p>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{rate.service_type}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 font-medium text-center py-4">No couriers available for this route.</p>
                    )}
                  </div>

                  {/* Ship trigger button */}
                  <button
                    onClick={handleBookShipment}
                    disabled={bookingShipment || !selectedCourier || rates.length === 0}
                    className="w-full py-4 bg-black hover:bg-[#ff3366] text-white font-black text-xs text-center rounded-full transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingShipment ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Generating AWB & Booking...
                      </>
                    ) : (
                      <>
                        <Truck size={16} />
                        Ship via {selectedCourier?.name || "NimbusPost"}
                      </>
                    )}
                  </button>

                </div>
              ) : (
                /* D. Shipped State: Display shipment information & tracking */
                <div className="space-y-6">
                    {/* Sync success banner */}
                  {order.nimbusAwb === "check_portal" ? (
                    <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col gap-1 text-amber-800 text-xs font-bold shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
                        <span>Successfully added to Nimbus portal!</span>
                      </div>
                      <p className="text-[10px] text-amber-700 font-semibold pl-6.5 leading-relaxed">
                        Please check Nimbus portal for shipment.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-bold shadow-sm">
                      <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                      <span>Order added to Nimbus portal successfully!</span>
                    </div>
                  )}

                  {/* AWB & Info Box */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-3.5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Courier Partner</p>
                        <p className="text-sm font-black text-gray-900">{order.nimbusCourier}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black rounded-full uppercase tracking-wider">
                        {order.nimbusAwb === "check_portal" ? "Pending" : (trackingStatus || order.nimbusStatus)}
                      </span>
                    </div>

                    <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AWB Number</p>
                        <p className="font-mono text-xs font-black text-black">
                          {order.nimbusAwb === "check_portal" ? "Check Nimbus Portal" : order.nimbusAwb}
                        </p>
                      </div>
                      {order.nimbusAwb !== "check_portal" && (
                        <button 
                          onClick={() => handleCopyAwb(order.nimbusAwb || "")}
                          className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 hover:text-black transition-colors"
                          title="Copy AWB Number"
                        >
                          {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                        </button>
                      )}
                    </div>

                    {order.nimbusShippedAt && order.nimbusAwb !== "check_portal" && (
                      <div className="text-[10px] text-gray-400 font-semibold border-t border-gray-100 pt-3 flex justify-between">
                        <span>SHIPPED DATE:</span>
                        <span>{new Date(order.nimbusShippedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    )}
                  </div>

                  {/* Label Download Button */}
                  {order.nimbusLabelUrl && (
                    <a
                      href={order.nimbusLabelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-black border border-gray-200 font-black text-xs text-center rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <FileDown size={15} />
                      Download Shipping Label
                      <ExternalLink size={12} className="text-gray-400" />
                    </a>
                  )}

                  {/* Stepper Progress Bar */}
                  {order.nimbusAwb !== "check_portal" && (
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shipment Progress</h4>
                      
                      <div className="relative flex justify-between items-center w-full px-2">
                        {/* Gray track background line */}
                        <div className="absolute top-[9px] left-4 right-4 h-0.5 bg-gray-100 -z-10" />
                        
                        {/* Active track green line */}
                        <div 
                          className="absolute top-[9px] left-4 h-0.5 bg-[#ff3366] transition-all duration-500 -z-10"
                          style={{ width: `${(activeStep / 4) * 90}%` }}
                        />

                        {/* Stepper dots */}
                        {["Manifested", "Picked Up", "In Transit", "Out for Delivery", "Delivered"].map((stepLabel, idx) => {
                          const isDone = idx <= activeStep;
                          const isCurrent = idx === activeStep;

                          return (
                            <div key={idx} className="flex flex-col items-center space-y-1.5 flex-1 text-center">
                              <div 
                                className={`w-[20px] h-[20px] rounded-full border-4 flex items-center justify-center transition-all ${
                                  isDone 
                                    ? isCurrent 
                                      ? "bg-white border-[#ff3366] scale-110 shadow-sm shadow-[#ff3366]/40" 
                                      : "bg-[#ff3366] border-[#ff3366]"
                                    : "bg-white border-gray-200"
                                }`}
                              >
                                {isDone && !isCurrent && <CheckCircle2 className="w-3 h-3 text-white fill-white" />}
                              </div>
                              <span 
                                className={`text-[8px] font-bold tracking-tight uppercase max-w-[60px] truncate ${
                                  isCurrent ? "text-black font-black" : isDone ? "text-gray-500" : "text-gray-300"
                                }`}
                                title={stepLabel}
                              >
                                {stepLabel.split(" ")[0]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tracking Log timeline */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tracking Logs</h4>
                      {order.nimbusAwb !== "check_portal" && (
                        <button
                          onClick={() => fetchTrackingDetails(order.nimbusAwb || "")}
                          disabled={loadingTracking}
                          className="p-1 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 text-gray-400 hover:text-black"
                          title="Sync from courier API"
                        >
                          <RefreshCw size={12} className={loadingTracking ? "animate-spin" : ""} />
                        </button>
                      )}
                    </div>

                    {order.nimbusAwb === "check_portal" ? (
                      <p className="text-xs text-gray-400 font-medium text-center py-4">
                        Courier booking pending. Please complete the booking directly on your NimbusPost portal.
                      </p>
                    ) : loadingTracking ? (
                      /* Tracking loader */
                      <div className="flex justify-center items-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-[#ff3366]" />
                      </div>
                    ) : trackingError ? (
                      <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-2xl text-center text-xs text-rose-700 font-medium">
                        {trackingError}
                      </div>
                    ) : trackingEvents.length > 0 ? (
                      <div className="relative pl-5 border-l border-gray-100 space-y-4 text-xs">
                        {trackingEvents.map((evt, idx) => (
                          <div key={idx} className="relative space-y-1">
                            {/* Dot indicator */}
                            <span className={`absolute -left-[25px] top-1.5 w-2 h-2 rounded-full border-2 ${
                              idx === 0 
                                ? "bg-[#ff3366] border-[#ff3366] ring-4 ring-rose-100" 
                                : "bg-white border-gray-300"
                            }`} />
                            
                            <p className="font-bold text-gray-900 leading-tight">{evt.activity}</p>
                            
                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 font-medium">
                              {evt.location && (
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-semibold">{evt.location}</span>
                              )}
                              <span>{evt.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 font-medium text-center py-4">No tracking history registered yet.</p>
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}