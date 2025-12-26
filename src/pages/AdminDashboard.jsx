import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter, User, Mail, Phone, Calendar, Package, ArrowLeft } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AdminDashboard() {
  const [drops, setDrops] = useState([]);
  const [filteredDrops, setFilteredDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchDrops();
  }, []);

  useEffect(() => {
    filterAndSortDrops();
  }, [drops, searchTerm, sortBy, sortOrder]);

  const fetchDrops = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/drops`);
      const data = await res.json();
      setDrops(data.drops || []);
    } catch (err) {
      console.error('Failed to fetch drops:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortDrops = () => {
    let filtered = [...drops];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(drop => 
        drop.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drop.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drop.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drop.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'timestamp') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredDrops(filtered);
  };

  const handleExport = () => {
    window.open(`${API_BASE_URL}/api/admin/export-drops`, '_blank');
  };

  const handleGoBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-900 rounded transition-colors"
              title="Back to Home"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-['Anton'] text-red-600 uppercase tracking-wider">ADMIN DASHBOARD</h1>
              <p className="text-sm text-gray-400 font-['Space_Grotesk'] mt-1">Drop Interest Registrations</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-white hover:text-black text-white px-6 py-3 font-['Anton'] text-sm uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, phone, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111] border border-gray-800 pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:border-red-600 outline-none font-['Space_Grotesk']"
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 bg-[#111] border border-gray-800 px-4 py-3 text-white focus:border-red-600 outline-none font-['Space_Grotesk']"
            >
              <option value="timestamp">Date</option>
              <option value="username">Name</option>
              <option value="email">Email</option>
              <option value="details">Product</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-[#111] border border-gray-800 px-4 py-3 hover:border-red-600 transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111] border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-['Space_Grotesk'] uppercase tracking-wider">Total Registrations</p>
                <p className="text-3xl font-['Anton'] text-white mt-1">{drops.length}</p>
              </div>
              <User className="text-gray-600" size={32} />
            </div>
          </div>
          <div className="bg-[#111] border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-['Space_Grotesk'] uppercase tracking-wider">Filtered Results</p>
                <p className="text-3xl font-['Anton'] text-white mt-1">{filteredDrops.length}</p>
              </div>
              <Filter className="text-gray-600" size={32} />
            </div>
          </div>
          <div className="bg-[#111] border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-['Space_Grotesk'] uppercase tracking-wider">Unique Products</p>
                <p className="text-3xl font-['Anton'] text-white mt-1">
                  {new Set(drops.map(d => d.details)).size}
                </p>
              </div>
              <Package className="text-gray-600" size={32} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#111] border border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <p>Loading registrations...</p>
            </div>
          ) : filteredDrops.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p>No registrations found</p>
              {searchTerm && (
                <p className="text-sm text-gray-600 mt-2">Try adjusting your search</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-['Space_Grotesk']">
                <thead className="bg-black border-b border-gray-800">
                  <tr>
                    <th className="text-left p-4 text-xs text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="text-left p-4 text-xs text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="text-left p-4 text-xs text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="text-left p-4 text-xs text-gray-400 uppercase tracking-wider">Phone</th>
                    <th className="text-left p-4 text-xs text-gray-400 uppercase tracking-wider">Product</th>
                    <th className="text-left p-4 text-xs text-gray-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrops.map((drop, index) => (
                    <motion.tr
                      key={drop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors"
                    >
                      <td className="p-4 text-sm text-gray-400 font-mono">
                        {drop.id.slice(-8)}
                      </td>
                      <td className="p-4 text-sm text-white flex items-center gap-2">
                        <User size={14} className="text-gray-600" />
                        {drop.username}
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        <a href={`mailto:${drop.email}`} className="hover:text-red-500 transition-colors flex items-center gap-2">
                          <Mail size={14} />
                          {drop.email}
                        </a>
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        <span className="flex items-center gap-2">
                          <Phone size={14} />
                          {drop.phone}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        <span className="bg-red-900/30 text-red-400 px-3 py-1 text-xs uppercase font-bold inline-block">
                          {drop.details}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(drop.timestamp).toLocaleDateString()}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500 font-['Space_Grotesk']">
          <p>HEAVY SHIT Admin Dashboard • All data is stored locally</p>
        </div>
      </div>
    </div>
  );
}
