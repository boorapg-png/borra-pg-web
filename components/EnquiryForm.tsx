"use client";
import { useState } from "react";

export default function EnquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    // 1. Grab the form and vacuum up all the inputs
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // 2. Add the required Web3Forms keys
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "");
    formData.append("subject", "New Tenant Enquiry - Boora PG");

    // 3. Send it off
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        form.reset(); 
      } else {
        console.error("Web3Forms API Error:", result);
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      {status === "success" ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
          <h3 className="text-2xl font-bold text-navy mb-2">Thank you!</h3>
          <p className="text-gray-600">We will contact you within 24 hours.</p>
          <button onClick={() => setStatus("idle")} className="mt-6 text-gold underline">Send another enquiry</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input required name="name" type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input required name="email" type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Move-in Date</label>
              <input name="move_in_date" type="date" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
            <textarea name="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent outline-none"></textarea>
          </div>
          
          {status === "error" && <p className="text-red-500 text-sm">Failed to send. Please try calling us directly.</p>}
          
          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-full bg-navy text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition disabled:opacity-70"
          >
            {status === "loading" ? "Sending..." : "Submit Enquiry"}
          </button>
        </form>
      )}
    </div>
  );
}