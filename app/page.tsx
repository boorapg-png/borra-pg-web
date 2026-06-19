import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import AmenitiesGrid from "../components/AmenitiesGrid";
import GallerySection from "../components/GallerySection";
import LocationSection from "../components/LocationSection";
import EnquiryForm from "../components/EnquiryForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutSection />
      <AmenitiesGrid />
      <GallerySection />
      <LocationSection />
      <section id="enquire" className="py-20 bg-softgrey">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-playfair font-bold text-navy mb-4">Book a Visit</h2>
            <p className="text-gray-600">Leave your details and we will get back to you within 24 hours.</p>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </div>
  );
}