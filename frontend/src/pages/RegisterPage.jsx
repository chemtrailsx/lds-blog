import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/v1/auth/register', form);
      login(data.token, data.user);
      toast.success(`Welcome, ${data.user.name || data.user.username}`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-parchment mb-2">Join the Society</h1>
          <p className="text-parchment/40 text-sm italic">Create your account and begin writing</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Full Name</label>
              <input className="input-field" placeholder="Your full name" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Username</label>
              <input className="input-field" placeholder="your_handle" value={form.username} onChange={set('username')} required />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Email</label>
              <input type="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Password</label>
              <input type="password" className="input-field" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-parchment/40 text-sm mt-6">
            Already a member?{' '}
            <Link to="/login" className="text-amber hover:text-amber-dark transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
