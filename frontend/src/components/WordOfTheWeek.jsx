import { useState, useEffect } from 'react';
import api from '../api';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

export default function WordOfTheWeek() {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ word: '', definition: '' });

  useEffect(() => {
    api.get('/api/v1/wotw').then(r => {
      setData(r.data);
      setForm({ word: r.data.word || '', definition: r.data.definition || '' });
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      const { data: updated } = await api.put('/api/v1/wotw', form);
      setData(updated);
      setEditing(false);
      toast.success('Word of the Week updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  if (!data && user?.publicMetadata?.role !== 'admin') return null;

  return (
    <div className="relative max-w-2xl mx-auto mb-2">
      <div className="border border-amber/30 bg-bark/60 rounded-lg px-8 py-6 text-center relative">
        <p className="text-amber/50 text-xs tracking-[0.3em] uppercase mb-3">Word of the Week</p>

        {editing ? (
          <div className="space-y-3 text-left">
            <input
              className="input-field font-serif text-xl text-center w-full"
              placeholder="Word"
              value={form.word}
              onChange={e => setForm(f => ({ ...f, word: e.target.value }))}
            />
            <textarea
              className="input-field w-full text-sm resize-none"
              rows={3}
              placeholder="Definition or sentence..."
              value={form.definition}
              onChange={e => setForm(f => ({ ...f, definition: e.target.value }))}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(false)} className="btn-ghost text-xs py-1 px-3">Cancel</button>
              <button onClick={handleSave} className="btn-primary text-xs py-1 px-4">Save</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-3xl text-parchment italic mb-2">
              {data?.word || '—'}
            </h2>
            <p className="text-parchment/50 text-sm leading-relaxed max-w-md mx-auto">
              {data?.definition || 'No definition set yet.'}
            </p>
            {user?.publicMetadata?.role === 'admin' && (
              <button
                onClick={() => setEditing(true)}
                className="absolute top-3 right-3 text-amber/30 hover:text-amber text-xs transition-colors"
                title="Edit word of the week"
              >
                ✎
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
