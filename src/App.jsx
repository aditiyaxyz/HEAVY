import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, X, Volume2, VolumeX, ArrowRight, ExternalLink } from 'lucide-react';

// --- CONFIGURATION ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzE_cMb0SHSeS0-9P8NC6PpD7OGm23NQwLZkaWz8jtq-WwATCOT7MkbCxfeBhie6dReMA/exec"; 

// MUSIC
const VIBE_TRACK = "https://cdn.pixabay.com/audio/2022/03/24/audio_341e33f393.mp3"; 
const PLAYLIST_URL = "https://music.youtube.com/playlist?list=PLw-VjHDlEOgvW3t1rHKs82sXOOquWJ6X2";
const TRACK_NAME = "HEAVY ROTATION [TRAP]";

// --- COMPONENTS ---

const Navbar = ({ cartCount, toggleCart, user, openRegister }) => (
  <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-6 bg-black/90 backdrop-blur-md border-b border-gray-900 text-white">
    <div className="text-2xl font-['Anton'] tracking-wider cursor-pointer text-red-600">HEAVY SHIT.</div>
    <div className="flex items-center gap-6 font-['Space_Grotesk']">
      {user ? (
        <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-green-400">
          <User size={16} /> {user.Name}
        </span>
      ) : (
        <button onClick={openRegister} className="flex items-center gap-2 hover:text-red-500 transition-colors text-sm uppercase tracking-widest">
          <User size={18} /> JOIN UNIT
        </button>
      )}
      <button onClick={toggleCart} className="relative hover:text-red-500 transition-colors">
        <ShoppingBag size={24} />
        {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
      </button>
    </div>
  </nav>
);

const MusicPlayer = ({ isPlaying, togglePlay }) => (
  <div className="fixed bottom-12 left-6 z-50 flex flex-col items-start gap-2 mix-blend-difference text-white">
    <div className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
      <button onClick={togglePlay} className="p-2 border border-white/20 rounded-full hover:bg-white/10">
        {isPlaying ? <Volume2 size={20} className="text-red-500 animate-pulse" /> : <VolumeX size={20} />}
      </button>
      <div className="font-['Space_Grotesk'] text-xs tracking-widest uppercase flex flex-col">
        <span className="text-gray-400 text-[10px]">Now Playing</span>
        <span className={isPlaying ? "text-red-500" : "text-gray-500"}>{TRACK_NAME}</span>
      </div>
    </div>
    <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="ml-1 text-[10px] font-['Space_Grotesk'] text-gray-500 hover:text-red-500 flex items-center gap-1 uppercase tracking-wider">
      <ExternalLink size={10} /> Open Playlist
    </a>
  </div>
);

// --- DUAL MODE MODAL (Register vs Waitlist) ---
const ProfileModal = ({ isOpen, onClose, user, setUser, mode }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ Name: '', Email: '', Phone: '', Size: 'M', Instagram: '' });

  // Reset form when opening
  useEffect(() => {
    if (isOpen && !user) setFormData({ Name: '', Email: '', Phone: '', Size: 'M', Instagram: '' });
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formBody = new FormData();
      Object.keys(formData).forEach(key => formBody.append(key, formData[key]));
      
      // DETERMINE ACTION BASED ON MODE
      const action = mode === 'WAITLIST' ? '?action=waitlist' : '?action=register';
      
      await fetch(GOOGLE_SCRIPT_URL + action, { method: 'POST', body: formBody });
      
      // Only save to local storage if it's the main registration
      if (mode === 'REGISTER') {
        localStorage.setItem('heavy_user', JSON.stringify(formData));
        setUser(formData);
      }
      
      alert(mode === 'WAITLIST' ? "ADDED TO WAITLIST." : "WELCOME TO THE UNIT.");
      setLoading(false);
      onClose();

    } catch (err) {
      console.error("Sheet Error", err);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#111] border border-gray-800 p-8 w-full max-w-md relative z-10">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
            
            <h2 className="text-3xl font-['Anton'] text-white uppercase mb-2">
              {mode === 'WAITLIST' ? "SECURE YOUR SPOT" : "IDENTIFY YOURSELF"}
            </h2>
            <p className="text-gray-400 font-['Space_Grotesk'] text-sm mb-6">
              {mode === 'WAITLIST' ? "High demand expected. Enter details for access." : "Join the unit. Get drop updates."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 font-['Space_Grotesk']">
              <input required placeholder="FULL NAME" value={formData.Name} className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, Name: e.target.value})} />
              <input required type="email" placeholder="EMAIL ADDRESS" value={formData.Email} className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, Email: e.target.value})} />
              <input required type="tel" placeholder="PHONE NUMBER" value={formData.Phone} className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, Phone: e.target.value})} />
              
              {/* SHOW EXTRA FIELDS ONLY FOR WAITLIST */}
              {mode === 'WAITLIST' && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-top-4">
                  <select value={formData.Size} className="w-1/3 bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, Size: e.target.value})}>
                    <option value="S">Size S</option>
                    <option value="M">Size M</option>
                    <option value="L">Size L</option>
                    <option value="XL">Size XL</option>
                  </select>
                  <input required placeholder="INSTAGRAM @" value={formData.Instagram} className="w-2/3 bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, Instagram: e.target.value})} />
                </div>
              )}

              <button disabled={loading} className="w-full bg-red-600 text-white font-['Anton'] py-4 text-xl hover:bg-white hover:text-black transition-colors uppercase tracking-widest mt-4">
                {loading ? "PROCESSING..." : (mode === 'WAITLIST' ? "JOIN WAITLIST" : "CONFIRM IDENTITY")}
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
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(VIBE_TRACK));

  const [cartOpen, setCartOpen] = useState(false);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('REGISTER'); // 'REGISTER' or 'WAITLIST'
  
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const [products, setProducts] = useState([]);
  const [heroProduct, setHeroProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Audio Setup
  useEffect(() => {
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
  }, []);

  const enterSite = () => {
    setHasEntered(true);
    audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
  };

  const toggleAudio = () => {
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  // Fetch Inventory
  useEffect(() => {
    fetch(GOOGLE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        const hero = data.find(p => p.type === 'HERO');
        const grid = data.filter(p => p.type === 'GRID');
        setHeroProduct(hero);
        setProducts(grid);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  // Load User
  useEffect(() => {
    const savedUser = localStorage.getItem('heavy_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setCartOpen(true);
  };

  const handlePurchase = async (productId) => {
    // Optimistic update
    const updatedProducts = products.map(p => p.id === productId ? { ...p, stock: p.stock - 1 } : p);
    setProducts(updatedProducts);
    if (heroProduct && heroProduct.id === productId) setHeroProduct({ ...heroProduct, stock: heroProduct.stock - 1 });

    await fetch(GOOGLE_SCRIPT_URL + "?action=buy", {
      method: "POST",
      body: JSON.stringify({ id: productId, quantity: 1 })
    });
  };

  // Helper to open specific modals
  const openRegister = () => {
    setModalMode('REGISTER');
    setModalOpen(true);
  };

  const openWaitlist = () => {
    setModalMode('WAITLIST');
    setModalOpen(true);
  };

  if (!hasEntered) {
    return (
      <div onClick={enterSite} className="h-screen w-full bg-black text-white flex flex-col items-center justify-center cursor-pointer z-50">
        <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }} className="font-['Anton'] text-6xl md:text-9xl uppercase tracking-tighter hover:text-red-600 transition-colors">ENTER</motion.h1>
      </div>
    );
  }

  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center font-['Anton']">LOADING INVENTORY...</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pb-20 overflow-x-hidden">
      <Navbar cartCount={cart.length} toggleCart={() => setCartOpen(!cartOpen)} user={user} openRegister={openRegister} />
      <MusicPlayer isPlaying={isPlaying} togglePlay={toggleAudio} />
      
      {/* SHARED MODAL that behaves differently based on mode */}
      <ProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} user={user} setUser={setUser} mode={modalMode} />

      {heroProduct && (
        <section className="min-h-screen flex flex-col md:flex-row items-center justify-center pt-24 px-6 md:px-20 gap-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
          <div className="flex-1 space-y-6 text-center md:text-left z-10">
            <div className="inline-block border border-red-600 text-red-600 px-3 py-1 font-['Space_Grotesk'] text-xs tracking-[0.3em] uppercase">Upcoming Drop • {heroProduct.date || "NOW"}</div>
            <h1 className="text-5xl md:text-8xl font-['Anton'] uppercase leading-none">{heroProduct.name}</h1>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start font-['Space_Grotesk'] text-gray-400">
               <span className="text-white text-xl font-bold">${heroProduct.price}</span>
               <span className="text-red-500 text-xl font-bold">{heroProduct.stock} LEFT</span>
            </div>
            
            {/* HERO BUTTON OPENS WAITLIST MODE */}
            <button onClick={openWaitlist} className="bg-white text-black px-10 py-4 font-['Anton'] text-xl tracking-widest uppercase hover:bg-red-600 hover:text-white transition-colors">
              JOIN THE WAITLIST
            </button>
          </div>
          <div className="flex-1 w-full max-w-md relative">
             <div className="relative aspect-[3/4] bg-[#111] overflow-hidden border border-gray-800">
               <img src={heroProduct.image} className="w-full h-full object-cover" />
             </div>
          </div>
        </section>
      )}

      <div className="h-24 w-full flex items-center justify-center"><ArrowRight className="text-gray-800 rotate-90" size={32} /></div>

      <main className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
        {products.map(p => (
          <div key={p.id} className="bg-[#111] border border-gray-900">
            <div className="aspect-[3/4] overflow-hidden relative">
              <img src={p.image} className={`w-full h-full object-cover ${p.stock <= 0 ? 'grayscale opacity-50' : ''}`} />
              {p.stock <= 0 && <div className="absolute inset-0 flex items-center justify-center"><span className="font-['Anton'] text-2xl border-2 border-white px-3 -rotate-12">SOLD OUT</span></div>}
            </div>
            <div className="p-4">
              <h3 className="font-['Anton'] text-lg">{p.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="font-['Space_Grotesk']">${p.price}</span>
                {p.stock > 0 ? (
                  <button onClick={() => { addToCart(p); handlePurchase(p.id); }} className="text-xs text-red-500 font-bold uppercase hover:text-white">Add +</button>
                ) : (
                   <span className="text-xs text-gray-500 font-bold uppercase">UNAVAILABLE</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
