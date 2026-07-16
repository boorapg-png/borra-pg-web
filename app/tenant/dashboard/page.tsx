// app/tenant/dashboard/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { User, Home, CreditCard, FileText, LifeBuoy, LogOut, Menu, X } from "lucide-react";
import { Tenant, PaymentRecord } from "../../../types";

// FIX: Moved NavItem OUTSIDE the main component and replaced 'any' with 'React.ElementType'
const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  isActive: boolean; 
  onClick: () => void; 
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'}`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export default function TenantDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data States
  const [tenantData, setTenantData] = useState<Tenant | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/tenant/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const docRef = doc(db, "tenants", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setTenantData(docSnap.data() as Tenant);
          }
          
          const paymentsRef = collection(db, "payments", user.uid, "records");
          const paymentSnaps = await getDocs(paymentsRef);
          const loadedPayments = paymentSnaps.docs.map(d => d.data() as PaymentRecord);
          setPayments(loadedPayments);
        } catch(err) {
          console.error("Error fetching data", err);
        } finally {
          setDataLoading(false);
        }
      }
    }
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/tenant/login");
  };

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  if (authLoading || dataLoading) return <div className="min-h-screen flex items-center justify-center bg-softgrey"><div className="text-xl font-bold text-navy animate-pulse">Loading Portal...</div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-softgrey flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-navy text-white p-4 flex justify-between items-center">
        <h1 className="font-playfair text-xl font-bold">Boora PG Portal</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border-r border-gray-200 p-4 shrink-0`}>
        <div className="hidden md:block mb-8 px-4">
          <h1 className="font-playfair text-2xl font-bold text-navy">Boora PG</h1>
          <p className="text-xs text-gray-500">Tenant Portal</p>
        </div>

        <nav className="space-y-2">
          {/* FIX: Updated NavItem props to match the new strict structure */}
          <NavItem icon={User} label="My Profile" isActive={activeTab === "profile"} onClick={() => handleNavClick("profile")} />
          <NavItem icon={Home} label="My Room" isActive={activeTab === "room"} onClick={() => handleNavClick("room")} />
          <NavItem icon={CreditCard} label="Payment History" isActive={activeTab === "payments"} onClick={() => handleNavClick("payments")} />
          <NavItem icon={FileText} label="My Documents" isActive={activeTab === "documents"} onClick={() => handleNavClick("documents")} />
          <NavItem icon={LifeBuoy} label="Support" isActive={activeTab === "support"} onClick={() => handleNavClick("support")} />
        </nav>

        <div className="mt-12 pt-4 border-t border-gray-200">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-navy mb-6 border-b pb-4">My Profile</h2>
              {tenantData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium">{tenantData.name}</p></div>
                  <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{tenantData.phone}</p></div>
                  <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{tenantData.email || "Not provided"}</p></div>
                  <div><p className="text-sm text-gray-500">Date of Birth</p><p className="font-medium">{tenantData.dob}</p></div>
                  <div><p className="text-sm text-gray-500">Aadhaar Number</p><p className="font-medium">XXXX-XXXX-{tenantData.aadhaarNumber.slice(-4)}</p></div>
                  <div><p className="text-sm text-gray-500">Emergency Contact</p><p className="font-medium text-red-600">{tenantData.emergencyContact}</p></div>
                  <div className="md:col-span-2"><p className="text-sm text-gray-500">Home Address</p><p className="font-medium">{tenantData.address || "Not provided"}</p></div>
                </div>
              ) : (
                 <p className="text-gray-500">No profile data found. Please contact admin.</p>
              )}
            </div>
          )}

          {/* ROOM TAB */}
          {activeTab === "room" && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-navy mb-6 border-b pb-4">My Accommodation</h2>
              {tenantData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><p className="text-sm text-gray-500">Building</p><p className="text-lg font-bold text-navy">{tenantData.accommodation.buildingName}</p></div>
                  <div><p className="text-sm text-gray-500">Room Number</p><p className="text-2xl font-bold text-gold">{tenantData.accommodation.roomNumber}</p></div>
                  <div><p className="text-sm text-gray-500">Bed Assigned</p><p className="font-medium">{tenantData.accommodation.bedLabel}</p></div>
                  <div><p className="text-sm text-gray-500">Move-in Date</p><p className="font-medium">{tenantData.joiningDate ? tenantData.joiningDate.toDate().toLocaleDateString("en-IN") : "N/A"}</p></div>
                  <div><p className="text-sm text-gray-500">Current Status</p><p className="font-medium capitalize">{tenantData.status}</p></div>
                </div>
              ) : (
                <p className="text-gray-500">No accommodation data found.</p>
              )}
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === "payments" && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-navy mb-6 border-b pb-4">Payment History</h2>
              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                        <th className="p-3 font-medium">Month</th>
                        <th className="p-3 font-medium">Amount</th>
                        <th className="p-3 font-medium">Mode</th>
                        <th className="p-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="p-3">{p.month}</td>
                          <td className="p-3 font-medium text-navy">₹{p.amount}</td>
                          <td className="p-3 capitalize">{p.paymentMode}</td>
                          <td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Paid</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No payment records found.</p>
              )}
            </div>
          )}

          {/* DOCUMENTS & SUPPORT TABS */}
          {activeTab === "documents" && (
             <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-2xl font-bold text-navy mb-6 border-b pb-4">My Documents</h2>
               <p className="text-gray-500">Your uploaded documents will appear here once verified by the admin.</p>
             </div>
          )}

          {activeTab === "support" && (
             <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-2xl font-bold text-navy mb-6 border-b pb-4">Support & Contact</h2>
               <p className="text-gray-600 mb-4">Need help or have a maintenance request? Reach out directly.</p>
               <div className="bg-softgrey p-4 rounded-lg mb-6 border border-gray-200">
                 <p className="font-bold text-navy">Owner Phone: 7696735209</p>
                 <p className="text-sm text-gray-500">Available Mon-Sat, 9 AM to 8 PM</p>
               </div>
               <button className="w-full bg-navy text-white py-3 rounded-lg font-bold hover:bg-opacity-90">Send an Email Request</button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}