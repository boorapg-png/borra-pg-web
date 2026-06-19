"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Hide the public navbar if we are inside the admin or tenant portals
  if (pathname.startsWith("/admin") || pathname.startsWith("/tenant")) {
    return null;
  }

  // ... the rest of your existing code stays exactly the same!
  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="font-playfair text-3xl font-bold text-navy">
              Borra PG
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-700 hover:text-gold transition">Home</Link>
            <Link href="#amenities" className="text-gray-700 hover:text-gold transition">Amenities</Link>
            <Link href="#location" className="text-gray-700 hover:text-gold transition">Location</Link>
            <Link href="#enquire" className="text-gray-700 hover:text-gold transition">Enquire</Link>
            <div className="flex space-x-4 border-l pl-4 border-gray-300">
              <Link href="/tenant/login" className="text-sm font-medium text-navy hover:text-gold">Tenant Login</Link>
              <Link href="/admin/login" className="text-sm font-medium text-gray-400 hover:text-navy">Admin</Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-navy">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col text-center">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-gold" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="#amenities" className="block px-3 py-2 text-gray-700 hover:text-gold" onClick={() => setIsOpen(false)}>Amenities</Link>
            <Link href="#location" className="block px-3 py-2 text-gray-700 hover:text-gold" onClick={() => setIsOpen(false)}>Location</Link>
            <Link href="#enquire" className="block px-3 py-2 text-gray-700 hover:text-gold" onClick={() => setIsOpen(false)}>Enquire</Link>
            <hr className="my-2" />
            <Link href="/tenant/login" className="block px-3 py-2 font-medium text-navy" onClick={() => setIsOpen(false)}>Tenant Login</Link>
            <Link href="/admin/login" className="block px-3 py-2 font-medium text-gray-400" onClick={() => setIsOpen(false)}>Admin Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}