import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useSocket } from '../context/SocketContext';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    api.get('/api/v1/notifications')
      .then(r => setNotifications(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      setNotifications(prev => [{ ...data, createdAt: new Date(), _id: Date.now() }, ...prev].slice(0, 20));
      setUnread(n => n + 1);
    };
    socket.on('new_post', handler);
    return () => socket.off('new_post', handler);
  }, [socket]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(o => !o);
    setUnread(0);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={handleOpen} className="relative p-1 text-parchment/60 hover:text-amber transition-colors" title="Notifications">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber text-ink text-xs rounded-full flex items-center justify-center font-sans font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-80 bg-bark border border-amber/30 rounded-lg shadow-2xl shadow-black/50 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-amber/20 flex items-center justify-between">
            <span className="font-serif text-parchment text-sm">Notifications</span>
            <span className="text-parchment/30 text-xs">{notifications.length} recent</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-parchment/30 text-sm italic text-center py-8">No notifications yet</p>
            ) : (
              notifications.map((n, i) => (
                <Link
                  key={n._id || i}
                  to={n.postId ? `/post/${n.postId}` : '/'}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 border-b border-amber/10 hover:bg-amber/5 transition-colors"
                >
                  <p className="text-parchment/80 text-sm leading-snug">
                    <span className="text-amber font-serif">New post:</span> {n.title}
                  </p>
                  <p className="text-parchment/40 text-xs mt-1">
                    by {n.author} · {n.category}
                  </p>
                  <p className="text-parchment/20 text-xs mt-0.5">
                    {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
