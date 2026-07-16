import Link from "next/link";
import { Mail, Linkedin, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-300 py-12">
      <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-playfair text-2xl font-bold text-white mb-4">Boora PG</h3>
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
      
      {/* --- Updated Signature & Copyright Section --- */}
      <div className="container mx-auto px-4 max-w-6xl mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <p className="mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Boora PG. All rights reserved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <Code2 size={16} className="text-gray-500" />
            <span>
              Designed & Developed by <span className="font-semibold text-gray-200">Das Subham</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="mailto:thedassubham@gmail.com" 
              className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200"
              title="Email Developer"
            >
              <Mail size={18} />
              <span className="sr-only">Email Developer</span>
            </a>
            
            <a 
              href="https://linkedin.com/in/subham-das-25a307302" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200"
              title="Connect on LinkedIn"
            >
              <Linkedin size={18} />
              <span className="sr-only">LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}