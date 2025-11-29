import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import InvestorLayout from './InvestorLayout';

const InvestorTemukan = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScore, setSelectedScore] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUMKM, setSelectedUMKM] = useState(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  
  const [umkmList] = useState([
    { 
      id: 1, 
      name: 'Kroketin', 
      category: 'makanan', 
      monthlyRevenue: 200000, 
      monthlyProfit: 200000, 
      trustScore: 'C',
      description: 'Usaha kroket kentang homemade dengan berbagai varian rasa',
      location: 'Jakarta Selatan',
      established: '2023',
      totalInvestors: 3,
      minInvestment: 1000000,
    },
    { 
      id: 2, 
      name: 'Kedai Kopi Mantap', 
      category: 'minuman', 
      monthlyRevenue: 5000000, 
      monthlyProfit: 1500000, 
      trustScore: 'A',
      description: 'Kedai kopi specialty dengan biji kopi lokal pilihan',
      location: 'Bandung',
      established: '2021',
      totalInvestors: 12,
      minInvestment: 5000000,
    },
    { 
      id: 3, 
      name: 'Toko Sembako Jaya', 
      category: 'retail', 
      monthlyRevenue: 15000000, 
      monthlyProfit: 3000000, 
      trustScore: 'B',
      description: 'Toko sembako lengkap dengan harga terjangkau',
      location: 'Surabaya',
      established: '2019',
      totalInvestors: 8,
      minInvestment: 2500000,
    },
    { 
      id: 4, 
      name: 'Laundry Express', 
      category: 'jasa', 
      monthlyRevenue: 8000000, 
      monthlyProfit: 2400000, 
      trustScore: 'A',
      description: 'Layanan laundry cepat dengan kualitas premium',
      location: 'Yogyakarta',
      established: '2020',
      totalInvestors: 6,
      minInvestment: 3000000,
    },
    { 
      id: 5, 
      name: 'Martabak Malam', 
      category: 'makanan', 
      monthlyRevenue: 12000000, 
      monthlyProfit: 4000000, 
      trustScore: 'A',
      description: 'Martabak manis dan telur khas dengan topping premium',
      location: 'Jakarta Timur',
      established: '2018',
      totalInvestors: 15,
      minInvestment: 7500000,
    },
  ]);

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'makanan', label: 'Makanan' },
    { value: 'minuman', label: 'Minuman' },
    { value: 'retail', label: 'Retail' },
    { value: 'jasa', label: 'Jasa' },
  ];

  const trustScores = [
    { value: 'all', label: 'Semua Skor' },
    { value: 'A', label: 'A (Sangat Baik)' },
    { value: 'B', label: 'B (Baik)' },
    { value: 'C', label: 'C (Cukup)' },
  ];

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID').format(amount);

  const filteredUMKM = umkmList.filter(umkm => {
    const matchesSearch = umkm.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         umkm.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || umkm.category === selectedCategory;
    const matchesScore = selectedScore === 'all' || umkm.trustScore === selectedScore;
    return matchesSearch && matchesCategory && matchesScore;
  });

  const getTrustScoreColor = (score) => {
    const colors = {
      'A': { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-500' },
      'B': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' },
      'C': { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-500' },
    };
    return colors[score] || colors['C'];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleViewDetails = (umkm) => {
    setSelectedUMKM(umkm);
    setShowDetailModal(true);
  };

  const handleInvestNow = () => {
    setShowDetailModal(false);
    setShowInvestModal(true);
  };

  const handleConfirmInvest = () => {
    alert(`Investasi sebesar Rp ${formatCurrency(investAmount)} ke ${selectedUMKM.name} berhasil diproses!`);
    setShowInvestModal(false);
    setInvestAmount('');
    setSelectedUMKM(null);
  };

  const handleContact = (umkm) => {
    alert(`Menghubungi ${umkm.name}...\nEmail akan dikirim ke pemilik UMKM.`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedScore('all');
  };

  return (
    <InvestorLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Temukan Peluang Investasi
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Cari UMKM yang menjanjikan untuk diinvestasikan
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          variants={itemVariants}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm mb-6`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2 block`}>Cari</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama usaha atau kategori..."
                  className={`w-full px-4 py-3 pl-10 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                  } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                />
                <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2 block`}>Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-800'
                } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all appearance-none cursor-pointer`}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Trust Score Filter */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2 block`}>Skor Kepercayaan</label>
                <select
                  value={selectedScore}
                  onChange={(e) => setSelectedScore(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-800'
                  } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all appearance-none cursor-pointer`}
                >
                  {trustScores.map(score => (
                    <option key={score.value} value={score.value}>{score.label}</option>
                  ))}
                </select>
              </div>
              <motion.button
                onClick={handleResetFilters}
                className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} font-medium rounded-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* UMKM Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredUMKM.map((umkm, index) => {
              const scoreColors = getTrustScoreColor(umkm.trustScore);
              return (
                <motion.div
                  key={umkm.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} hover:shadow-lg transition-all duration-300 group`}
                  whileHover={{ y: -5 }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-lg`}>
                        {umkm.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>
                        {umkm.category}
                      </p>
                    </div>
                    <motion.span 
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${scoreColors.bg} ${scoreColors.text}`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {umkm.trustScore}
                    </motion.span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Pendapatan/Bulan</p>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Rp {formatCurrency(umkm.monthlyRevenue)}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Laba/Bulan</p>
                      <p className="font-semibold text-emerald-500">
                        Rp {formatCurrency(umkm.monthlyProfit)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleViewDetails(umkm)}
                      className="flex-1 py-2.5 bg-emerald-500 text-white font-medium rounded-lg text-sm"
                      whileHover={{ scale: 1.02, boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Lihat Detail
                    </motion.button>
                    <motion.button
                      onClick={() => handleContact(umkm)}
                      className={`px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} font-medium rounded-lg text-sm transition-colors`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Hubungi
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredUMKM.length === 0 && (
          <motion.div 
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-sm text-center`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
              Tidak Ada Hasil
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              Coba sesuaikan pencarian atau filter Anda
            </p>
            <motion.button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Filter
            </motion.button>
          </motion.div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedUMKM && (
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {selectedUMKM.name}
                      </h2>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>
                        {selectedUMKM.category} • {selectedUMKM.location}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => setShowDetailModal(false)}
                      className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Trust Score */}
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl ${getTrustScoreColor(selectedUMKM.trustScore).bg} flex items-center justify-center`}>
                      <span className={`text-2xl font-bold ${getTrustScoreColor(selectedUMKM.trustScore).text}`}>
                        {selectedUMKM.trustScore}
                      </span>
                    </div>
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Skor Kepercayaan</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedUMKM.trustScore === 'A' ? 'Sangat Baik' : selectedUMKM.trustScore === 'B' ? 'Baik' : 'Cukup'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Tentang Usaha</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedUMKM.description}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pendapatan/Bulan</p>
                      <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Rp {formatCurrency(selectedUMKM.monthlyRevenue)}
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Laba/Bulan</p>
                      <p className="text-lg font-bold text-emerald-500">
                        Rp {formatCurrency(selectedUMKM.monthlyProfit)}
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Berdiri Sejak</p>
                      <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {selectedUMKM.established}
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Investor</p>
                      <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {selectedUMKM.totalInvestors}
                      </p>
                    </div>
                  </div>

                  {/* Minimum Investment */}
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'} border ${isDarkMode ? 'border-emerald-800' : 'border-emerald-200'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} mb-1`}>Investasi Minimum</p>
                    <p className="text-2xl font-bold text-emerald-500">
                      Rp {formatCurrency(selectedUMKM.minInvestment)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleInvestNow}
                      className="flex-1 py-3 bg-emerald-500 text-white font-semibold rounded-xl"
                      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Investasi Sekarang
                    </motion.button>
                    <motion.button
                      onClick={() => handleContact(selectedUMKM)}
                      className={`px-6 py-3 border ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'} font-semibold rounded-xl`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Hubungi
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Investment Modal */}
        <AnimatePresence>
          {showInvestModal && selectedUMKM && (
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvestModal(false)}
            >
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-md w-full shadow-2xl`}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Investasi ke {selectedUMKM.name}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                      Jumlah Investasi (Min. Rp {formatCurrency(selectedUMKM.minInvestment)})
                    </label>
                    <input
                      type="number"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      placeholder="Masukkan jumlah"
                      min={selectedUMKM.minInvestment}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                      } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none`}
                    />
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleConfirmInvest}
                      disabled={!investAmount || parseInt(investAmount) < selectedUMKM.minInvestment}
                      className="flex-1 py-3 bg-emerald-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Konfirmasi Investasi
                    </motion.button>
                    <motion.button
                      onClick={() => setShowInvestModal(false)}
                      className={`px-6 py-3 border ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'} font-semibold rounded-xl`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Batal
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

export default InvestorTemukan;
