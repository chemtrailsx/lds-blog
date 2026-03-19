import { useState, useEffect } from 'react';
import api from '../api';
import PostCard from '../components/PostCard';
import CategoryFilter from '../components/CategoryFilter';
import MembersCarousel from '../components/MembersCarousel';
import WordOfTheWeek from '../components/WordOfTheWeek';

const CATEGORIES = ['Poems and Stories', 'Films, TV and Books', 'Miscellaneous', 'Hindi Literature', 'Personalities', 'New Additions'];

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/posts')
      .then(r => setPosts(r.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleted = (id) => setPosts(prev => prev.filter(p => p._id !== id));

  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filtered.filter(p => p.category === cat);
    return acc;
  }, {});

  const displayCategories = filter === 'All' ? CATEGORIES : [filter];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-8">
        <p className="text-amber/60 text-xs tracking-[0.4em] uppercase mb-3">Welcome to the</p>
        <h1 className="font-serif text-4xl md:text-5xl text-parchment mb-4">
          Literary &amp; <span className="text-amber italic">Debating</span> Society
        </h1>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-24 bg-amber/30" />
          <span className="text-amber text-lg">✦</span>
          <div className="h-px w-24 bg-amber/30" />
        </div>
      </div>

      {/* Word of the Week */}
      <WordOfTheWeek />

      <div className="mb-12 mt-10">
        <CategoryFilter selected={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div className="text-center text-parchment/40 py-20 font-serif text-xl italic">Loading the archives...</div>
      ) : (
        displayCategories.map(cat => (
          <section key={cat} className="mb-14">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-serif text-2xl text-amber">{cat}</h2>
              <div className="flex-1 h-px bg-amber/20" />
            </div>
            {grouped[cat].length === 0 ? (
              <p className="text-parchment/30 italic font-serif text-center py-8">No posts in {cat} yet. Be the first to write.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[cat].map(post => (
                  <PostCard key={post._id} post={post} onDeleted={handleDeleted} />
                ))}
              </div>
            )}
          </section>
        ))
      )}
      <MembersCarousel />
    </main>
  );
}
