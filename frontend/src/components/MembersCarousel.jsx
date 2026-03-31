import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const COLORS = [
  'from-amber/30 to-bark',
  'from-moss/40 to-bark',
  'from-amber/20 to-charcoal',
  'from-parchment/10 to-bark',
];

export default function MembersCarousel() {
  const [members, setMembers] = useState([]);
  const [doubled, setDoubled] = useState([]);
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    // Fetch all users
    api.get('/api/v1/auth/all-users')
      .then(r => {
        setMembers(r.data);
        setDoubled([...r.data, ...r.data]); // Duplicate for seamless scroll
      })
      .catch(() => {
        // Fallback to empty if endpoint doesn't exist yet
        setMembers([]);
      });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || doubled.length === 0) return;

    const speed = 0.5;
    const totalWidth = track.scrollWidth / 2;

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += speed;
        if (posRef.current >= totalWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [doubled]);

  return (
    <section className="py-16 border-t border-amber/20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-10 text-center">
        <p className="text-amber/60 text-xs tracking-[0.4em] uppercase mb-2">The Society</p>
        <h2 className="font-serif text-3xl text-parchment">Our Members</h2>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="h-px w-16 bg-amber/30" />
          <span className="text-amber text-sm">✦</span>
          <div className="h-px w-16 bg-amber/30" />
        </div>
      </div>

      {/* Fade edges */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #1a1410, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #1a1410, transparent)' }} />

        <div
          className="flex gap-6 w-max"
          ref={trackRef}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {doubled.map((member, i) => {
            const initial = member.name ? member.name[0].toUpperCase() : '?';
            return (
              <Link
                key={`${member._id}-${i}`}
                to={`/author/${member._id}`}
                className="flex flex-col items-center gap-3 w-32 shrink-0 group"
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${COLORS[i % COLORS.length]} border border-amber/30 flex items-center justify-center text-amber font-serif text-xl select-none transition-all duration-300 group-hover:scale-110 group-hover:border-amber/60 group-hover:shadow-lg group-hover:shadow-amber/20`}>
                  {initial}
                </div>
                <p className="text-parchment/70 text-sm font-sans text-center leading-tight group-hover:text-amber transition-colors">{member.name}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
