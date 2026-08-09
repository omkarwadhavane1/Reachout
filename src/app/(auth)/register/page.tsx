'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      window.location.href = '/profile';
    } catch (err) {
      setError('Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 bg-black flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-black">
            ReachOutAI
          </span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-600 text-sm">
            Start automating your job applications
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 rounded-2xl border-gray-800 text-black focus:border-black focus:outline-none transition"
              required
              placeholder='Enter Your Name'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border-2 rounded-2xl border-gray-900 text-black focus:border-black focus:outline-none transition"
              required
              placeholder='Enter Email Address'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border-2 rounded-2xl border-gray-800 text-black focus:border-black focus:outline-none transition"
              required
              placeholder='Enter Passward'
              minLength={8}
            />
          </div>

          {error && (
            <div className="bg-gray-100 p-3 border-l-4 border-black">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <a href="/login" className="text-black font-medium hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}