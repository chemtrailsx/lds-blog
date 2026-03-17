import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/posts')
      .then(r => setPosts(r.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/api/v1/posts/${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-parchment mb-2">Admin Panel</h1>
      <p className="text-parchment/40 text-sm mb-8">Moderate all posts across the platform</p>
      <div className="h-px bg-amber/20 mb-8" />

      {loading ? (
        <p className="text-parchment/40 italic font-serif text-center py-12">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-parchment/40 italic font-serif text-center py-12">No posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post._id} className="card p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-serif text-parchment truncate">{post.title}</p>
                <p className="text-parchment/40 text-xs mt-1">
                  {post.author} · <span className="text-amber/60">{post.category}</span> · {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/edit/${post._id}`} className="text-xs border border-amber/30 text-amber/60 hover:text-amber hover:border-amber px-3 py-1 rounded transition-colors">Edit</Link>
                <button onClick={() => handleDelete(post._id)} className="text-xs border border-red-400/30 text-red-400/60 hover:text-red-400 hover:border-red-400 px-3 py-1 rounded transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
