"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "../../../hooks/useAdmin";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { LayoutDashboard, Users, UserPlus, Receipt, Wallet, LogOut, Menu, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', Revenue: 45000, Expenses: 12000 },
  { name: 'Feb', Revenue: 52000, Expenses: 18000 },
  { name: 'Mar', Revenue: 48000, Expenses: 15000 },
];

export default function AdminDashboard() {
  const { user, isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!adminLoading && (!user || !isAdmin)) {
      router.push("/admin/login");
    }
  }, [user, isAdmin, adminLoading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (adminLoading) return <div className="min-h-screen flex items-center justify-center bg-softgrey"><div className="text-xl font-bold text-navy">Loading Secure Environment...</div></div>;
  if (!user || !isAdmin) return null;

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === id ? 'bg-gold text-white' : 'text-gray-300 hover:bg-white/10'}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-softgrey flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-navy text-white p-4 flex justify-between items-center">
        <h1 className="font-playfair text-xl font-bold text-gold">Admin Portal</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-navy text-white p-4 shrink-0 shadow-xl z-10`}>
        <div className="hidden md:block mb-8 px-4 mt-4">
          <h1 className="font-playfair text-3xl font-bold text-gold">Borra PG</h1>
          <p className="text-xs text-gray-400 mt-1">Owner Dashboard</p>
        </div>

        <nav className="space-y-2 mt-8">
          <NavItem id="overview" icon={LayoutDashboard} label="Overview" />
          <NavItem id="tenants" icon={Users} label="All Tenants" />
          <NavItem id="add-tenant" icon={UserPlus} label="Add Tenant" />
          <NavItem id="paybook" icon={Receipt} label="Paybook" />
          <NavItem id="expenses" icon={Wallet} label="Expenses Tracker" />
        </nav>

        <div className="mt-12 pt-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-lg transition">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-3xl font-bold text-navy mb-8">Dashboard Overview</h2>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-gold">
                  <p className="text-sm text-gray-500 mb-1">Total Tenants</p>
                  <p className="text-3xl font-bold text-navy">24</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                  <p className="text-sm text-gray-500 mb-1">Rooms Occupied</p>
                  <p className="text-3xl font-bold text-navy">18</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                  <p className="text-sm text-gray-500 mb-1">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-navy">₹1,45,000</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
                  <p className="text-sm text-gray-500 mb-1">Pending Dues</p>
                  <p className="text-3xl font-bold text-navy">₹12,500</p>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-navy mb-6">Revenue vs Expenses</h3>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="Revenue" fill="#1A2744" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Expenses" fill="#C9973A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS (Placeholders for now) */}
          {activeTab === "tenants" && (
             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-2xl font-bold text-navy mb-6">Tenant Directory</h2>
               <p className="text-gray-500">Your list of active tenants will appear here.</p>
             </div>
          )}

          {activeTab === "add-tenant" && (
             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-2xl font-bold text-navy mb-6">Register New Tenant</h2>
               <p className="text-gray-500">Form to add new tenants to the database will go here.</p>
             </div>
          )}

          {activeTab === "paybook" && (
             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-2xl font-bold text-navy mb-6">Payment Ledger</h2>
               <p className="text-gray-500">Record and track rent payments here.</p>
             </div>
          )}

          {activeTab === "expenses" && (
             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-2xl font-bold text-navy mb-6">Expense Tracker</h2>
               <p className="text-gray-500">Log PG maintenance and food expenses here.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}