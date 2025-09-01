import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Auth/Login.jsx';
import Signup from './pages/Auth/Signup.jsx';
import { useEffect } from 'react';
import { api } from './lib/api';
import useAuthStore from './store/useAuthStore';


export default function App() {
  const setUser = useAuthStore(state => state.setUser);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/api/auth/me');
        if (mounted && data && data.ok && data.user) setUser(data.user);
      } catch (err) { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, [setUser]);
    return (
    <div className="min-h-screen flex flex-col app-theme">
      <Navbar />
      <main className="flex-1 container">
        <div className="content py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* OTP/verify removed */}
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}