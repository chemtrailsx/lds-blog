import { useEffect, useState } from 'react';

export default function IntroAnimation({ onComplete }) {
  const [phase, setPhase] = useState('zoom'); // zoom | fadeout

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('fadeout'), 2000);
    const doneTimer = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink transition-opacity duration-700 ${phase === 'fadeout' ? 'opacity-0' : 'opacity-100'}`}
      style={{ pointerEvents: 'all' }}
    >
      {/* Decorative lines */}
      <div className="absolute inset-0 flex flex-col justify-between py-16 px-8 pointer-events-none">
        <div className="border-t border-amber/20 w-full" />
        <div className="border-b border-amber/20 w-full" />
      </div>

      <div
        className={`text-center transition-all duration-700 ${phase === 'zoom' ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
        style={{ animation: phase === 'zoom' ? 'zoomIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards' : undefined }}
      >
        <p className="text-amber/60 font-serif text-sm tracking-[0.4em] uppercase mb-4">Est. MMXXIV</p>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-parchment leading-tight">
          Literary and<br />
          <span className="text-amber italic">Debating</span> Society
        </h1>
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-amber/40" />
          <span className="text-amber/60 text-xs tracking-widest uppercase">Est. MMXXIV</span>
          <div className="h-px w-16 bg-amber/40" />
        </div>
      </div>

      <style>{`
        @keyframes zoomIn {
          from { transform: scale(0.3); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
