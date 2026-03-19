import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/v1/posts/${id}`)
      .then(r => setPost(r.data))
      .catch(() => toast.error('Post not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/api/v1/posts/${id}`);
      toast.success('Post deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-20 text-parchment/40 font-serif italic">Loading...</div>;
  if (!post) return <div className="text-center py-20 text-parchment/40 font-serif italic">Post not found.</div>;

  const isOwner = user && user.id === post.editor;
  const isAdmin = user?.role === 'admin';

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/" className="text-amber/60 hover:text-amber text-xs tracking-widest uppercase transition-colors">← Back to Feed</Link>

      {post.coverImage && (
        <div className="mt-6 mb-8 rounded-lg overflow-hidden h-72 md:h-96">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="mt-6">
        <span className="text-amber text-xs tracking-widest uppercase">{post.category}</span>
        <h1 className="font-serif text-3xl md:text-4xl text-parchment mt-2 mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-parchment/40 text-sm mb-8">
          <span>by{' '}
            <Link
              to={`/author/${post.editor?._id || post.editor}`}
              className="text-parchment/70 hover:text-amber transition-colors"
            >
              {post.author}
            </Link>
          </span>
          <span>·</span>
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <div className="h-px bg-amber/20 mb-8" />

        <div
          className="font-sans text-parchment/90 leading-relaxed text-lg prose-headings:font-serif prose-headings:text-amber"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>

      {(isOwner || isAdmin) && (
        <div className="mt-12 pt-6 border-t border-amber/20 flex gap-3">
          <Link to={`/edit/${post._id}`} className="btn-ghost text-sm">Edit Post</Link>
          <button onClick={handleDelete} className="border border-red-400/30 text-red-400/60 hover:text-red-400 hover:border-red-400/60 px-4 py-2 rounded text-sm transition-colors">Delete</button>
        </div>
      )}
    </article>
  );
}
