import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function LocationSection() {
  return (
    <section id="location" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-playfair font-bold text-navy mb-4">Visit Boora PG</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conveniently located in Panchkula with easy access to major transport hubs, markets, and IT parks. Reach out to schedule a guided tour.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Cards (Left Side) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Phone Card */}
            <a href="tel:+917696735209" className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gold hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-navy/5 text-navy flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                <p className="text-navy font-semibold text-lg">+91 7696735209</p>
                <p className="text-xs text-gray-500 mt-1">Available Mon-Sat, 9 AM to 8 PM</p>
              </div>
            </a>

            {/* Email Card */}
            <a href="mailto:contact@boorapg.com" className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gold hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-navy/5 text-navy flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-navy font-semibold text-lg">contact@boorapg.com</p>
                <p className="text-xs text-gray-500 mt-1">We typically reply within 24 hours</p>
              </div>
            </a>

            {/* Address Card */}
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-navy/5 text-navy flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  MDC Sector 6 Rd, <br />
                  Mansa Devi Complex, <br />
                  Panchkula, Haryana 134114
                </p>
              </div>
            </div>

          </div>

          {/* Interactive Google Map (Right Side) */}
          <div className="lg:col-span-2 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 min-h-[400px] relative">
            <iframe
              src="https://maps.google.com/maps?q=Boora+PG,+Panchkula&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}