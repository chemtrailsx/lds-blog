import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

function ProfileIcon({ initial }) {
  return (
    <div className="w-8 h-8 rounded-full bg-amber/20 border border-amber/50 flex items-center justify-center text-amber font-serif text-sm hover:bg-amber/30 hover:border-amber transition-all">
      {initial}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const initial = (user?.name || '?')[0].toUpperCase();

  return (
    <nav className="border-b border-amber/20 bg-bark/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl text-parchment hover:text-amber transition-colors">
          <span className="text-amber">L</span>&amp;<span className="text-amber">D</span> Society
        </Link>

        <div className="flex items-center gap-4 text-sm font-sans tracking-wide">
          <Link to="/" className="text-parchment/70 hover:text-amber transition-colors uppercase text-xs tracking-widest">Feed</Link>

          {user ? (
            <>
              {(user.role === 'writer' || user.role === 'admin') && (
                <Link to="/create" className="text-parchment/70 hover:text-amber transition-colors uppercase text-xs tracking-widest">Write</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-amber/70 hover:text-amber transition-colors uppercase text-xs tracking-widest">Admin</Link>
              )}
              <Link to="/profile" title="My Profile">
                <ProfileIcon initial={initial} />
              </Link>
              <NotificationBell />
              <button onClick={handleLogout} className="btn-ghost text-xs py-1 px-3">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-parchment/70 hover:text-amber transition-colors uppercase text-xs tracking-widest">Login</Link>
              <Link to="/register" className="btn-primary text-xs py-1 px-4">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
