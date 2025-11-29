import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import InvestorLayout from './InvestorLayout';

const InvestorDiscoverPage = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScore, setSelectedScore] = useState('all');
  const [umkmList, setUmkmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUMKM, setSelectedUMKM] = useState(null);

  const categories = ['All Categories', 'Makanan', 'Retail', 'Jasa', 'Kerajinan', 'Fashion'];
  const trustScores = ['All Scores', 'A (90-100)', 'B (80-89)', 'C (70-79)'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUmkmList([
        { 
          id: 1, 
          name: 'Kroketin', 
          category: 'Makanan', 
          trustScore: 'C',
          monthlyRevenue: 200000, 
          monthlyProfit: 200000,
          description: 'Usaha kroket dengan berbagai varian rasa yang lezat',
          location: 'Jakarta Selatan',
          established: '2023',
          employees: 3,
          growthRate: 15,
        },
        { 
          id: 2, 
          name: 'Warung Makan Sederhana', 
          category: 'Makanan', 
          trustScore: 'A',
          monthlyRevenue: 5000000, 
          monthlyProfit: 1500000,
          description: 'Warung makan tradisional dengan masakan rumahan berkualitas',
          location: 'Bandung',
          established: '2020',
          employees: 5,
          growthRate: 25,
        },
        { 
          id: 3, 
          name: 'Toko Kelontong Berkah', 
          category: 'Retail', 
          trustScore: 'B',
          monthlyRevenue: 3200000, 
          monthlyProfit: 800000,
          description: 'Toko kelontong lengkap melayani kebutuhan sehari-hari',
          location: 'Surabaya',
          established: '2019',
          employees: 2,
          growthRate: 12,
        },
        { 
          id: 4, 
          name: 'Laundry Kilat Express', 
          category: 'Jasa', 
          trustScore: 'A',
          monthlyRevenue: 4500000, 
          monthlyProfit: 1350000,
          description: 'Jasa laundry kilat dengan kualitas premium',
          location: 'Medan',
          established: '2021',
          employees: 4,
          growthRate: 30,
        },
        { 
          id: 5, 
          name: 'Batik Nusantara', 
          category: 'Fashion', 
          trustScore: 'B',
          monthlyRevenue: 8000000, 
          monthlyProfit: 2400000,
          description: 'Produksi batik tulis dan cap berkualitas tinggi',
          location: 'Yogyakarta',
          established: '2018',
          employees: 8,
          growthRate: 18,
        },
        { 
          id: 6, 
          name: 'Kerajinan Rotan Indah', 
          category: 'Kerajinan', 
          trustScore: 'C',
          monthlyRevenue: 2500000, 
          monthlyProfit: 750000,
          description: 'Pengrajin furniture dan aksesoris dari rotan',
          location: 'Cirebon',
          established: '2022',
          employees: 6,
          growthRate: 10,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;

  const getScoreColor = (score) => {
    switch (score) {
      case 'A': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'B': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'C': return 'bg-amber-100 text-amber-600 border-amber-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const filteredUMKM = umkmList.filter(umkm => {
    const matchesSearch = umkm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         umkm.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || umkm.category === selectedCategory;
    const matchesScore = selectedScore === 'all' || 
                        (selectedScore === 'A (90-100)' && umkm.trustScore === 'A') ||
                        (selectedScore === 'B (80-89)' && umkm.trustScore === 'B') ||
                        (selectedScore === 'C (70-79)' && umkm.trustScore === 'C');
    return matchesSearch && matchesCategory && matchesScore;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <InvestorLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Discover Investment Opportunities
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Find promising UMKM to invest in
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          variants={itemVariants}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg mb-6`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by business name or category..."
                  className={`w-full px-4 py-3 pl-10 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                />
                <svg className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all cursor-pointer`}
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Trust Score Filter */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>Trust Score</label>
                <select
                  value={selectedScore}
                  onChange={(e) => setSelectedScore(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all cursor-pointer`}
                >
                  <option value="all">All Scores</option>
                  {trustScores.slice(1).map(score => (
                    <option key={score} value={score}>{score}</option>
                  ))}
                </select>
              </div>
              <motion.button
                className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium"
                whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Filter
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* UMKM Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredUMKM.map((umkm, index) => (
                <motion.div
                  key={umkm.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-lg`}
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          {umkm.name.charAt(0)}
                        </motion.div>
                        <div>
                          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{umkm.name}</h3>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{umkm.category}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getScoreColor(umkm.trustScore)}`}>
                        {umkm.trustScore}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Revenue</p>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(umkm.monthlyRevenue)}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Profit</p>
                        <p className="font-semibold text-emerald-500">{formatCurrency(umkm.monthlyProfit)}</p>
                      </div>
                    </div>

                    {/* Growth Indicator */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Growth Rate</span>
                        <span className="text-xs text-emerald-500 font-medium">+{umkm.growthRate}%</span>
                      </div>
                      <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <motion.div 
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${umkm.growthRate * 3}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setSelectedUMKM(umkm)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium"
                        whileHover={{ scale: 1.02, boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Details
                      </motion.button>
                      <motion.button
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Contact
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredUMKM.length === 0 && !loading && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className={`w-20 h-20 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>No Results Found</h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your filters or search term</p>
          </motion.div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedUMKM && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUMKM(null)}
            >
              <motion.div
                className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-2xl`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                        {selectedUMKM.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{selectedUMKM.name}</h3>
                        <p className="text-white/80">{selectedUMKM.category}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedUMKM(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Trust Score', value: selectedUMKM.trustScore },
                      { label: 'Location', value: selectedUMKM.location },
                      { label: 'Est.', value: selectedUMKM.established },
                      { label: 'Employees', value: selectedUMKM.employees },
                    ].map((item, i) => (
                      <div key={i} className="text-center">
                        <p className="text-white/70 text-xs">{item.label}</p>
                        <p className="font-semibold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>{selectedUMKM.description}</p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Revenue</p>
                      <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(selectedUMKM.monthlyRevenue)}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Profit</p>
                      <p className="text-xl font-bold text-emerald-500">{formatCurrency(selectedUMKM.monthlyProfit)}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold"
                      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(46, 204, 113, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Invest Now
                    </motion.button>
                    <motion.button
                      className={`px-6 py-3 rounded-xl font-semibold border ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Contact Owner
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorDiscoverPage;

