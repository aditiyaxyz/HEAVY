import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, X, ArrowRight, Music, Volume2, VolumeX, Loader } from 'lucide-react';
import { auth, loginWithGoogle, logout, addToWaitlist } from './firebase'; // Import backend logic

// --- MUSIC CONFIG ---
const VIBE_TRACK = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"; // Royalty Free Lo-Fi
const TRACK_NAME = "MIDNIGHT IN TOKYO - LOFI";

// --- PRODUCT DATA ---
const PRODUCTS = [
  { id: 1, name: "CONCRETE JUNGLE HOODIE", price: 85, tag: "LATEST DROP", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop", stock: 5, status: "AVAILABLE" },
  { id: 2, name: "ACID WASH OVERSIZED TEE", price: 45, tag: "ESSENTIALS", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop", stock: 20, status: "AVAILABLE" },
  { id: 3, name: "VINTAGE CARGO PANTS", price: 120, tag: "ARCHIVE", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop", stock: 0, status: "SOLD OUT" },
  { id: 4, name: "HEAVY METAL TRUCKER", price: 35, tag: "ACCESSORY", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop", stock: 12, status: "AVAILABLE" }
];

// --- COMPONENTS ---

const Navbar = ({ cartCount, toggleCart, user, handleLogin, handleLogout }) => (
  <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-6 bg-black/80 backdrop-blur-md border-b border-gray-900 text-white">
    <div className="text-2xl font-['Anton'] tracking-wider cursor-pointer text-red-600">HEAVY SHIT.</div>
    <div className="flex items-center gap-6 font-['Space_Grotesk']">
      {user ? (
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-xs uppercase tracking-widest text-green-400">Hi, {user.displayName.split(' ')[0]}</span>
          <button onClick={handleLogout} className="text-xs border border-gray-700 px-2 py-1 hover:bg-white hover:text-black transition-colors">LOGOUT</button>
        </div>
      ) : (
        <button onClick={handleLogin} className="flex items-center gap-2 hover:text-red-500 transition-colors text-sm uppercase tracking-widest">
          <User size={18} /> Login
        </button>
      )}
      <button onClick={toggleCart} className="relative hover:text-red-500 transition-colors">
        <ShoppingBag size={24} />
        {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
      </button>
    </div>
  </nav>
);

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(new Audio(VIBE_TRACK));

  useEffect(() => {
    audioRef.current.volume = 0.15; // 15% Volume
    audioRef.current.loop = true;
    return () => { audioRef.current.pause(); };
  }, []);

  const togglePlay = () => {
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-12 left-6 z-50 flex items-center gap-4 mix-blend-difference text-white opacity-80 hover:opacity-100 transition-opacity">
      <button onClick={togglePlay} className="p-2 border border-white/20 rounded-full hover:bg-white/10">
        {playing ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
      </button>
      <div className="font-['Space_Grotesk'] text-xs tracking-widest uppercase flex flex-col">
        <span className="text-gray-400 text-[10px]">Now Playing</span>
        <span className={playing ? "text-red-500" : "text-gray-500"}>{TRACK_NAME}</span>
      </div>
    </div>
  );
};

const WaitlistModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', size: 'M', instagram: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await addToWaitlist(formData);
    setLoading(false);
    if (success) {
      alert("YOU'RE ON THE LIST. WATCH YOUR SIX.");
      onClose();
    } else {
      alert("ERROR. TRY AGAIN.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#111] border border-gray-800 p-8 w-full max-w-md relative z-10">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
            <h2 className="text-3xl font-['Anton'] text-white uppercase mb-2">Secure The Drop</h2>
            <p className="text-gray-400 font-['Space_Grotesk'] text-sm mb-6">Register now. Limited quantity available on launch.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4 font-['Space_Grotesk']">
              <input required placeholder="FULL NAME" className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="EMAIL ADDRESS" className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required type="tel" placeholder="PHONE NUMBER" className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, phone: e.target.value})} />
              
              <div className="flex gap-2">
                <select className="w-1/3 bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, size: e.target.value})}>
                  <option value="S">Size S</option>
                  <option value="M">Size M</option>
                  <option value="L">Size L</option>
                  <option value="XL">Size XL</option>
                </select>
                <input placeholder="INSTAGRAM (OPTIONAL)" className="w-2/3 bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, instagram: e.target.value})} />
              </div>

              <button disabled={loading} className="w-full bg-red-600 text-white font-['Anton'] py-4 text-xl hover:bg-white hover:text-black transition-colors uppercase tracking-widest mt-4">
                {loading ? "PROCESSING..." : "REGISTER INTEREST"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- MAIN APP ---

export default function HeavyShitApp() {
  const [cartOpen, setCartOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => { await loginWithGoogle(); };
  const handleLogout = async () => { await logout(); };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pb-20 overflow-x-hidden">
      <Navbar cartCount={cart.length} toggleCart={() => setCartOpen(!cartOpen)} user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
      <MusicPlayer />
      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />

      {/* Cart Sidebar Logic (Simplified for brevity - same as before) */}
      
      {/* HERO */}
      <div className="h-[70vh] flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-7xl md:text-[10rem] font-['Anton'] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-900 leading-none z-10">
          NEXT DROP
        </motion.h1>
        <button onClick={() => setWaitlistOpen(true)} className="z-10 mt-8 border border-white px-8 py-3 font-['Space_Grotesk'] tracking-[0.3em] hover:bg-white hover:text-black transition-all uppercase text-sm">
          Join the Waitlist
        </button>
      </div>

      {/* PRODUCTS */}
      <main className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
        {PRODUCTS.map(p => (
          <div key={p.id} className="bg-[#111] border border-gray-900 group">
            <div className="aspect-[3/4] overflow-hidden relative">
              <img src={p.image} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${p.status === 'SOLD OUT' ? 'grayscale opacity-50' : ''}`} />
              {p.status === 'SOLD OUT' && <div className="absolute inset-0 flex items-center justify-center"><span className="font-['Anton'] text-2xl border-2 border-white px-3 -rotate-12">SOLD OUT</span></div>}
            </div>
            <div className="p-4">
              <h3 className="font-['Anton'] text-lg">{p.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="font-['Space_Grotesk']">${p.price}</span>
                {p.status === 'AVAILABLE' && <button onClick={() => setCart([...cart, p])} className="text-xs text-red-500 font-bold uppercase hover:text-white">Add +</button>}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* MARQUEE */}
      <div className="fixed bottom-0 w-full bg-red-600 text-black py-2 z-40 overflow-hidden whitespace-nowrap">
        <motion.div animate={{ x: ["0%", "-100%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 25 }} className="flex gap-12 font-['Anton'] text-sm uppercase tracking-widest">
          {[...Array(10)].map((_, i) => (
            <span key={i}>High Quality • Awesome Designs • Limited Quantities • No Restocks • Heavy Shit™ 2024</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
