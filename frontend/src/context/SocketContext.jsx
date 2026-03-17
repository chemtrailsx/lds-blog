import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', { reconnectionAttempts: 5 });

    socketRef.current.on('new_post', ({ title, author, category }) => {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-bark border border-amber shadow-lg rounded-lg pointer-events-auto flex`}>
          <div className="flex-1 p-4">
            <p className="text-amber font-serif text-sm font-semibold">New Post Published</p>
            <p className="text-parchment text-sm mt-1">"{title}" by {author}</p>
            <p className="text-parchment/50 text-xs mt-1">{category}</p>
          </div>
        </div>
      ), { duration: 5000 });
    });

    return () => socketRef.current?.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
