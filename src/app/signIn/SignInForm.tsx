'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import { useState } from 'react';

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    const result = await signIn('google', {
      callbackUrl: '/dashboard',
      redirect: false,
    });

    if (result?.ok) {
      router.push('/dashboard');
    }
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    } as any);
    if (result?.ok) {
      router.push('/dashboard');
    } else {
      const err = result?.error;
      if (err === 'ACCOUNT_LOCKED') {
        try {
          const res = await fetch('/api/lock-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          if (data.locked) {
            const mins = Math.ceil((data.remainingMs || 0) / 60000);
            setError(`Cuenta bloqueada. Intenta de nuevo en ${mins} minuto(s).`);
          } else {
            setError('Cuenta bloqueada. Intenta más tarde.');
          }
        } catch (e) {
          setError('Cuenta bloqueada. Intenta más tarde.');
        }
      } else {
        setError('Email o contraseña incorrectos');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">Sign In</h1>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleCredentials} className="mb-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full p-2 border rounded mb-2" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded mb-4" />
          <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded mb-3">Sign in with Email</button>
        </form>
        <button onClick={handleGoogleSignIn} className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2">
          <FaGoogle />
          Continue with Google
        </button>
        <button onClick={() => signIn('github')} className="w-full mt-3 bg-gray-900 text-white py-2 rounded flex items-center justify-center gap-2">Sign in with GitHub</button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">¿No tienes cuenta?</p>
          <button onClick={() => router.push('/register')} className="text-sm text-blue-600 underline">Crear una cuenta</button>
        </div>
      </div>
    </div>
  );
}
