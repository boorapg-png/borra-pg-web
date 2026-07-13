"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { 
  Settings, 
  Building2, 
  UserCircle, 
  ShieldCheck, 
  Bell, 
  Save 
} from "lucide-react";

export default function SettingsManagement() {
  const { user, isAdmin, loading } = useAdmin();
  const router = useRouter();

  // Protect route
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/admin/login");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C9973A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#1A2744]">System Settings</h2>
        <p className="text-sm text-gray-500">Configure your property details and account preferences</p>
      </div>

      {/* Property Config */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
          <Building2 className="text-[#C9973A]" size={20} />
          <h3 className="font-bold text-[#1A2744]">Property Configuration</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Bed Capacity</label>
            <input type="number" defaultValue={120} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Rent Rate (₹)</label>
            <input type="number" defaultValue={6000} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
          <UserCircle className="text-[#1A2744]" size={20} />
          <h3 className="font-bold text-[#1A2744]">Admin Profile</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input type="text" defaultValue="Admin" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" defaultValue={user?.email || ""} disabled className="w-full px-4 py-2 border border-gray-100 bg-gray-50 rounded-lg text-sm text-gray-500" />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-[#1A2744] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A2744]/90 transition-colors">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}