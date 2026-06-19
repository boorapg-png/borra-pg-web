import { Droplet, Wind, Flame, Wifi, Utensils, PartyPopper, Trophy, LifeBuoy } from "lucide-react";

const amenities = [
  { icon: Droplet, title: "24x7 Water & Electricity", desc: "Uninterrupted power and water supply." },
  { icon: Wind, title: "AC Rooms", desc: "Spacious, fully air-conditioned living spaces." },
  { icon: Flame, title: "Geyser", desc: "Hot water available round the clock." },
  { icon: Wifi, title: "High-Speed Wi-Fi", desc: "Enterprise-grade internet for seamless WFH." },
  { icon: Utensils, title: "3 Meals / Day", desc: "Hygienic, home-style food served in our canteen." },
  { icon: PartyPopper, title: "Celebration Area", desc: "Designated space for birthdays and parties." },
  { icon: Trophy, title: "Badminton Court", desc: "Stay active with our outdoor sports facilities." },
  { icon: LifeBuoy, title: "Swimming Pool & Pool Table", desc: "Premium recreation and relaxation zones." },
];

export default function AmenitiesGrid() {
  return (
    <section className="py-20 bg-softgrey" id="amenities">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-playfair font-bold text-navy text-center mb-12">World-Class Amenities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                <div className="w-12 h-12 bg-navy/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold/10 transition">
                  <Icon className="text-navy group-hover:text-gold transition" size={24} />
                </div>
                <h3 className="font-bold text-lg text-navy mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}