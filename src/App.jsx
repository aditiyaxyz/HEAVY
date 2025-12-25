import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, X, ArrowRight, Star } from 'lucide-react';

// --- DATABASE (MOCKED) ---
const PRODUCTS = [
  {
    id: 1,
    name: "CONCRETE JUNGLE HOODIE",
    price: 85,
    tag: "LATEST DROP",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    stock: 5,
    status: "AVAILABLE"
  },
  {
    id: 2,
    name: "ACID WASH OVERSIZED TEE",
    price: 45,
    tag: "ESSENTIALS",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
    stock: 20,
    status: "AVAILABLE"
  },
  {
    id: 3,
    name: "VINTAGE CARGO PANTS",
    price: 120,
    tag: "ARCHIVE",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
    stock: 0,
    status: "SOLD OUT"
  },
  {
    id: 4,
    name: "HEAVY METAL TRUCKER",
    price: 35,
    tag: "ACCESSORY",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
    stock: 12,
    status: "AVAILABLE"
  }
];

// --- COMPONENTS ---

const Navbar = ({ cartCount, toggleCart }) => (
  <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-6 bg-black/80 backdrop-blur-md border-b border-gray-900 text-white">
    <div className="text-2xl font-['Anton'] tracking-wider cursor-pointer text-red-600">
      HEAVY SHIT.
    </div>
    <div className="flex items-center gap-6 font-['Space_Grotesk']">
      <button onClick={toggleCart} className="relative hover:text-red-500 transition-colors">
        <ShoppingBag size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  </nav>
);

const ProductCard = ({ product, addToCart }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative bg-[#111] border border-gray-900 overflow-hidden"
  >
    {/* Image Container */}
    <div className="aspect-[3/4] overflow-hidden relative">
      <img 
        src={product.image} 
        alt={product.name} 
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.status === "SOLD OUT" ? "grayscale opacity-50" : ""}`}
      />
      {product.status === "SOLD OUT" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="font-['Anton'] text-4xl text-white border-4 border-white px-4 py-2 -rotate-12">SOLD OUT</span>
        </div>
      )}
      {product.status !== "SOLD OUT" && (
        <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-colors duration-300" />
      )}
    </div>

    {/* Info */}
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs text-red-500 font-bold tracking-widest mb-1 block">{product.tag}</span>
          <h3 className="text-white font-['Anton'] text-xl tracking-wide">{product.name}</h3>
        </div>
        <span className="text-white font-['Space_Grotesk'] font-bold text-lg">${product.price}</span>
      </div>

      {product.status === "AVAILABLE" ? (
        <button 
          onClick={() => addToCart(product)}
          className="w-full mt-4 bg-white text-black font-['Anton'] py-3 uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors flex justify-center items-center gap-2"
        >
          Add to Cart <ArrowRight size={16} />
        </button>
      ) : (
        <button disabled className="w-full mt-4 bg-gray-800 text-gray-500 font-['Anton'] py-3 uppercase tracking-widest cursor-not-allowed">
          No Stock
        </button>
      )}
    </div>
  </motion.div>
);

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
          className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-[#0a0a0a] z-50 border-l border-gray-800 p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-['Anton'] text-white">YOUR STASH</h3>
            <button onClick={closeCart} className="text-white hover:text-red-500">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 font-['Space_Grotesk']">
                <ShoppingBag size={48} className="mb-4 opacity-20" />
                <p>CART IS EMPTY</p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 mb-6 bg-[#111] p-3 border border-gray-900">
                  <div className="w-16 h-16 bg-gray-800">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-['Anton'] text-sm tracking-wide">{item.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-400 font-['Space_Grotesk']">${item.price}</p>
                      <button onClick={() => removeItem(index)} className="text-xs text-red-500 hover:text-red-400 uppercase font-bold">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 border-t border-gray-900 pt-6">
            <div className="flex justify-between text-white font-['Space_Grotesk'] text-xl mb-6">
              <span>TOTAL</span>
              <span>${cartItems.reduce((acc, item) => acc + item.price, 0)}</span>
            </div>
            <button className="w-full bg-red-600 text-white font-['Anton'] py-4 text-xl hover:bg-white hover:text-black transition-colors uppercase tracking-widest">
              CHECKOUT
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
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pb-20">
      <Navbar cartCount={cart.length} toggleCart={() => setCartOpen(!cartOpen)} />
      <CartSidebar isOpen={cartOpen} closeCart={() => setCartOpen(false)} cartItems={cart} removeItem={removeFromCart} />

      {/* HERO SECTION */}
      <div className="h-[60vh] flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-9xl font-['Anton'] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800"
          >
            New Drops
          </motion.h1>
          <p className="font-['Space_Grotesk'] text-gray-400 tracking-[0.5em] mt-4 uppercase">
            Limited Quantities • Worldwide Shipping
          </p>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <main className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 z-20 relative">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-gray-900 py-10 text-center">
        <p className="font-['Space_Grotesk'] text-gray-600 text-sm">© 2024 HEAVY SHIT. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
