import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function AuthorPage() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/api/v1/profile/${id}`),
      api.get('/api/v1/posts')
    ])
      .then(([userRes, postsRes]) => {
        setAuthor(userRes.data);
        setPosts(postsRes.data.filter(p => {
          const editorId = p.editor?._id || p.editor;
          return editorId?.toString() === id;
        }));
      })
      .catch(() => toast.error('Could not load profile'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-parchment/40 font-serif italic">Loading...</div>;
  if (!author) return <div className="text-center py-20 text-parchment/40 font-serif italic">Author not found.</div>;

  const initial = (author.name || '?')[0].toUpperCase();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Author header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <div className="w-24 h-24 rounded-full bg-amber/20 border-2 border-amber/40 flex items-center justify-center text-3xl font-serif text-amber shrink-0">
          {initial}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="font-serif text-3xl text-parchment mb-1">{author.name}</h1>
          {author.role === 'admin' && (
            <span className="text-amber/60 text-xs tracking-widest uppercase">Admin</span>
          )}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-sm text-parchment/40">
            {author.memberSince && (
              <span>Member since <span className="text-parchment/70">{author.memberSince}</span></span>
            )}
            {author.gender && (
              <span>{author.gender}</span>
            )}
            <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
          </div>
          {author.bio && (
            <p className="mt-4 text-parchment/60 font-sans leading-relaxed max-w-xl">{author.bio}</p>
          )}
        </div>
      </div>

      <div className="h-px bg-amber/20 mb-10" />

      {/* Posts */}
      <h2 className="font-serif text-xl text-amber mb-6">Writings</h2>

      {posts.length === 0 ? (
        <p className="text-parchment/30 italic font-serif text-center py-12">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <Link
              key={post._id}
              to={`/post/${post._id}`}
              className="flex gap-4 card p-4 group"
            >
              {post.coverImage && (
                <img src={post.coverImage} alt={post.title} className="w-20 h-20 object-cover rounded shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-amber text-xs tracking-widest uppercase">{post.category}</span>
                <h3 className="font-serif text-parchment group-hover:text-amber transition-colors mt-1 truncate">{post.title}</h3>
                <p className="text-parchment/30 text-xs mt-1">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
