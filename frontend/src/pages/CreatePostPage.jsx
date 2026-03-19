import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import PostEditor from '../components/PostEditor';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Poems and Stories', 'Films, TV and Books', 'Miscellaneous', 'Hindi Literature', 'Personalities', 'New Additions'];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', category: '', body: '' });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.body) {
      toast.error('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    setSubmitting(true);

    try {
      let coverImage = '';

      // Upload image
      if (coverFile) {
        const fd = new FormData();
        fd.append('image', coverFile);

        const { data } = await api.post('/api/v1/images/upload', fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        coverImage = data.url;
      }

      // Create post
      const { data } = await api.post(
        '/api/v1/posts',
        { ...form, author: user.name || user.username, coverImage },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Post published');
      navigate(`/post/${data._id}`);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to publish');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-parchment mb-2">Write a New Post</h1>
      <div className="h-px bg-amber/20 mb-8" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Title *</label>
          <input className="input-field font-serif text-lg"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Author</label>
            <div className="input-field opacity-60 cursor-not-allowed">{user?.name || user?.username}</div>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Category *</label>
            <select className="input-field"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Cover Image</label>
          {coverPreview && <img src={coverPreview} alt="Cover preview" className="w-full h-48 object-cover rounded mb-3" />}
          <label className="block border border-dashed border-amber/30 hover:border-amber/60 rounded p-4 text-center cursor-pointer transition-colors text-parchment/40 hover:text-parchment/70 text-sm">
            {coverFile ? coverFile.name : 'Click to upload cover image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </label>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-parchment/50 mb-2">Body *</label>
          <PostEditor content={form.body} onChange={val => setForm(f => ({ ...f, body: val }))} />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base disabled:opacity-50">
          {submitting ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </main>
  );
}
