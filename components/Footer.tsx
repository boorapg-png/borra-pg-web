import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-300 py-12">
      <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-playfair text-2xl font-bold text-white mb-4">Borra PG</h3>
          <p className="mb-4">Premium paying guest accommodation near IT Park, Panchkula. Where comfort meets community.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-gold transition">Home</Link></li>
            <li><Link href="#amenities" className="hover:text-gold transition">Amenities</Link></li>
            <li><Link href="/tenant/login" className="hover:text-gold transition">Tenant Portal</Link></li>
            <li><Link href="/admin/login" className="hover:text-gold transition">Admin Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Contact Us</h4>
          <p className="mb-2">Phone: 7696735209</p>
          <p>MDC Sector 4, Panchkula,<br/>Haryana 134114</p>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-6xl mt-8 pt-8 border-t border-gray-700 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Borra PG. All rights reserved.</p>
      </div>
    </footer>
  );
}