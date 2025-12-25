import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, X, Music, Volume2, VolumeX, ArrowRight, ExternalLink } from 'lucide-react';

// --- CONFIGURATION ---
// PASTE YOUR GOOGLE WEB APP URL INSIDE THE QUOTES BELOW:
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_URL_HERE"; 

const VIBE_TRACK = "https://cdn.pixabay.com/audio/2022/03/24/audio_341e33f393.mp3"; 
const PLAYLIST_URL = "https://music.youtube.com/watch?v=xmj2QSbRZLE&list=RDCLAK5uy_kN4eY_ibobGvCBwIJGEGpDjuwzYHIG_iE";
const TRACK_NAME = "HEAVY ROTATION [TRAP]";

// --- UPCOMING DROP DATA ---
const NEXT_DROP = {
  name: "PHANTOM BOMBER JACKET",
  price: 150,
  image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
  stock: 100,
  date: "TUESDAY 12:00 PM"
};

// --- PRODUCT DATA ---
const PRODUCTS = [
  { id: 1, name: "CONCRETE JUNGLE HOODIE", price: 85, tag: "LATEST DROP", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop", stock: 5, status: "AVAILABLE" },
  { id: 2, name: "ACID WASH OVERSIZED TEE", price: 45, tag: "ESSENTIALS", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop", stock: 20, status: "AVAILABLE" },
  { id: 3, name: "VINTAGE CARGO PANTS", price: 120, tag: "ARCHIVE", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop", stock: 0, status: "SOLD OUT" },
  { id: 4, name: "HEAVY METAL TRUCKER", price: 35, tag: "ACCESSORY", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop", stock: 12, status: "AVAILABLE" }
];

// --- COMPONENTS ---

const Navbar = ({ cartCount, toggleCart, user, openProfile }) => (
  <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-6 bg-black/90 backdrop-blur-md border-b border-gray-900 text-white">
    <div className="text-2xl font-['Anton'] tracking-wider cursor-pointer text-red-600">HEAVY SHIT.</div>
    <div className="flex items-center gap-6 font-['Space_Grotesk']">
      {user ? (
        <button onClick={openProfile} className="flex items-center gap-2 text-xs uppercase tracking-widest text-green-400 hover:text-white transition-colors">
          <User size={16} /> {user.Name}
        </button>
      ) : (
        <button onClick={openProfile} className="flex items-center gap-2 hover:text-red-500 transition-colors text-sm uppercase tracking-widest">
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

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(new Audio(VIBE_TRACK));

  useEffect(() => {
    audioRef.current.volume = 0.15;
    audioRef.current.loop = true;
    return () => { audioRef.current.pause(); };
  }, []);

  const togglePlay = () => {
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-12 left-6 z-50 flex flex-col items-start gap-2 mix-blend-difference text-white">
      <div className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
        <button onClick={togglePlay} className="p-2 border border-white/20 rounded-full hover:bg-white/10">
          {playing ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
        </button>
        <div className="font-['Space_Grotesk'] text-xs tracking-widest uppercase flex flex-col">
          <span className="text-gray-400 text-[10px]">Now Playing</span>
          <span className={playing ? "text-red-500" : "text-gray-500"}>{TRACK_NAME}</span>
        </div>
      </div>
      <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="ml-1 text-[10px] font-['Space_Grotesk'] text-gray-500 hover:text-red-500 flex items-center gap-1 uppercase tracking-wider">
        <ExternalLink size={10} /> Open Playlist
      </a>
    </div>
  );
};

const ProfileModal = ({ isOpen, onClose, user, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ Name: '', Email: '', Phone: '', Size: 'M', Instagram: '' });

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (GOOGLE_SCRIPT_URL !== "PASTE_YOUR_URL_HERE") {
      try {
        const formBody = new FormData();
        Object.keys(formData).forEach(key => formBody.append(key, formData[key]));
        await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formBody });
      } catch (err) {
        console.error("Sheet Error", err);
      }
    }

    localStorage.setItem('heavy_user', JSON.stringify(formData));
    setUser(formData);
    setLoading(false);
    alert("PROFILE UPDATED. YOU ARE ON THE LIST.");
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('heavy_user');
    setUser(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#111] border border-gray-800 p-8 w-full max-w-md relative z-10">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
            <h2 className="text-3xl font-['Anton'] text-white uppercase mb-2">Identify Yourself</h2>
            <p className="text-gray-400 font-['Space_Grotesk'] text-sm mb-6">Join the unit. Get drop access.</p>
            <form onSubmit={handleSubmit} className="space-y-4 font-['Space_Grotesk']">
              <input required placeholder="FULL NAME" value={formData.Name} className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, Name: e.target.value})} />
              <input required type="email" placeholder="EMAIL ADDRESS" value={formData.Email} className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, Email: e.target.value})} />
              <input required type="tel" placeholder="PHONE NUMBER" value={formData.Phone} className="w-full bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, Phone: e.target.value})} />
              <div className="flex gap-2">
                <select value={formData.Size} className="w-1/3 bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, Size: e.target.value})}>
                  <option value="S">Size S</option>
                  <option value="M">Size M</option>
                  <option value="L">Size L</option>
                  <option value="XL">Size XL</option>
                </select>
                <input placeholder="INSTAGRAM (OPTIONAL)" value={formData.Instagram} className="w-2/3 bg-black border border-gray-800 p-3 text-white focus:border-red-600 outline-none uppercase" onChange={e => setFormData({...formData, Instagram: e.target.value})} />
              </div>
              <button disabled={loading} className="w-full bg-red-600 text-white font-['Anton'] py-4 text-xl hover:bg-white hover:text-black transition-colors uppercase tracking-widest mt-4">
                {loading ? "SAVING..." : "CONFIRM PROFILE"}
              </button>
            </form>
            {user && (
              <button onClick={handleLogout} className="w-full mt-4 text-xs text-gray-500 underline hover:text-red-500 uppercase">Sign Out / Clear Data</button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- MAIN APP ---

export default function HeavyShitApp() {
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('heavy_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pb-20 overflow-x-hidden">
      <Navbar cartCount={cart.length} toggleCart={() => setCartOpen(!cartOpen)} user={user} openProfile={() => setProfileOpen(true)} />
      <MusicPlayer />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} user={user} setUser={setUser} />

      {/* --- NEW HERO SECTION WITH UPCOMING DROP --- */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center pt-24 px-6 md:px-20 gap-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        
        {/* Left: Info */}
        <div className="flex-1 space-y-6 text-center md:text-left z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block border border-red-600 text-red-600 px-3 py-1 font-['Space_Grotesk'] text-xs tracking-[0.3em] uppercase">
            Upcoming Drop • {NEXT_DROP.date}
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-8xl font-['Anton'] uppercase leading-none">
            {NEXT_DROP.name}
          </motion.h1>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start font-['Space_Grotesk'] text-gray-400">
             <div>
                <span className="block text-white text-xl font-bold">${NEXT_DROP.price}</span>
                <span className="text-xs tracking-widest">PRICE</span>
             </div>
             <div className="h-8 w-[1px] bg-gray-700 hidden md:block"></div>
             <div>
                <span className="block text-red-500 text-xl font-bold">{NEXT_DROP.stock} UNITS</span>
                <span className="text-xs tracking-widest">GLOBAL STOCK</span>
             </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileOpen(true)}
            className="bg-white text-black px-10 py-4 font-['Anton'] text-xl tracking-widest uppercase hover:bg-red-600 hover:text-white transition-colors"
          >
            {user ? "YOU ARE REGISTERED" : "JOIN THE WAITLIST"}
          </motion.button>
        </div>

        {/* Right: Image Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8 }}
          className="flex-1 w-full max-w-md relative group"
        >
           <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
           <div className="relative aspect-[3/4] bg-[#111] overflow-hidden border border-gray-800">
             <img src={NEXT_DROP.image} alt="Next Drop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
             <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 text-white font-['Space_Grotesk'] text-xs border border-gray-700">
               SERIAL: #001 - #100
             </div>
           </div>
        </motion.div>
      </section>

      {/* --- SPACER --- */}
      <div className="h-24 w-full flex items-center justify-center">
         <ArrowRight className="text-gray-800 rotate-90 animate-bounce" size={32} />
      </div>

      {/* --- MAIN SHOP GRID --- */}
      <main className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
        <div className="col-span-full mb-8 border-b border-gray-800 pb-4">
           <h3 className="font-['Anton'] text-3xl text-gray-500">PAST RELEASES / ESSENTIALS</h3>
        </div>
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
                {p.status === 'AVAILABLE' && <button onClick={() => addToCart(p)} className="text-xs text-red-500 font-bold uppercase hover:text-white">Add +</button>}
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
