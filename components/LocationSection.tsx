import { MapPin, Phone } from "lucide-react";

export default function LocationSection() {
  return (
    <section className="py-20 bg-white" id="location">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-playfair font-bold text-navy text-center mb-12">Our Location</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 h-[400px] bg-gray-200 rounded-xl overflow-hidden shadow-md">
            <iframe 
              src="https://maps.google.com/maps?q=Boora+PG+Valley+Estate,+MDC+Sector+4,+Panchkula&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col justify-center space-y-8">
            <div className="bg-softgrey p-6 rounded-xl border border-gray-100">
              <h3 className="font-playfair text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                <MapPin className="text-gold" /> Address
              </h3>
              <p className="text-gray-600">
                MDC Sector 6 Rd, near Panchkula Boora PG Valley Estate,<br />
                near IT Park Road, Mansa Devi Complex, Bhainsa Tibba,<br />
                MDC Sector 4, Panchkula, Haryana 134114
              </p>
            </div>
            
            <div className="bg-softgrey p-6 rounded-xl border border-gray-100">
               <h3 className="font-playfair text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                <Phone className="text-gold" /> Contact
              </h3>
              <p className="text-gray-600 text-xl font-semibold">7696735209</p>
            </div>

            <div className="p-4">
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li><strong>IT Park Chandigarh:</strong> ~2 mins</li>
                <li><strong>Infosys Campus:</strong> ~3 mins</li>
                <li><strong>Chandigarh Railway Station:</strong> ~15 mins</li>
                <li><strong>ISBT Sector 43:</strong> ~25 mins</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}