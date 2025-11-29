import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import InvestorLayout from './InvestorLayout';

const InvestorPortofolio = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats] = useState({
    totalInvestasi: 15000000,
    totalPendapatan: 2500000,
    totalLaba: 750000,
    estimasiDividen: 375000,
  });
  const [investments] = useState([
    { id: 1, name: 'Warung Makan Barokah', category: 'Makanan', invested: 5000000, returns: 750000, status: 'aktif' },
    { id: 2, name: 'Kedai Kopi Nusantara', category: 'Minuman', invested: 3500000, returns: 525000, status: 'aktif' },
    { id: 3, name: 'Toko Kelontong Jaya', category: 'Retail', invested: 2500000, returns: 300000, status: 'perhatian' },
  ]);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID').format(amount);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const statCards = [
    { label: 'Total Investasi', value: stats.totalInvestasi, color: 'slate', prefix: 'Rp ' },
    { label: 'Total Pendapatan', value: stats.totalPendapatan, color: 'emerald', prefix: 'Rp ' },
    { label: 'Total Laba', value: stats.totalLaba, color: 'blue', prefix: 'Rp ' },
    { label: 'Estimasi Dividen', value: stats.estimasiDividen, color: 'emerald', prefix: 'Rp ' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      slate: { text: isDarkMode ? 'text-white' : 'text-gray-800' },
      emerald: { text: 'text-emerald-500' },
      blue: { text: 'text-blue-500' },
    };
    return colors[color];
  };

  const handleExportCSV = () => {
    const headers = ['Nama UMKM', 'Kategori', 'Investasi', 'Return', 'Status'];
    const csvContent = [
      headers.join(','),
      ...investments.map(inv => 
        `"${inv.name}","${inv.category}",${inv.invested},${inv.returns},${inv.status}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `portofolio_investasi_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <InvestorLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Portofolio Investasi
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Ringkasan semua investasi Anda
            </p>
          </div>
          <motion.button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ekspor Laporan
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const colorClasses = getColorClasses(stat.color);
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-sm border-l-4 ${
                  stat.color === 'emerald' ? 'border-l-emerald-500' : 
                  stat.color === 'blue' ? 'border-l-blue-500' : 'border-l-gray-400'
                } cursor-pointer`}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate('/investor/laporan')}
              >
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                  {stat.label}
                </p>
                <motion.p 
                  className={`text-2xl font-bold ${colorClasses.text}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {stat.prefix}{formatCurrency(stat.value)}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        {/* Your Investments Section */}
        <motion.div 
          variants={itemVariants}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-lg`}>
              Investasi Anda
            </h3>
          </div>
          
          <div className="p-6">
            {investments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {investments.map((inv, index) => (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-5 cursor-pointer`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate('/investor/temukan')}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{inv.name}</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{inv.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        inv.status === 'aktif' 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {inv.status === 'aktif' ? 'Aktif' : 'Perhatian'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Investasi</p>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Rp {formatCurrency(inv.invested)}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Return</p>
                        <p className="font-semibold text-emerald-500">Rp {formatCurrency(inv.returns)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Animated Chart Icon */}
                <motion.div 
                  className="relative w-24 h-24 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="absolute bottom-0 left-2 w-5 h-12 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{ transformOrigin: 'bottom' }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-10 w-5 h-16 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{ transformOrigin: 'bottom' }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-[72px] w-5 h-20 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    style={{ transformOrigin: 'bottom' }}
                  />
                </motion.div>

                <motion.h4 
                  className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Belum Ada Investasi
                </motion.h4>
                <motion.p 
                  className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6 text-center max-w-sm`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Mulai berinvestasi di UMKM untuk membangun portofolio Anda
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link to="/investor/temukan">
                    <motion.button
                      className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30"
                      whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Temukan Peluang
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Performance Summary */}
        {investments.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm mt-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Ringkasan Performa
              </h3>
              <motion.button
                onClick={() => navigate('/investor/laporan')}
                className="text-sm text-emerald-500 font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Lihat Detail →
              </motion.button>
            </div>
            <div className="h-48 flex items-center justify-center">
              <div className="w-full">
                <svg viewBox="0 0 400 150" className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 1, 2, 3].map((i) => (
                    <line key={i} x1="40" y1={20 + i * 35} x2="380" y2={20 + i * 35} stroke={isDarkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                  ))}
                  {/* Line chart path */}
                  <motion.path
                    d="M 60 100 L 120 80 L 180 90 L 240 60 L 300 40 L 360 30"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  {/* Area under line */}
                  <motion.path
                    d="M 60 100 L 120 80 L 180 90 L 240 60 L 300 40 L 360 30 L 360 125 L 60 125 Z"
                    fill="url(#gradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor={isDarkMode ? '#1F2937' : '#FFFFFF'} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorPortofolio;
