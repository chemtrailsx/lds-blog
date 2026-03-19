import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/v1/auth/login', form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.username}`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-parchment mb-2">Welcome Back</h1>
          <p className="text-parchment/40 text-sm font-sans italic">Sign in to continue your literary journey</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Email</label>
              <input type="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="flex items-center justify-between">
              <label className="block text-xs tracking-widest uppercase text-parchment/50">Password</label>
              <Link to="/forgot-password" className="text-amber/60 hover:text-amber text-xs transition-colors">Forgot password?</Link>
            </div>
            <input type="password" className="input-field" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-parchment/40 text-sm mt-6">
            New here?{' '}
            <Link to="/register" className="text-amber hover:text-amber-dark transition-colors">Join the Society</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
