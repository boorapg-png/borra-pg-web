import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* TODO: Replace with real property image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-navy/60"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-6 drop-shadow-lg">
          Premium Living Near IT Park, Panchkula
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light">
          AC Rooms | 3 Meals | Pool | Wi-Fi | 24x7 Security
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="#enquire" className="px-8 py-4 bg-gold text-white font-bold rounded shadow-lg hover:bg-yellow-600 transition">
            Enquire Now
          </Link>
          <Link href="#amenities" className="px-8 py-4 bg-white/20 text-white font-bold rounded backdrop-blur-sm border border-white/50 hover:bg-white/30 transition">
            View Amenities
          </Link>
        </div>
      </div>
    </div>
  );
}