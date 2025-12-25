import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, X, ArrowRight } from 'lucide-react';

// --- MOCK DATA FOR THE "DROP" ---
const CURRENT_DROP = {
  id: 1,
  name: "CONCRETE JUNGLE HOODIE",
  price: 85,
  description: "Heavyweight cotton. Oversized fit. Puff print graphics. Limited to 50 pieces.",
  image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop", 
  stock: 50
};

// --- COMPONENTS ---

const Navbar = ({ cartCount, toggleCart, user, handleLogin }) => (
  <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-6 mix-blend-difference text-white">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-2xl font-['Anton'] tracking-wider cursor-pointer"
    >
      HEAVY SHIT.
    </motion.div>
    
    <div className="flex items-center gap-6 font-['Space_Grotesk']">
      {user ? (
        <span className="hidden md:block text-sm uppercase tracking-widest text-green-400">
          Welcome, {user.displayName}
        </span>
      ) : (
        <button onClick={handleLogin} className="flex items-center gap-2 hover:text-gray-400 transition-colors">
          <User size={20} /> <span className="hidden md:block">LOGIN</span>
        </button>
      )}
      
      <button onClick={toggleCart} className="relative">
        <ShoppingBag size={24} />
        {cartCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold"
          >
            {cartCount}
          </motion.span>
        )}
      </button>
    </div>
  </nav>
);

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const nextTuesday = new Date();
      nextTuesday.setDate(now.getDate() + ((2 + 7 - now.getDay()) % 7 || 7));
      nextTuesday.setHours(12, 0, 0, 0); 

      const diff = nextTuesday - now;
      if (diff <= 0) return "DROP IS LIVE";

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };

    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mb-8">
      <p className="text-sm font-['Space_Grotesk'] text-gray-400 tracking-[0.5em] mb-2">NEXT DROP IN</p>
      <div className="text-4xl md:text-6xl font-['Anton'] text-white tracking-widest tabular-nums">
        {timeLeft}
      </div>
    </div>
  );
};

const ProductStage = ({ addToCart }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full h-screen px-6 pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="w-full md:w-1/2 flex justify-center items-center relative"
      >
        <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[550px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-in-out group">
          <img 
            src={CURRENT_DROP.image} 
            alt="Drop" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-red-600 mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full md:w-1/2 text-white flex flex-col justify-center items-start mt-8 md:mt-0 pl-0 md:pl-12"
      >
        <h2 className="text-6xl md:text-8xl font-['Anton'] leading-none mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
          {CURRENT_DROP.name.split(' ').map((word, i) => (
            <span key={i} className="block">{word}</span>
          ))}
        </h2>
        
        <p className="font-['Space_Grotesk'] text-gray-400 max-w-md mb-8 text-lg border-l-2 border-red-600 pl-4">
          {CURRENT_DROP.description}
        </p>

        <div className="flex items-center gap-8 mb-8">
          <span className="text-3xl font-bold font-['Space_Grotesk']">${CURRENT_DROP.price}</span>
          <span className="text-sm bg-red-600 text-black px-2 py-1 font-bold uppercase">Limited Stock: {CURRENT_DROP.stock}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart(CURRENT_DROP)}
          className="bg-red-600 text-white px-12 py-4 font-['Anton'] text-xl tracking-widest uppercase flex items-center gap-4 group"
        >
          Cop Now
          <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
};

const CartSidebar = ({ isOpen, closeCart, cartItems, removeItem }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="fixed inset-0 bg-black z-40"
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-[#111] z-50 border-l border-gray-800 p-8 flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-['Anton'] text-white tracking-wider">YOUR STASH</h3>
            <button onClick={closeCart} className="text-white hover:text-red-500">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-gray-500 font-['Space_Grotesk'] text-center mt-20">
                CART IS EMPTY.
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 mb-6 border-b border-gray-800 pb-4">
                  <div className="w-20 h-20 bg-gray-800 overflow-hidden">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-['Anton'] tracking-wide">{item.name}</h4>
                    <p className="text-gray-400 font-['Space_Grotesk']">${item.price}</p>
                    <button 
                      onClick={() => removeItem(index)}
                      className="text-xs text-red-500 underline mt-2 uppercase"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 border-t border-gray-800 pt-6">
            <div className="flex justify-between text-white font-['Space_Grotesk'] text-xl mb-6">
              <span>TOTAL</span>
              <span>${cartItems.reduce((acc, item) => acc + item.price, 0)}</span>
            </div>
            <button className="w-full bg-white text-black font-['Anton'] py-4 text-xl hover:bg-gray-200 transition-colors uppercase tracking-widest">
              Checkout
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function HeavyShitApp() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const handleGoogleLogin = async () => {
    setUser({ displayName: "Hypebeast_01", email: "user@example.com" });
    alert("Logged in with Google (Simulated)");
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    setCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden selection:bg-red-600 selection:text-white">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
      
      <Navbar 
        cartCount={cart.length} 
        toggleCart={() => setCartOpen(!cartOpen)} 
        user={user} 
        handleLogin={handleGoogleLogin} 
      />

      <CartSidebar 
        isOpen={cartOpen} 
        closeCart={() => setCartOpen(false)} 
        cartItems={cart}
        removeItem={removeFromCart}
      />

      <main className="relative z-10">
        <div className="absolute top-24 w-full flex justify-center">
          <Countdown />
        </div>
        <ProductStage addToCart={addToCart} />
      </main>

      <div className="fixed bottom-0 w-full bg-red-600 text-black overflow-hidden py-2 whitespace-nowrap z-40">
        <motion.div 
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex gap-8 font-['Anton'] text-lg uppercase tracking-widest"
        >
          <span>Heavy Shit™ 2024</span>
          <span>•</span>
          <span>Worldwide Shipping</span>
          <span>•</span>
          <span>Strictly Limited</span>
          <span>•</span>
          <span>No Restocks</span>
          <span>•</span>
          <span>Heavy Shit™ 2024</span>
          <span>•</span>
          <span>Worldwide Shipping</span>
          <span>•</span>
          <span>Strictly Limited</span>
          <span>•</span>
          <span>No Restocks</span>
        </motion.div>
      </div>
    </div>
  );
}
