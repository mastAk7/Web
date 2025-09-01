import React, { useState } from 'react';
import { api } from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      if (data && data.user) useAuthStore.getState().setUser(data.user);
      nav('/');
    } catch (err) {
      setErr(err.response?.data?.error || 'Login failed');
    }
  }

  const backendGoogleAuth = (import.meta.env.VITE_API_BASE || 'http://localhost:4000').replace(/\/$/, '') + '/api/auth/google';

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg bg-[var(--card)]/90 backdrop-blur-sm border border-[var(--glass)]">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--accent)]">Welcome Back</h2>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <div className="text-sm mb-1 text-[var(--muted)]">Email</div>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block">
          <div className="text-sm mb-1 text-[var(--muted)]">Password</div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
        {err && <div className="text-sm text-red-400">{err}</div>}
        <button
          className="w-full py-2 rounded-md bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white font-medium hover:scale-[1.02] transition"
        >
          Login
        </button>
      </form>
      <div className="mt-6">
        <div className="text-sm text-center text-[var(--muted)] mb-2">or</div>
        <button
          onClick={() => { window.location.href = backendGoogleAuth; }}
          className="w-full py-2 rounded-md border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--glass)] transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
