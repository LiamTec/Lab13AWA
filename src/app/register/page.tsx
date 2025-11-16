"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
      router.push('/signIn');
    } catch (err: any) {
      setError(err.message || 'Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <label className="block mb-2">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-3" />
        <label className="block mb-2">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full p-2 border rounded mb-3" />
        <label className="block mb-2">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full p-2 border rounded mb-4" />
        <button className="w-full bg-gray-800 text-white py-2 rounded">Create account</button>
      </form>
    </div>
  );
}
