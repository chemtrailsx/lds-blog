import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [tab, setTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    api.get('/api/v1/posts')
      .then(r => setPosts(r.data))
      .finally(() => setLoadingPosts(false));
    api.get('/api/v1/auth/pending-users')
      .then(r => setPendingUsers(r.data))
      .finally(() => setLoadingUsers(false));
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

  const handleApprove = async (id) => {
    try {
      await api.patch(`/api/v1/auth/approve-writer/${id}`);
      setPendingUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User approved as writer');
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleRevoke = async (id) => {
    try {
      await api.patch(`/api/v1/auth/revoke-writer/${id}`);
      setPendingUsers(prev => prev.filter(u => u._id !== id));
      toast.success('Writer revoked');
    } catch {
      toast.error('Failed to revoke');
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-parchment mb-2">Admin Panel</h1>
      <p className="text-parchment/40 text-sm mb-6">Manage posts and member approvals</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-amber/20">
        <button
          onClick={() => setTab('posts')}
          className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors ${tab === 'posts' ? 'text-amber border-b-2 border-amber' : 'text-parchment/40 hover:text-parchment/70'}`}
        >
          Posts
        </button>
        <button
          onClick={() => setTab('members')}
          className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors flex items-center gap-2 ${tab === 'members' ? 'text-amber border-b-2 border-amber' : 'text-parchment/40 hover:text-parchment/70'}`}
        >
          Pending Members
          {pendingUsers.length > 0 && (
            <span className="bg-amber text-bark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {pendingUsers.length}
            </span>
          )}
        </button>
      </div>

      {/* Posts tab */}
      {tab === 'posts' && (
        loadingPosts ? (
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
        )
      )}

      {/* Pending members tab */}
      {tab === 'members' && (
        loadingUsers ? (
          <p className="text-parchment/40 italic font-serif text-center py-12">Loading...</p>
        ) : pendingUsers.length === 0 ? (
          <p className="text-parchment/40 italic font-serif text-center py-12">No pending members.</p>
        ) : (
          <div className="space-y-3">
            {pendingUsers.map(u => (
              <div key={u._id} className="card p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-parchment">{u.name}</p>
                  <p className="text-parchment/40 text-xs mt-1">{u.email} · Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleApprove(u._id)}
                  className="text-xs border border-amber/40 text-amber/70 hover:text-amber hover:border-amber px-3 py-1 rounded transition-colors shrink-0"
                >
                  Approve as Writer
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </main>
  );
}
