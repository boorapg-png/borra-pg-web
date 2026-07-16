"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, Users, IndianRupee, TrendingUp, 
  TrendingDown, AlertCircle, Loader2, Wallet, 
  Activity, ArrowUpRight, ArrowDownRight 
} from "lucide-react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bed, Payment, Expense, Bill } from "@/types";

const INR = (n: number) => "₹" + n.toLocaleString("en-IN");

interface DashboardStats {
  totalBeds: number;
  occupiedBeds: number;
  revenueThisMonth: number;
  expensesThisMonth: number;
  pendingDues: number;
}

export default function MasterDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const currentMonthString = now.toISOString().slice(0, 7); // "YYYY-MM"

        // 1. Fetch Occupancy (Beds)
        const bedsSnap = await getDocs(collection(db, "beds"));
        let totalBeds = 0;
        let occupiedBeds = 0;
        bedsSnap.forEach((doc) => {
          totalBeds++;
          if (doc.data().status === "occupied") occupiedBeds++;
        });

        // 2. Fetch Revenue (Payments this month)
        const paymentsQuery = query(
          collection(db, "payments"),
          where("paymentDate", ">=", Timestamp.fromDate(startOfMonth)),
          where("paymentDate", "<=", Timestamp.fromDate(endOfMonth))
        );
        const paymentsSnap = await getDocs(paymentsQuery);
        const revenueThisMonth = paymentsSnap.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

        // 3. Fetch Expenses (Expenses this month)
        const expensesQuery = query(
          collection(db, "expenses"),
          where("date", ">=", Timestamp.fromDate(startOfMonth)),
          where("date", "<=", Timestamp.fromDate(endOfMonth))
        );
        const expensesSnap = await getDocs(expensesQuery);
        const expensesThisMonth = expensesSnap.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

        // 4. Fetch Pending Dues (Bills for this month that aren't fully paid)
        const billsQuery = query(
          collection(db, "bills"),
          where("month", "==", currentMonthString)
        );
        const billsSnap = await getDocs(billsQuery);
        const pendingDues = billsSnap.docs.reduce((sum, doc) => sum + (doc.data().balance || 0), 0);

        setStats({
          totalBeds,
          occupiedBeds,
          revenueThisMonth,
          expensesThisMonth,
          pendingDues
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading || !stats) {
    return <div className="h-full flex items-center justify-center text-navy"><Loader2 className="animate-spin" size={32} /></div>;
  }

  const occupancyRate = stats.totalBeds === 0 ? 0 : Math.round((stats.occupiedBeds / stats.totalBeds) * 100);
  const netProfit = stats.revenueThisMonth - stats.expensesThisMonth;
  const profitMargin = stats.revenueThisMonth === 0 ? 0 : Math.round((netProfit / stats.revenueThisMonth) * 100);

  return (
    <div className="flex flex-col h-full space-y-6 p-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Admin Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Here is what is happening with your property today.</p>
      </div>

      {/* TOP ROW: Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Profit Card */}
        <div className="bg-gradient-to-br from-navy to-navy/90 p-6 rounded-2xl shadow-md text-white border border-navy/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Wallet size={64} /></div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">Net Profit (This Month)</h3>
            <div className="text-3xl font-bold mt-2">{INR(netProfit)}</div>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium">
              <span className={`flex items-center gap-1 px-2 py-1 rounded bg-white/10 ${netProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {netProfit >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {profitMargin}% Margin
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Revenue</h3>
              <div className="text-2xl font-bold text-gray-900 mt-2">{INR(stats.revenueThisMonth)}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 font-medium">Collections for current month</p>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Expenses</h3>
              <div className="text-2xl font-bold text-gray-900 mt-2">{INR(stats.expensesThisMonth)}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <TrendingDown size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 font-medium">Operational outflow this month</p>
        </div>

        {/* Pending Dues Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pending Dues</h3>
              <div className="text-2xl font-bold text-red-600 mt-2">{INR(stats.pendingDues)}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 font-medium">Uncollected rent this month</p>
        </div>
      </div>

      {/* SECOND ROW: Occupancy & Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        
        {/* Occupancy Dashboard */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="text-navy" size={20} />
            <h2 className="text-lg font-bold text-navy">Property Occupancy</h2>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <div className="text-5xl font-bold text-gray-900">{occupancyRate}%</div>
              <div className="text-sm font-bold text-gray-500 mb-1">{stats.occupiedBeds} / {stats.totalBeds} Beds Filled</div>
            </div>
            
            {/* Custom Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-4 mb-6 overflow-hidden border border-gray-200">
              <div 
                className="bg-gold h-4 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${occupancyRate}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-1">
                  <Users size={16} /> Occupied Beds
                </div>
                <div className="text-2xl font-bold text-navy">{stats.occupiedBeds}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-1">
                  <Activity size={16} /> Available Beds
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.totalBeds - stats.occupiedBeds}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions / Getting Started */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-navy mb-6">System Health & Quick Links</h2>
          
          <div className="space-y-3">
            <a href="/admin/dashboard/building" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy/5 text-navy flex items-center justify-center group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Manage Properties</div>
                  <div className="text-xs text-gray-500">Add or edit buildings and rooms</div>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-gray-300 group-hover:text-gold transition-colors" />
            </a>

            <a href="/admin/dashboard/tenants" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy/5 text-navy flex items-center justify-center group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                  <Users size={18} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Tenant Directory</div>
                  <div className="text-xs text-gray-500">Register new paying guests</div>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-gray-300 group-hover:text-gold transition-colors" />
            </a>

            <a href="/admin/dashboard/payments" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy/5 text-navy flex items-center justify-center group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                  <IndianRupee size={18} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Collect Rent</div>
                  <div className="text-xs text-gray-500">Record payments and clear dues</div>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-gray-300 group-hover:text-gold transition-colors" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}