import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import AuthorPage from './pages/AuthorPage';
import { setClerkToken } from './api';

export default function App() {
  const { getToken } = useAuth();
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('introSeen'));

  // Wire Clerk token into the axios interceptor
  useEffect(() => {
    setClerkToken(getToken);
  }, [getToken]);

  const handleIntroComplete = () => {
    sessionStorage.setItem('introSeen', 'true');
    setShowIntro(false);
  };

  if (showIntro) return <IntroAnimation onComplete={handleIntroComplete} />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/sign-in/*" element={
          <div className="clerk-auth-page">
            <div className="clerk-auth-header">
              <div className="clerk-auth-ornament">✦</div>
              <h2 className="clerk-auth-title">Welcome Back</h2>
              <p className="clerk-auth-subtitle">Enter the literary sanctum</p>
              <div className="clerk-auth-divider">
                <span className="clerk-auth-divider-line" />
                <span className="clerk-auth-divider-dot">◆</span>
                <span className="clerk-auth-divider-line" />
              </div>
            </div>
            <SignIn routing="path" path="/sign-in" />
          </div>
        } />
        <Route path="/sign-up/*" element={
          <div className="clerk-auth-page">
            <div className="clerk-auth-header">
              <div className="clerk-auth-ornament">✦</div>
              <h2 className="clerk-auth-title">Join the Society</h2>
              <p className="clerk-auth-subtitle">Begin your literary journey</p>
              <div className="clerk-auth-divider">
                <span className="clerk-auth-divider-line" />
                <span className="clerk-auth-divider-dot">◆</span>
                <span className="clerk-auth-divider-line" />
              </div>
            </div>
            <SignUp routing="path" path="/sign-up" />
          </div>
        } />
        <Route path="/create" element={
          <>
            <SignedIn><CreatePostPage /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
        <Route path="/edit/:id" element={
          <>
            <SignedIn><EditPostPage /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
        <Route path="/admin" element={
          <>
            <SignedIn><AdminPage /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
        <Route path="/profile" element={
          <>
            <SignedIn><ProfilePage /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
        <Route path="/author/:id" element={<AuthorPage />} />
      </Routes>
    </div>
  );
}
