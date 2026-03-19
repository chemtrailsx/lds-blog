import { useEffect, useRef } from 'react';

const MEMBERS = [
  { name: 'Raunak', avatar: 'R' },
  { name: 'Neha', avatar: 'N' },
  { name: 'Anubhav', avatar: 'An' },
  { name: 'Amritanshu', avatar: 'Am' },
  { name: 'Aditya', avatar: 'Ad' },
  { name: 'Swastik', avatar: 'Sw' },
  { name: 'Unnati', avatar: 'U' },
  { name: 'Rishab', avatar: 'Ri' },
  { name: 'Bhumi', avatar: 'B' },
  { name: 'Priyanshi', avatar: 'P' },
  { name: 'Abhay', avatar: 'Ab' },
  { name: 'Rehaan', avatar: 'Re' },
  { name: 'Tanishq', avatar: 'T' },
  { name: 'Nirmit', avatar: 'Ni' },
  { name: 'Anandita', avatar: 'An' },
  { name: 'Arpit', avatar: 'Ar' },
  { name: 'Shikhar', avatar: 'Sh' },
  { name: 'Vanshika', avatar: 'V' },
  { name: 'Krishnarjun', avatar: 'K' },
  { name: 'Aditi', avatar: 'Ad' },
  { name: 'Sohail', avatar: 'So' },
  { name: 'Shanawaz', avatar: 'Sh' },
  { name: 'Yagya', avatar: 'Y' },
];

// Duplicate for seamless infinite scroll
const DOUBLED = [...MEMBERS, ...MEMBERS];

const COLORS = [
  'from-amber/30 to-bark',
  'from-moss/40 to-bark',
  'from-amber/20 to-charcoal',
  'from-parchment/10 to-bark',
];

export default function MembersCarousel() {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.5; // px per frame
    const totalWidth = track.scrollWidth / 2; // half because doubled

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
  }, []);

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
          {DOUBLED.map((member, i) => (
            <div key={i} className="flex flex-col items-center gap-3 w-32 shrink-0">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${COLORS[i % COLORS.length]} border border-amber/30 flex items-center justify-center text-amber font-serif text-xl select-none`}>
                {member.avatar}
              </div>
              <p className="text-parchment/70 text-sm font-sans text-center leading-tight">{member.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
