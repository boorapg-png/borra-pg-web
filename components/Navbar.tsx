"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide the public navbar if we are inside the admin or tenant portals
  if (pathname.startsWith("/admin") || pathname.startsWith("/tenant")) {
    return null;
  }

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-playfair text-3xl font-bold text-navy tracking-tight">
              Boora PG
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gold transition">Home</Link>
            <Link href="#amenities" className="text-gray-700 hover:text-gold transition">Amenities</Link>
            <Link href="#location" className="text-gray-700 hover:text-gold transition">Location</Link>
            <Link href="#enquire" className="text-gray-700 hover:text-gold transition">Enquire</Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <Link href="/tenant/login" className="font-medium text-navy hover:text-gold transition">Tenant Login</Link>
            <Link href="/admin/login" className="text-sm text-gray-400 hover:text-navy transition">Admin</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-navy focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col text-center">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-gold" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="#amenities" className="block px-3 py-2 text-gray-700 hover:text-gold" onClick={() => setIsOpen(false)}>Amenities</Link>
            <Link href="#location" className="block px-3 py-2 text-gray-700 hover:text-gold" onClick={() => setIsOpen(false)}>Location</Link>
            <Link href="#enquire" className="block px-3 py-2 text-gray-700 hover:text-gold" onClick={() => setIsOpen(false)}>Enquire</Link>
            <hr className="my-2 border-gray-100" />
            <Link href="/tenant/login" className="block px-3 py-2 font-medium text-navy" onClick={() => setIsOpen(false)}>Tenant Login</Link>
            <Link href="/admin/login" className="block px-3 py-2 font-medium text-gray-400" onClick={() => setIsOpen(false)}>Admin</Link>
          </div>
        </div>
      )}
    </nav>
  );
}