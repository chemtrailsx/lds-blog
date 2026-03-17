import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import PostEditor from '../components/PostEditor';

const CATEGORIES = ['Literature', 'Debate', 'Philosophy', 'Poetry', 'Essays'];

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', author: '', category: '', body: '', coverImage: '' });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/v1/posts/${id}`)
      .then(r => {
        const { title, author, category, body, coverImage } = r.data;
        setForm({ title, author, category, body, coverImage });
        setCoverPreview(coverImage);
      })
      .catch(() => toast.error('Post not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let coverImage = form.coverImage;
      if (coverFile) {
        const fd = new FormData();
        fd.append('image', coverFile);
        const { data } = await api.post('/api/v1/images/upload', fd);
        coverImage = data.url;
      }
      await api.put(`/api/v1/posts/${id}`, { ...form, coverImage });
      toast.success('Post updated');
      navigate(`/post/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-parchment/40 font-serif italic">Loading...</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-parchment mb-2">Edit Post</h1>
      <div className="h-px bg-amber/20 mb-8" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Title</label>
          <input className="input-field font-serif text-lg" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Author</label>
            <div className="input-field opacity-60 cursor-not-allowed">{form.author}</div>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Category</label>
            <select className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Cover Image</label>
          {coverPreview && <img src={coverPreview} alt="Cover" className="w-full h-48 object-cover rounded mb-3" />}
          <label className="block border border-dashed border-amber/30 hover:border-amber/60 rounded p-4 text-center cursor-pointer transition-colors text-parchment/40 hover:text-parchment/70 text-sm">
            Click to replace cover image
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </label>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Body</label>
          <PostEditor content={form.body} onChange={val => setForm(f => ({ ...f, body: val }))} />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base disabled:opacity-50">
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </main>
  );
}
