// app/admin/login/page.tsx
"use client";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../hooks/useAdmin";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isAdmin, loading: adminLoading } = useAdmin();

  useEffect(() => {
    if (!adminLoading && user && isAdmin) {
      router.push("/admin/dashboard");
    }
  }, [user, isAdmin, adminLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will catch the successful login and route to dashboard if they are an admin
    } catch (err) {
      setError("Invalid admin credentials.");
      setLoading(false);
    }
  };

  if (adminLoading) return <div className="h-screen flex items-center justify-center">Checking credentials...</div>;

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-navy mb-2">Admin Portal</h1>
          <p className="text-gray-500">Borra PG Management</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition mt-4"
          >
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}