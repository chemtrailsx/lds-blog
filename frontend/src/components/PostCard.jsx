import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

export default function PostCard({ post, onDeleted }) {
  const { user } = useAuth();
  const isOwner = user && user.id === post.editor;
  const isAdmin = user?.role === 'admin';

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/api/v1/posts/${post._id}`);
      toast.success('Post deleted');
      onDeleted?.(post._id);
    } catch {
      toast.error('Failed to delete post');
    }
  };

  return (
    <Link to={`/post/${post._id}`} className="card block group">
      {post.coverImage && (
        <div className="h-48 overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      {!post.coverImage && (
        <div className="h-32 bg-gradient-to-br from-bark to-charcoal flex items-center justify-center">
          <span className="text-amber/20 font-serif text-5xl italic">"</span>
        </div>
      )}
      <div className="p-5">
        <span className="text-amber text-xs tracking-widest uppercase font-sans">{post.category}</span>
        <h3 className="font-serif text-lg text-parchment mt-1 mb-2 group-hover:text-amber transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-parchment/50 text-xs font-sans">by {post.author}</p>
        <p className="text-parchment/30 text-xs mt-1">{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        {(isOwner || isAdmin) && (
          <div className="mt-3 flex gap-2" onClick={e => e.preventDefault()}>
            <Link to={`/edit/${post._id}`} className="text-xs text-amber/60 hover:text-amber border border-amber/20 hover:border-amber/50 px-2 py-1 rounded transition-colors">Edit</Link>
            <button onClick={handleDelete} className="text-xs text-red-400/60 hover:text-red-400 border border-red-400/20 hover:border-red-400/50 px-2 py-1 rounded transition-colors">Delete</button>
          </div>
        )}
      </div>
    </Link>
  );
}
