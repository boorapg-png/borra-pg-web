import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-20 bg-white" id="about">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-playfair font-bold text-navy mb-6">Welcome to Boora PG</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Experience the perfect blend of comfort, community, and convenience. Designed specifically for working professionals, Boora PG offers a premium hospitality experience so you can focus on your career while we take care of the rest.
            </p>
            <p className="text-gray-600 leading-relaxed font-semibold">
              Strategically located near IT Park Chandigarh, Infosys, and Wipro campuses, ensuring a hassle-free, zero-traffic commute.
            </p>
          </div>
          <div className="w-full md:w-1/2 relative h-[400px]">
            {/* TODO: Replace with real interior image */}
            <Image 
              src="https://images.unsplash.com/photo-1502672260266-1c1e52409818?q=80&w=2000&auto=format&fit=crop" 
              alt="Boora PG Interior" 
              fill
              className="object-cover rounded-xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}