"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../hooks/useAdmin";
import { 
  BedDouble, 
  Users, 
  DoorOpen, 
  CalendarClock, 
  LogOut,
  IndianRupee, 
  Wallet, 
  AlertCircle, 
  Activity
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from "recharts";

// --- MOCK DATA FOR UI VISUALIZATION ---
const financialChartData = [
  { name: "Jan", revenue: 120000, expenses: 45000 },
  { name: "Feb", revenue: 125000, expenses: 42000 },
  { name: "Mar", revenue: 130000, expenses: 50000 },
  { name: "Apr", revenue: 128000, expenses: 48000 },
  { name: "May", revenue: 135000, expenses: 55000 },
  { name: "Jun", revenue: 142000, expenses: 47000 },
];

const overduePayments = [
  { id: 1, name: "Rahul Kumar", room: "101", due: 5500, days: 12 },
  { id: 2, name: "Amit Singh", room: "205", due: 6200, days: 5 },
  { id: 3, name: "Priya Sharma", room: "302", due: 12400, days: 35 },
];

const upcomingCheckouts = [
  { id: 1, name: "Sandeep Verma", room: "104", date: "18 Jul 2026", daysLeft: 4 },
  { id: 2, name: "Neha Gupta", room: "201", date: "25 Jul 2026", daysLeft: 11 },
];

const recentActivity = [
  { id: 1, log: "Payment of ₹6,000 recorded for Aman (Room 102)", time: "2 hours ago" },
  { id: 2, log: "New tenant added: Vikram (Room 304)", time: "5 hours ago" },
  { id: 3, log: "Checkout initiated for Sandeep (Room 104)", time: "1 day ago" },
];

export default function AdminDashboard() {
  const { user, isAdmin, loading, adminLoading } = useAdmin();
  const router = useRouter();

  // Protect the route: Redirect if not logged in or not an admin
  useEffect(() => {
    if (!loading && !adminLoading && (!user || !isAdmin)) {
      router.push("/admin/login");
    }
  }, [user, isAdmin, loading, adminLoading, router]);

  // Show a clean loading state while Firebase checks credentials
  if (loading || adminLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#C9973A] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#1A2744] font-medium">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // Prevent flashing the UI before the redirect happens
  if (!user || !isAdmin) return null;

  return (
    <div className="space-y-6">
      
      {/* ROW 1: Occupancy KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KpiCard title="Total Capacity" value="120" subtext="Beds across 2 blocks" icon={BedDouble} color="bg-blue-100 text-blue-700" />
        <KpiCard title="Occupied" value="98" subtext="81% filled" icon={Users} color="bg-red-100 text-red-700" />
        <KpiCard title="Available" value="15" subtext="Ready to rent" icon={DoorOpen} color="bg-green-100 text-green-700" />
        <KpiCard title="Reserved" value="4" subtext="Advance paid" icon={CalendarClock} color="bg-amber-100 text-amber-700" />
        <KpiCard title="On Notice" value="3" subtext="Leaving soon" icon={LogOut} color="bg-orange-100 text-orange-700" />
      </div>

      {/* ROW 2: Financial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Expected Revenue" value="₹1,45,000" subtext="This month" icon={IndianRupee} color="bg-[#1A2744]/10 text-[#1A2744]" />
        <KpiCard title="Collected" value="₹1,20,500" subtext="83% collected" icon={Wallet} color="bg-green-100 text-green-700" />
        <KpiCard title="Pending Dues" value="₹24,500" subtext="Across 8 tenants" icon={AlertCircle} color="bg-red-100 text-red-700" />
      </div>

      {/* ROW 3: Overdue & Checkouts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Overdue Payments (60% width) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-3">
          <h3 className="font-bold text-[#1A2744] mb-4">Overdue Payments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="pb-3 font-medium">Tenant</th>
                  <th className="pb-3 font-medium">Room</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Days Overdue</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {overduePayments.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 text-gray-600">{item.room}</td>
                    <td className="py-3 font-semibold text-red-600">₹{item.due.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.days > 30 ? 'bg-red-100 text-red-700' : 
                        item.days > 7 ? 'bg-orange-100 text-orange-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.days} days
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-[#C9973A] hover:underline font-medium text-sm">Record</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Checkouts (40% width) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
          <h3 className="font-bold text-[#1A2744] mb-4">Upcoming Checkouts</h3>
          <div className="space-y-4">
            {upcomingCheckouts.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">Room {item.room} • {item.date}</p>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded ${
                  item.daysLeft <= 7 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {item.daysLeft} days left
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 4 & 5: Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Financial Chart (Spans 2 columns) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
          <h3 className="font-bold text-[#1A2744] mb-6">Revenue vs Expenses (6 Months)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialChartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip cursor={{fill: '#F5F6FA'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                <Bar dataKey="revenue" name="Revenue" fill="#C9973A" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expenses" name="Expenses" fill="#1A2744" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed (1 column) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-[#C9973A]" />
            <h3 className="font-bold text-[#1A2744]">Recent Activity</h3>
          </div>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {recentActivity.map((item) => (
              <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-[#1A2744] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mr-3 md:mx-auto"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-gray-100 bg-gray-50 shadow-sm">
                  <p className="text-xs text-gray-800 font-medium">{item.log}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable mini-component for the KPI cards with strict TypeScript types
interface KpiCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  color: string;
}

function KpiCard({ title, value, subtext, icon: Icon, color }: KpiCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 mb-1">{value}</h4>
        <p className="text-xs text-gray-500">{subtext}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}