import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, X, Play, Pause, SkipForward, Radio, ArrowRight } from 'lucide-react';

// --- RADIO STATION CONFIG ---
// Nonstop Trap/Phonk Playlist
const RADIO_PLAYLIST = [
  { title: "HEAVY ROTATION", url: "https://cdn.pixabay.com/audio/2022/03/24/audio_341e33f393.mp3" },
  { title: "NIGHT RIDE", url: "https://cdn.pixabay.com/audio/2022/10/25/audio_5575508822.mp3" },
  { title: "DRIFT PHONK", url: "https://cdn.pixabay.com/audio/2023/04/12/audio_6c99c36292.mp3" }
];

// --- INVENTORY MANAGEMENT (Edit this list to change products) ---
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

// --- COMPONENTS ---

const Navbar = ({ cartCount, toggleCart, user, openProfile }) => (
  <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-6 bg-black/90 backdrop-blur-md border-b border-gray-900 text-white">
    <div className="text-2xl font-['Anton'] tracking-wider cursor-pointer text-red-600 hover:tracking-widest transition-all duration-300">HEAVY SHIT.</div>
    <div className="flex items-center gap-6 font-['Space_Grotesk']">
      <button onClick={openProfile} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-red-500 transition-colors">
        <User size={16} /> {user ? user.Name : "JOIN UNIT"}
      </button>
      <button onClick={toggleCart} className="relative hover:text-red-500 transition-colors">
        <ShoppingBag size={24} />
        {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
      </button>
    </div>
  </nav>
);

const RadioPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef(new Audio(RADIO_PLAYLIST[0].url));

  // Handle auto-next track
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      setTrackIndex((prev) => (prev + 1) % RADIO_PLAYLIST.length);
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  // Handle track changes
  useEffect(() => {
    if (playing) {
      audioRef.current.src = RADIO_PLAYLIST[trackIndex].url;
      audioRef.current.play();
    } else {
      // Just update source without playing if paused
      audioRef.current.src = RADIO_PLAYLIST[trackIndex].url;
    }
  }, [trackIndex]);

  const togglePlay = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Click interaction needed first"));
    }
    setPlaying(!playing);
  };

  const skipTrack = () => {
    setTrackIndex((prev) => (prev + 1) % RADIO_PLAYLIST.length);
    if (!playing) setPlaying(true);
  };

  return (
    <div className="fixed bottom-12 left-6 z-50 flex items-center gap-4 text-white bg-black/80 backdrop-blur-md p-3 rounded-r-xl border-l-4 border-red-600 shadow-lg shadow-red-900/20">
      <div className="flex items-center gap-2">
         <Radio size={16} className={`text-red-600 ${playing ? 'animate-pulse' : ''}`} />
         <div className="flex flex-col w-28">
            <span className="text-[10px] text-gray-400 font-['Space_Grotesk'] uppercase tracking-widest">Underground FM</span>
            <div className="overflow-hidden whitespace-nowrap">
                <span className="text-xs font-['Anton'] uppercase animate-marquee inline-block">
                  {RADIO_PLAYLIST[trackIndex].title}
                </span>
            </div>
         </div>
      </div>
      <div className="flex items-center gap-3 border-l border-gray-700 pl-3">
        <button onClick={togglePlay} className="hover:text-red-500 transition-colors">
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={skipTrack} className="hover:text-red-500 transition-colors">
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
};

const ProfileModal = ({ isOpen, onClose, user, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ Name: '', Email: '', Phone: '', Size: 'M' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay for effect
    setTimeout(() => {
      // Save locally to browser
      localStorage.setItem('heavy_user', JSON.stringify(formData));
      setUser(formData);
      setLoading(false);
      onClose();
      alert("WELCOME TO THE UNIT.");
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }} 
            className="bg-[#111] border border-gray-800 p-8 w-full max-w-md relative z-10 shadow-2xl shadow-red-900/20"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
            <h2 className="text-3xl font-['Anton'] text-white uppercase mb-2">Identify Yourself</h2>
            <p className="text-gray-500 font-['Space_Grotesk'] text-xs mb-6">DATA SAVED LOCALLY. NO TRACKING.</p>
            <form onSubmit={handleSubmit} className="space-y-4 font-['Space_Grotesk']">
              <input required placeholder="FULL NAME" className="w-full bg-black border border-gray-800 p-4 text-white focus:border-red-600 outline-none uppercase tracking-widest placeholder:text-gray-700 transition-colors" onChange={e => setFormData({...formData, Name: e.target.value})} />
              <input required type="email" placeholder="EMAIL" className="w-full bg-black border border-gray-800 p-4 text-white focus:border-red-600 outline-none uppercase tracking-widest placeholder:text-gray-700 transition-colors" onChange={e => setFormData({...formData, Email: e.target.value})} />
              <button disabled={loading} className="w-full bg-red-600 text-white font-['Anton'] py-4 text-xl hover:bg-white hover:text-black transition-colors uppercase tracking-widest">
                {loading ? "PROCESSING..." : "JOIN WAITLIST"}
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('heavy_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white overflow-x-hidden font-['Space_Grotesk']">
      <Navbar cartCount={cart.length} toggleCart={() => setCartOpen(!cartOpen)} user={user} openProfile={() => setProfileOpen(true)} />
      <RadioPlayer />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} user={user} setUser={setUser} />

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
        {/* Abstract Background Element */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex-1 space-y-6 text-center md:text-left z-10 mt-20 md:mt-0">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="inline-block border border-red-600 text-red-600 px-4 py-1 font-['Space_Grotesk'] text-xs tracking-[0.3em] uppercase">
            Start a cult
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="text-6xl md:text-9xl font-['Anton'] uppercase leading-none tracking-tighter">
            HEAVY<br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">SHIT.</span>
          </motion.h1>

          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setProfileOpen(true)}
            className="group relative bg-white text-black px-12 py-5 font-['Anton'] text-2xl tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all duration-300 skew-x-[-10deg]"
          >
            <span className="skew-x-[10deg] inline-block flex items-center gap-2">
              {user ? "ACCESS GRANTED" : "ENTER THE VOID"} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
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
      <main className="container mx-auto px-6 py-20">
        <div className="mb-12 border-b border-gray-800 pb-4 flex justify-between items
