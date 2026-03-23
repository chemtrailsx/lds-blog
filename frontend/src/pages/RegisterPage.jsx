import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const ALLOWED_DOMAINS = new Set([
    'gmail.com', 'googlemail.com',
    'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'yahoo.fr', 'yahoo.de',
    'outlook.com', 'hotmail.com', 'hotmail.co.uk', 'live.com', 'msn.com',
    'icloud.com', 'me.com', 'mac.com',
    'protonmail.com', 'proton.me',
    'zoho.com', 'aol.com', 'mail.com',
    'gmx.com', 'gmx.net', 'tutanota.com', 'fastmail.com', 'hey.com',
  ]);

  const isValidEmail = (email) => {
    const parts = email.toLowerCase().split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1];
    if (ALLOWED_DOMAINS.has(domain)) return true;
    if (domain.endsWith('.edu') || domain.includes('.ac.')) return true;
    const tld = domain.split('.').pop();
    const validTlds = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co', 'uk', 'in', 'de', 'fr', 'au'];
    if (!validTlds.includes(tld)) return false;
    const domainWithoutTld = domain.slice(0, domain.lastIndexOf('.'));
    return domainWithoutTld.length >= 3;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setForm(f => ({ ...f, email: val }));
    if (val && val.includes('@') && !isValidEmail(val)) {
      setEmailError('Please use a valid email address (e.g. Gmail, Yahoo, Outlook)');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email)) {
      setEmailError('Please use a valid email address (e.g. Gmail, Yahoo, Outlook)');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/v1/auth/register', form);
      login(data.token, data.user);
      toast.success(`Welcome, ${data.user.name}`);
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
              <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Name</label>
              <input className="input-field" placeholder="Your name" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Email</label>
              <input type="email" className={`input-field ${emailError ? 'border-red-500/60' : ''}`} placeholder="your@email.com" value={form.email} onChange={handleEmailChange} required />
              {emailError && <p className="text-red-400/80 text-xs mt-1">{emailError}</p>}
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
