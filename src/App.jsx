import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Play, Pause, Radio, ArrowRight, Volume2, VolumeX, User, LogOut, ChevronDown, Package, MapPin, Settings } from 'lucide-react';

// --- CONFIGURATION ---
const LOCAL_TRACK = "/heavy_loop.mp3"; 
const FALLBACK_TRACK = "https://cdn.pixabay.com/download/audio/2021/09/28/audio_7a0c4a3da1.mp3?filename=loop-ambient-116528.mp3";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const NEXT_DROP = {
  name: "PHANTOM BOMBER",
  price: 150,
  image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
  stock: 100,
  date: "TUESDAY 12:00 PM"
};

const INITIAL_PRODUCTS = [
  { id: 1, name: "CONCRETE JUNGLE", price: 85, tag: "LATEST", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop", stock: 5, status: "AVAILABLE" },
  { id: 2, name: "ACID WASH TEE", price: 45, tag: "ESSENTIALS", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop", stock: 20, status: "AVAILABLE" },
  { id: 3, name: "VINTAGE CARGO", price: 120, tag: "ARCHIVE", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop", stock: 0, status: "SOLD OUT" },
  { id: 4, name: "METAL TRUCKER", price: 35, tag: "ACCESSORY", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop", stock: 12, status: "AVAILABLE" }
];

// --- AUTH HOOK ---
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include'
      });
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return { user, loading, logout, checkAuth };
};

// --- COMPONENTS ---

const Navbar = ({ cartCount, toggleCart, user, logout, onOpenAuth, onOpenAccount }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-6 bg-black/90 backdrop-blur-md border-b border-gray-900 text-white">
      <div className="text-2xl font-['Anton'] tracking-wider cursor-pointer text-red-600 hover:tracking-widest transition-all duration-300">HEAVY SHIT.</div>
      <div className="flex items-center gap-6 font-['Space_Grotesk']">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <User size={20} />
              <span className="text-sm hidden md:inline">{user.name}</span>
              <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-[#111] border border-gray-800 shadow-xl"
                >
                  <button 
                    onClick={() => { setDropdownOpen(false); onOpenAccount('profile'); }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-900 transition-colors flex items-center gap-3 text-sm"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <button 
                    onClick={() => { setDropdownOpen(false); onOpenAccount('orders'); }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-900 transition-colors flex items-center gap-3 text-sm"
                  >
                    <Package size={16} />
                    Order History
                  </button>
                  <button 
                    onClick={() => { setDropdownOpen(false); onOpenAccount('addresses'); }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-900 transition-colors flex items-center gap-3 text-sm"
                  >
                    <MapPin size={16} />
                    Addresses
                  </button>
                  <div className="border-t border-gray-800"></div>
                  <button 
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="w-full px-4 py-3 text-left hover:bg-red-900/30 hover:text-red-500 transition-colors flex items-center gap-3 text-sm"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="text-sm hover:text-red-500 transition-colors flex items-center gap-2"
          >
            <User size={20} />
            <span className="hidden md:inline">Login / Register</span>
          </button>
        )}
        <button onClick={toggleCart} className="relative hover:text-red-500 transition-colors">
          <ShoppingBag size={24} />
          {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
};

const RadioPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const a = new Audio(LOCAL_TRACK);
    audioRef.current = a;
    a.loop = true;
    a.volume = 0.4;

    const onCanPlay = () => {
      if (!mounted) return;
      setReady(true);
    };

    const tryFallback = () => {
      if (!mounted) return;
      console.warn('Audio load error for local track, attempting fallback');
      setError('Failed to load local audio, switching to fallback');
      const fb = new Audio(FALLBACK_TRACK);
      fb.loop = true;
      fb.volume = 0.4;
      audioRef.current = fb;
      fb.addEventListener('canplay', () => {
        if (!mounted) return;
        setError(null);
        setReady(true);
      }, { once: true });
      fb.addEventListener('error', () => {
        if (!mounted) return;
        setError('Failed to load audio.');
        setReady(false);
      }, { once: true });
    };

    const onError = () => tryFallback();

    a.addEventListener('canplay', onCanPlay);
    a.addEventListener('error', onError);

    const playPromise = a.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (!mounted) return;
        setPlaying(true);
        setReady(true);
      }).catch((err) => {
        console.log('Autoplay prevented or play failed:', err);
        setPlaying(false);
      });
    }

    return () => {
      mounted = false;
      try { a.pause(); } catch {}
      a.removeEventListener('canplay', onCanPlay);
      a.removeEventListener('error', onError);
      if (audioRef.current && audioRef.current !== a) {
        try { audioRef.current.pause(); } catch {}
      }
    };
  }, []);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
      return;
    }
    try {
      await a.play();
      setPlaying(true);
      setError(null);
    } catch (err) {
      console.warn('Play attempt failed:', err);
      setError('Playback blocked — tap to allow audio.');
    }
  };

  return (
    <div className="fixed bottom-12 left-6 z-50 flex items-center gap-4 text-white bg-black/80 backdrop-blur-md p-3 rounded-r-xl border-l-4 border-red-600 shadow-lg shadow-red-900/20">
      <div className="flex items-center gap-2">
         <Radio size={16} className={`text-red-600 ${playing ? 'animate-pulse' : ''}`} />
         <div className="flex flex-col w-32">
            <span className="text-[10px] text-gray-400 font-['Space_Grotesk'] uppercase tracking-widest">SYSTEM AUDIO</span>
            <div className="overflow-hidden whitespace-nowrap">
                <span className="text-xs font-['Anton'] uppercase text-white tracking-widest">HEAVY ROTATION</span>
            </div>
         </div>
      </div>
      <div className="flex items-center gap-3 border-l border-gray-700 pl-3">
        <button onClick={togglePlay} className="hover:text-red-500 transition-colors">
          {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        {!ready && <span className="text-xs text-gray-400 ml-2">Loading…</span>}
        {error && <span className="text-xs text-yellow-400 ml-2">{error}</span>}
      </div>
    </div>
  );
};

const WaitlistModal = ({ isOpen, onClose, user, onRegisterSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    instagram: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (user) {
      // User is logged in - register for drop
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/register-drop`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ details: NEXT_DROP.name })
        });
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to register');
        
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // User not logged in - register account first
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        
        // After successful registration, automatically register for the drop
        try {
          const dropRes = await fetch(`${API_BASE_URL}/api/users/register-drop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ details: NEXT_DROP.name })
          });
          
          if (!dropRes.ok) {
            console.error('Failed to register drop interest automatically');
            // Don't fail the registration, just log the error
          }
        } catch (dropErr) {
          console.error('Error registering drop interest:', dropErr);
          // Don't fail the registration, just log the error
        }
        
        setSuccess(true);
        setTimeout(() => {
          onRegisterSuccess();
          onClose();
          setSuccess(false);
        }, 2000);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-[#111] border border-gray-800 p-8 w-full max-w-md relative z-10">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
            
            {success ? (
              <div className="text-center py-8">
                <h2 className="text-3xl font-['Anton'] text-green-500 uppercase mb-2">SUCCESS!</h2>
                <p className="text-gray-400 font-['Space_Grotesk']">
                  {user ? "You're registered for the drop!" : "Account created and registered for drop!"}
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-['Anton'] text-white uppercase mb-2">
                  {user ? 'Confirm Drop Interest' : 'Register Your Interest'}
                </h2>
                <p className="text-gray-500 font-['Space_Grotesk'] text-xs mb-6">
                  {user ? `Register for ${NEXT_DROP.name}` : 'Create account & register for drop'}
                </p>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-900/30 border border-red-600 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4 font-['Space_Grotesk']">
                  {user ? (
                    <div className="space-y-3 text-gray-400 text-sm">
                      <p>Logged in as: <span className="text-white">{user.email}</span></p>
                      <p>Product: <span className="text-white">{NEXT_DROP.name}</span></p>
                      <p className="text-xs text-gray-500">
                        Your interest will be recorded with your account details.
                      </p>
                    </div>
                  ) : (
                    <>
                      <input 
                        required 
                        placeholder="FULL NAME" 
                        value={formData.name}
                        className="w-full bg-black border border-gray-800 p-4 text-white focus:border-red-600 outline-none uppercase tracking-widest placeholder:text-gray-500" 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      />
                      <input 
                        required 
                        type="email" 
                        placeholder="EMAIL" 
                        value={formData.email}
                        className="w-full bg-black border border-gray-800 p-4 text-white focus:border-red-600 outline-none uppercase tracking-widest placeholder:text-gray-500" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      />
                      <input 
                        required 
                        placeholder="PHONE" 
                        value={formData.phone}
                        className="w-full bg-black border border-gray-800 p-4 text-white focus:border-red-600 outline-none uppercase tracking-widest placeholder:text-gray-500" 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      />
                      <input 
                        placeholder="INSTAGRAM (OPTIONAL)" 
                        value={formData.instagram}
                        className="w-full bg-black border border-gray-800 p-4 text-white focus:border-red-600 outline-none uppercase tracking-widest placeholder:text-gray-500" 
                        onChange={(e) => setFormData({...formData, instagram: e.target.value})} 
                      />
                    </>
                  )}
                  <button 
                    disabled={loading} 
                    className="w-full bg-red-600 text-white font-['Anton'] py-4 text-xl hover:bg-white hover:text-black transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "PROCESSING..." : "CONFIRM INTEREST"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- AUTH MODAL (Login/Register) ---
const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '',
    name: '', 
    phone: '', 
    instagram: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/users/register';
      const body = mode === 'login' 
        ? { email: formData.email }
        : { name: formData.name, email: formData.email, phone: formData.phone, instagram: formData.instagram };
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
        setFormData({ email: '', name: '', phone: '', instagram: '' });
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', name: '', phone: '', instagram: '' });
    setError('');
    setSuccess(false);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-[#111] border border-gray-800 p-8 w-full max-w-md relative z-10">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
            
            {success ? (
              <div className="text-center py-8">
                <h2 className="text-3xl font-['Anton'] text-green-500 uppercase mb-2">SUCCESS!</h2>
                <p className="text-gray-400 font-['Space_Grotesk']">
                  {mode === 'login' ? "Logged in successfully!" : "Account created successfully!"}
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-['Anton'] text-white uppercase mb-2">
                  {mode === 'login' ? 'Login' : 'Register'}
                </h2>
                <p className="text-gray-500 font-['Space_Grotesk'] text-xs mb-6">
                  {mode === 'login' ? 'Enter your email to login' : 'Create a new account'}
                </p>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-900/30 border border-red-600 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4 font-['Space_Grotesk']">
                  {mode === 'register' && (
                    <input 
                      required 
                      placeholder="FULL NAME" 
                      value={formData.name}
                      className="w-full bg-black border border-gray-800 p-4 text-white focus:border-red-600 outline-none uppercase tracking-widest placeholder:text-gray-500" 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  )}
                  <input 
                    required 
                    type="email" 
                    placeholder="EMAIL" 
                    value={formData.email}
                    className="w-full bg-black border border-gray-800 p-4 text-white focus:border-red-600 outline-none uppercase tracking-widest placeholder:text-gray-500" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                  {mode === 'register' && (
                    <>
                      <input 
                        required 
                        placeholder="PHONE" 
                        value={formData.phone}
                        className="w-full bg-black border border-gray-800 p-4 text-white focus:border-red-600 outline-none uppercase tracking-widest placeholder:text-gray-500" 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      />
                      <input 
                        placeholder="INSTAGRAM (OPTIONAL)" 
                        value={formData.instagram}
                        className="w-full bg-black border border-gray-800 p-4 text-white focus:border-red-600 outline-none uppercase tracking-widest placeholder:text-gray-500" 
                        onChange={(e) => setFormData({...formData, instagram: e.target.value})} 
                      />
                    </>
                  )}
                  <button 
                    disabled={loading} 
                    className="w-full bg-red-600 text-white font-['Anton'] py-4 text-xl hover:bg-white hover:text-black transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "PROCESSING..." : mode === 'login' ? "LOGIN" : "CREATE ACCOUNT"}
                  </button>
                  <button 
                    type="button"
                    onClick={switchMode}
                    className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- ACCOUNT DASHBOARD ---
const AccountDashboard = ({ isOpen, onClose, user, initialTab = 'profile' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    instagram: user?.instagram || ''
  });
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        instagram: user.instagram || ''
      });
      if (activeTab === 'orders') {
        fetchOrders();
      }
    }
  }, [isOpen, user, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/orders`, {
        credentials: 'include'
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveMessage('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileData)
      });
      
      if (!res.ok) throw new Error('Failed to update profile');
      
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
        <motion.div 
          initial={{ y: 100, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: 100, opacity: 0 }} 
          className="bg-[#111] border border-gray-800 w-full max-w-4xl max-h-[80vh] overflow-hidden relative z-10 flex flex-col"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <h2 className="text-2xl font-['Anton'] text-white uppercase">My Account</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24} /></button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 border-r border-gray-800 p-4 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                  activeTab === 'profile' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <User size={16} />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                  activeTab === 'orders' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <Package size={16} />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                  activeTab === 'addresses' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <MapPin size={16} />
                Addresses
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-['Anton'] text-white uppercase">Profile Information</h3>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">Name</label>
                      <input
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">Email</label>
                      <input
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-gray-900 border border-gray-800 p-3 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">Phone</label>
                      <input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">Instagram</label>
                      <input
                        value={profileData.instagram}
                        onChange={(e) => setProfileData({...profileData, instagram: e.target.value})}
                        className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none"
                        placeholder="@username"
                      />
                    </div>
                    {saveMessage && (
                      <div className={`p-3 ${saveMessage.includes('success') ? 'bg-green-900/30 border-green-600 text-green-400' : 'bg-red-900/30 border-red-600 text-red-400'} border text-sm`}>
                        {saveMessage}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-red-600 text-white px-8 py-3 font-['Anton'] uppercase tracking-wider hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-['Anton'] text-white uppercase">Order History</h3>
                  {loading ? (
                    <p className="text-gray-400">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={48} className="mx-auto mb-4 text-gray-600" />
                      <p className="text-gray-400">No orders yet</p>
                      <p className="text-sm text-gray-600 mt-2">Your order history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-800 p-4 hover:border-gray-700 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-white">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs uppercase font-bold ${
                              order.status === 'delivered' ? 'bg-green-900/30 text-green-400' :
                              order.status === 'shipped' ? 'bg-blue-900/30 text-blue-400' :
                              'bg-yellow-900/30 text-yellow-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="text-sm text-gray-400">
                                {item.name} - ${item.price}
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between">
                            <span className="text-gray-400">Total</span>
                            <span className="font-bold text-white">${order.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-['Anton'] text-white uppercase">Saved Addresses</h3>
                  <div className="text-center py-12">
                    <MapPin size={48} className="mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">No saved addresses</p>
                    <p className="text-sm text-gray-600 mt-2">Add an address during checkout</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- MAIN APP ---

export default function HeavyShitApp() {
  const [cartOpen, setCartOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountTab, setAccountTab] = useState('profile');
  const [cart, setCart] = useState([]);
  const [hasEntered, setHasEntered] = useState(false);
  const { user, loading, logout, checkAuth } = useAuth();

  const handleOpenAccount = (tab) => {
    setAccountTab(tab);
    setAccountModalOpen(true);
  };

  const enterSite = () => setHasEntered(true);
  
  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } } };

  if (!hasEntered) {
    return (
      <div onClick={enterSite} className="h-screen w-full bg-black text-white flex flex-col items-center justify-center cursor-pointer z-50 selection:bg-red-600">
        <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }} className="font-['Anton'] text-6xl">ENTER</motion.h1>
        <p className="mt-4 font-['Space_Grotesk'] text-sm text-gray-500 tracking-[0.5em] uppercase">Tap to Access / Sound On</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white overflow-x-hidden font-['Space_Grotesk']">
      <Navbar 
        cartCount={cart.length} 
        toggleCart={() => setCartOpen(!cartOpen)} 
        user={user} 
        logout={logout} 
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAccount={handleOpenAccount}
      />
      <RadioPlayer />
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={checkAuth}
      />
      <AccountDashboard
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        user={user}
        initialTab={accountTab}
      />
      <WaitlistModal 
        isOpen={waitlistOpen} 
        onClose={() => setWaitlistOpen(false)} 
        user={user}
        onRegisterSuccess={checkAuth}
      />

      {/* --- CART SIDEBAR --- */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-y-0 right-0 z-[60] w-full md:w-96 bg-[#111] border-l border-gray-800 p-6 shadow-2xl">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-['Anton']">CART ({cart.length})</h2>
               <button onClick={() => setCartOpen(false)}><X /></button>
             </div>
             {cart.length === 0 ? (
               <div className="text-gray-500 text-center mt-20">Your cart is empty.</div>
             ) : (
               <div className="space-y-4">
                 {cart.map((item, idx) => (
                   <div key={idx} className="flex gap-4 border-b border-gray-800 pb-4">
                     <img src={item.image} className="w-16 h-16 object-cover" />
                     <div>
                       <h4 className="font-bold">{item.name}</h4>
                       <p className="text-gray-400">${item.price}</p>
                     </div>
                   </div>
                 ))}
                 <button className="w-full bg-white text-black font-['Anton'] py-3 mt-4 hover:bg-red-600 hover:text-white transition-colors">CHECKOUT</button>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 gap-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex-1 space-y-6 text-center md:text-left z-10 mt-20 md:mt-0">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="inline-block border border-red-600 text-red-600 px-4 py-1 font-['Space_Grotesk'] text-xs uppercase tracking-widest">DROPPING SOON</motion.div>
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="text-6xl md:text-9xl font-['Anton'] uppercase leading-tight">HEAVY<br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">SHIT.</span></motion.h1>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setWaitlistOpen(true)}
            className="group relative bg-white text-black px-10 py-4 font-['Anton'] text-lg tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all duration-300">
            <span className="skew-x-[10deg] inline-block flex items-center gap-2">
              REGISTER YOUR INTEREST NOW <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </div>
        
        <motion.div 
           initial={{ opacity: 0, x: 100, filter: "blur(10px)" }} 
           animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} 
           transition={{ duration: 1 }}
           className="flex-1 w-full max-w-md relative"
        >
           <div className="absolute inset-0 bg-red-600/10 translate-x-4 translate-y-4 border border-red-600/30"></div>
           <img src={NEXT_DROP.image} alt="Hero" className="relative w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 border border-gray-800" />
        </motion.div>
      </section>

      {/* --- SHOP GRID --- */}
      <main id="inventory" className="container mx-auto px-6 py-20">
        <div className="mb-12 border-b border-gray-800 pb-4 flex justify-between items-end">
           <h3 className="font-['Anton'] text-4xl text-gray-500">INVENTORY</h3>
           <span className="text-xs font-['Space_Grotesk'] text-red-600 flex items-center gap-2"><span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span> LIVE STOCK</span>
        </div>
        <motion.div variants={containerVars} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {INITIAL_PRODUCTS.map(p => (
            <motion.div variants={itemVars} key={p.id} className="bg-[#111] border border-gray-900 group relative hover:border-red-900 transition-colors duration-500">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img src={p.image} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${p.status === 'SOLD OUT' ? 'grayscale opacity-40' : 'grayscale group-hover:grayscale-0'}`} />
                {p.status === 'SOLD OUT' && <div className="absolute inset-0 flex items-center justify-center"><div className="bg-red-600 text-white font-['Anton'] text-xl px-4 py-1 -rotate-12">SOLD OUT</div></div>}
              </div>
              <div className="p-4 relative z-10 bg-[#111]">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-['Anton'] text-xl tracking-wide">{p.name}</h3>
                    <span className="font-['Space_Grotesk'] text-sm text-gray-400">${p.price}</span>
                </div>
                {p.status === 'AVAILABLE' ? (
                  <button onClick={() => setCart([...cart, p])} className="w-full mt-2 border border-white/20 py-3 text-xs uppercase hover:bg-white hover:text-black transition-colors font-bold tracking-widest">ADD TO CART</button>
                ) : (
                  <button disabled className="w-full mt-2 border border-gray-800 py-3 text-xs uppercase text-gray-600 cursor-not-allowed tracking-widest">Unavailable</button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* MARQUEE */}
      <div className="bg-red-600 text-black py-3 overflow-hidden whitespace-nowrap">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 15 }} className="flex gap-12 font-['Anton'] text-lg uppercase tracking-widest">
           {[...Array(20)].map((_, i) => <span key={i}>NO RESTOCKS • HEAVY SHIT • WORLDWIDE SHIPPING •</span>)}
        </motion.div>
      </div>
    </div>
  );
}
