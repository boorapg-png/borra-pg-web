"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase"; // Adjust path if needed based on your folder structure
import { 
  LayoutDashboard, Building2, Users, IndianRupee, BookOpen, 
  TrendingUp, CalendarDays, LogOut, UserCheck, Settings, Menu, Bell
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Building", href: "/admin/dashboard/building", icon: Building2 },
    { name: "Tenants", href: "/admin/dashboard/tenants", icon: Users },
    { name: "Payments", href: "/admin/dashboard/payments", icon: IndianRupee },
    { name: "Ledger", href: "/admin/dashboard/ledger", icon: BookOpen },
    { name: "Expenses", href: "/admin/dashboard/expenses", icon: TrendingUp },
    { name: "Bookings", href: "/admin/dashboard/bookings", icon: CalendarDays },
    { name: "Staff", href: "/admin/dashboard/staff", icon: UserCheck },
    { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F6FA] text-[#111827]">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#1A2744] text-white transition-all duration-300 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-center border-b border-white/10 shrink-0">
          <h1 className="font-bold text-xl text-[#C9973A] whitespace-nowrap overflow-hidden">
            {isSidebarOpen ? "BOORA PG" : "BPG"}
          </h1>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-[#C9973A]/10 text-[#C9973A] border-l-4 border-[#C9973A]" 
                        : "text-gray-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                    }`}
                  >
                    <item.icon size={20} className="shrink-0" />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-300 hover:text-white w-full px-3 py-2 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-[#1A2744] transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-semibold text-xl">Admin Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-[#1A2744] transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#1A2744] text-[#C9973A] flex items-center justify-center font-bold">
                A
              </div>
              <span className="font-medium text-sm hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content (This is where page.tsx gets injected) */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}