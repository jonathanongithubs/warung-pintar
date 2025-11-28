import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import DashboardLayout from './DashboardLayout';

const TransaksiPage = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('manual');
  const [formData, setFormData] = useState({ product: '', qty: 1, price: 0, notes: '' });

  const [transactions] = useState([
    { id: 1, date: '28 Nov 2025', items: 'Kroket Kentang x2', total: 20000, method: 'Cash' },
    { id: 2, date: '28 Nov 2025', items: 'Risol Mayo x3', total: 30000, method: 'QRIS' },
    { id: 3, date: '27 Nov 2025', items: 'Pastel Ayam x5', total: 50000, method: 'Transfer' },
    { id: 4, date: '27 Nov 2025', items: 'Lumpia Udang x2', total: 24000, method: 'Cash' },
    { id: 5, date: '26 Nov 2025', items: 'Cireng Isi x4', total: 16000, method: 'QRIS' },
  ]);

  const quickProducts = [
    { name: 'Kroket Kentang', price: 10000 },
    { name: 'Risol Mayo', price: 10000 },
    { name: 'Pastel Ayam', price: 10000 },
    { name: 'Lumpia Udang', price: 12000 },
    { name: 'Cireng Isi', price: 4000 },
    { name: 'Tahu Isi', price: 3000 },
  ];

  const todayStats = { totalTransaksi: 12, pendapatan: 156000, itemTerjual: 28 };
  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID').format(amount);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Transaksi berhasil disimpan!');
  };

  const selectQuickProduct = (product) => {
    setFormData({ ...formData, product: product.name, price: product.price });
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-4 md:mb-6">
          <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Input Transaksi</h2>
          <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Catat transaksi harian Anda dengan mudah</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <motion.div variants={itemVariants} className="flex gap-2">
              {['manual', 'upload'].map((tab) => (
                <motion.button key={tab} onClick={() => setActiveTab(tab)} 
                  className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === tab ? 'bg-emerald-500 text-white shadow-lg' : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'}`}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {tab === 'manual' ? 'Input Manual' : 'Upload File'}
                </motion.button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {activeTab === 'manual' ? (
                <motion.div key="manual" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 md:space-y-6">
                  <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-6 shadow-sm`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 md:mb-4 text-sm md:text-base`}>Produk Cepat</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                      {quickProducts.map((product, i) => (
                        <motion.button key={i} onClick={() => selectQuickProduct(product)}
                          className={`p-3 md:p-4 rounded-lg border-2 text-left transition-all ${formData.product === product.name ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : isDarkMode ? 'border-gray-600 hover:border-emerald-400 bg-gray-700' : 'border-gray-100 hover:border-emerald-200'}`}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                          <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{product.name}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rp {formatCurrency(product.price)}</p>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-6 shadow-sm`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 md:mb-4 text-sm md:text-base`}>Detail Transaksi</h3>
                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Nama Produk</label>
                          <input type="text" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} placeholder="Ketik produk" className={`w-full text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`} />
                        </div>
                        <div>
                          <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Harga Satuan</label>
                          <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className={`w-full text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Jumlah</label>
                          <div className="flex items-center gap-2">
                            <motion.button type="button" onClick={() => setFormData({ ...formData, qty: Math.max(1, formData.qty - 1) })} className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} flex items-center justify-center`} whileTap={{ scale: 0.9 }}>-</motion.button>
                            <input type="number" value={formData.qty} onChange={(e) => setFormData({ ...formData, qty: Number(e.target.value) })} className={`w-12 md:w-16 text-center text-xs md:text-sm px-2 py-2 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 outline-none`} />
                            <motion.button type="button" onClick={() => setFormData({ ...formData, qty: formData.qty + 1 })} className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} flex items-center justify-center`} whileTap={{ scale: 0.9 }}>+</motion.button>
                          </div>
                        </div>
                        <div>
                          <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Total</label>
                          <motion.p className="text-lg md:text-2xl font-bold text-emerald-600 py-1" key={formData.price * formData.qty} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>Rp {formatCurrency(formData.price * formData.qty)}</motion.p>
                        </div>
                      </div>
                      <div>
                        <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Catatan</label>
                        <input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Opsional..." className={`w-full text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`} />
                      </div>
                      <motion.button type="submit" className="w-full py-3 md:py-4 rounded-xl text-white font-semibold text-sm md:text-base" style={{ backgroundColor: '#2ECC71' }} whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(46, 204, 113, 0.4)" }} whileTap={{ scale: 0.98 }}>Simpan Transaksi</motion.button>
                    </form>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 md:p-8 shadow-sm`}>
                  <motion.div className={`border-2 border-dashed ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} rounded-xl p-8 md:p-12 text-center`} whileHover={{ borderColor: '#2ECC71', backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4' }}>
                    <motion.svg className={`w-12 h-12 md:w-16 md:h-16 mx-auto ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24" animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </motion.svg>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Drag & drop file atau</p>
                    <motion.button className={`px-6 py-2 ${isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-600'} rounded-full text-sm font-medium hover:bg-emerald-100`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Pilih File</motion.button>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-4`}>Format: CSV, XLS, XLSX (maks 10MB)</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4 md:space-y-6">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 md:p-5 shadow-lg cursor-pointer">
              <h3 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Statistik Hari Ini</h3>
              <div className="space-y-3">
                {[{ label: 'Total Transaksi', value: todayStats.totalTransaksi }, { label: 'Pendapatan', value: `Rp ${formatCurrency(todayStats.pendapatan)}` }, { label: 'Item Terjual', value: todayStats.itemTerjual }].map((stat, i) => (
                  <motion.div key={i} className="flex justify-between items-center" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                    <span className="text-white/80 text-xs md:text-sm">{stat.label}</span>
                    <span className="text-white font-semibold text-sm">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-5 shadow-sm`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 md:mb-4 text-sm md:text-base`}>Transaksi Terbaru</h3>
              <div className="space-y-2 md:space-y-3">
                {transactions.slice(0, 5).map((t, i) => (
                  <motion.div key={t.id} className={`flex items-center justify-between p-2 md:p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} whileHover={{ backgroundColor: isDarkMode ? '#374151' : '#f0fdf4' }}>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate`}>{t.items}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t.date}</p>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <p className="text-xs md:text-sm font-semibold text-emerald-600">+Rp {formatCurrency(t.total)}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t.method}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'} rounded-xl p-4 md:p-5 border`}>
              <div className="flex gap-3">
                <motion.div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`} animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </motion.div>
                <div>
                  <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>Tips Cepat</p>
                  <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>Gunakan produk cepat untuk input lebih efisien!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default TransaksiPage;
