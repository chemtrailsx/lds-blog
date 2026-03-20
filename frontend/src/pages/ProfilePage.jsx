import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const GENDERS = ['', 'Male', 'Female', 'Non-binary', 'Prefer not to say'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(currentYear - i));

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', gender: '', memberSince: '', bio: '' });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/v1/profile/me')
      .then(r => {
        setForm({
          name: r.data.name || '',
          gender: r.data.gender || '',
          memberSince: r.data.memberSince || '',
          bio: r.data.bio || '',
        });
        setEmail(r.data.email || '');
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/api/v1/profile/me', form);
      updateUser(data);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  if (loading) return <div className="text-center py-20 text-parchment/40 font-serif italic">Loading...</div>;

  const displayName = form.name || '?';

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-full bg-amber/20 border border-amber/40 flex items-center justify-center text-2xl font-serif text-amber">
          {displayName[0].toUpperCase()}
        </div>
        <div>
          <h1 className="font-serif text-2xl text-parchment">{displayName}</h1>
          {email && (
            <p className="text-parchment/50 text-sm mt-0.5">{email}</p>
          )}
          {user?.role === 'admin' && (
            <span className="text-amber/60 text-xs tracking-widest uppercase">Admin</span>
          )}
        </div>
      </div>

      <div className="h-px bg-amber/20 mb-8" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Name</label>
          <input className="input-field" placeholder="Your name" value={form.name} onChange={set('name')} />
          <p className="text-parchment/30 text-xs mt-1">This appears on all your posts as the author name.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Gender</label>
            <select className="input-field" value={form.gender} onChange={set('gender')}>
              {GENDERS.map(g => <option key={g} value={g}>{g || 'Select...'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Member Since</label>
            <select className="input-field" value={form.memberSince} onChange={set('memberSince')}>
              <option value="">Select year...</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Bio</label>
          <textarea
            className="input-field resize-none h-28"
            placeholder="A few words about yourself..."
            value={form.bio}
            onChange={set('bio')}
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full py-3 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </main>
  );
}
