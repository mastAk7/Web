import React, { useState } from 'react';
import { api } from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function VerifyOtp() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const nav = useNavigate();

  // prefill from query string
  React.useEffect(() => {
    try {
      const qp = new URLSearchParams(window.location.search);
      const e = qp.get('email');
      if (e) setEmail(e);
    } catch (err) {}
  }, []);

  async function send(e) {
    e.preventDefault();
    setMsg(null);
    try {
  const { data } = await api.post('/api/auth/otp/send', { email });
  setPreviewUrl(data?.previewUrl || null);
  setMsg('Code sent — check your email');
    } catch (err) {
  const d = err.response?.data;
  setMsg(d?.error || 'Failed to send code');
    }
  }

  async function verify(e) {
    e.preventDefault();
    setMsg(null);
    try {
  const { data } = await api.post('/api/auth/otp/verify', { email, code });
  if (data && data.user) useAuthStore.getState().setUser(data.user);
  nav('/');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Verify failed');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-[rgba(9,6,8,0.6)] rounded">
      <h2 className="text-xl font-semibold mb-4">Verify via email code</h2>
      <form onSubmit={send} className="space-y-3 mb-4">
        <label className="block">
          <div className="text-sm mb-1">Email</div>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-black/20" />
        </label>
        <div className="flex justify-end">
          <button className="px-3 py-2 bg-pink-600 rounded text-white">Send code</button>
        </div>
      </form>

      <form onSubmit={verify} className="space-y-3">
        <label className="block">
          <div className="text-sm mb-1">Code</div>
          <input value={code} onChange={e => setCode(e.target.value)} className="w-full px-3 py-2 rounded bg-black/20" />
        </label>
        {msg && <div className="text-sm text-pink-200">{msg}</div>}
        {previewUrl && (
          <div className="mt-2 text-sm">
            Preview: <a className="underline" target="_blank" rel="noreferrer" href={previewUrl}>{previewUrl}</a>
          </div>
        )}
        <div className="flex justify-between">
          <button className="px-3 py-2 bg-pink-600 rounded text-white">Verify</button>
        </div>
      </form>
    </div>
  );
}
