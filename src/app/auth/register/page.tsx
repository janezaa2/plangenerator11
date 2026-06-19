"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import { Leaf } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/auth/register", form);
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        callbackUrl: "/profile",
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Start your nutrition journey</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
            { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { key: "password", label: "Password", type: "password", placeholder: "Min. 8 characters" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
                placeholder={placeholder}
                minLength={key === "password" ? 8 : 1}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-green-600 font-medium hover:text-green-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
