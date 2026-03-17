const CATEGORIES = ['All', 'Literature', 'Debate', 'Philosophy', 'Poetry', 'Essays'];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`text-xs tracking-widest uppercase px-4 py-2 rounded border transition-all duration-200 font-sans
            ${selected === cat
              ? 'bg-amber text-ink border-amber'
              : 'border-amber/30 text-parchment/60 hover:border-amber/60 hover:text-parchment'
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
