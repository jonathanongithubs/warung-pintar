import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { dashboardAPI } from '../../services/api';
import DashboardLayout from './DashboardLayout';

const LaporanPage = () => {
  const { isDarkMode } = useTheme();
  const [dateRange, setDateRange] = useState({ 
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPendapatan: 0, totalPengeluaran: 0, labaKotor: 0, totalTransaksi: 0, marginPercentage: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID').format(amount);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.getReports({
        start_date: dateRange.start,
        end_date: dateRange.end,
      });
      const data = response.data.data;
      
      setStats({
        totalPendapatan: data.stats.total_pendapatan,
        totalPengeluaran: data.stats.total_pengeluaran,
        labaKotor: data.stats.laba_kotor,
        totalTransaksi: data.stats.total_transaksi,
        marginPercentage: data.stats.margin_percentage,
      });
      
      setMonthlyData(data.monthly_data);
      setTopProducts(data.top_products);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchReports();
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-4 md:mb-6">
          <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Laporan Keuangan</h2>
          <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Analisis performa bisnis Anda secara mendetail</p>
        </motion.div>

        {/* Date Filter */}
        <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-5 shadow-sm mb-4 md:mb-6`}>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center gap-2 flex-1">
              <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-nowrap`}>Dari:</label>
              <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className={`flex-1 px-3 py-2 text-xs md:text-sm rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 outline-none`} />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-nowrap`}>Sampai:</label>
              <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className={`flex-1 px-3 py-2 text-xs md:text-sm rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 outline-none`} />
            </div>
            <motion.button onClick={handleFilter} className="px-4 md:px-6 py-2 rounded-full text-white text-xs md:text-sm font-medium whitespace-nowrap" style={{ backgroundColor: '#2ECC71' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Filter</motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { label: 'Total Pendapatan', value: stats.totalPendapatan, color: 'green', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', prefix: 'Rp ' },
                { label: 'Total Pengeluaran', value: stats.totalPengeluaran, color: 'red', icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6', prefix: 'Rp ' },
                { label: 'Laba Kotor', value: stats.labaKotor, color: 'blue', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', prefix: 'Rp ' },
                { label: 'Total Transaksi', value: stats.totalTransaksi, color: 'purple', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', prefix: '' },
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.03 }} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 md:p-4 shadow-sm border-l-4 border-${stat.color}-500`}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{stat.label}</p>
                      <motion.p className={`text-sm md:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>{stat.prefix}{formatCurrency(stat.value)}</motion.p>
                    </div>
                    <motion.div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${isDarkMode ? `bg-${stat.color}-900/50` : `bg-${stat.color}-100`} flex items-center justify-center flex-shrink-0 ml-2`} whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                      <svg className={`w-4 h-4 md:w-5 md:h-5 text-${stat.color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Monthly Report Table */}
            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}>
              <div className={`p-4 md:p-5 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-sm md:text-base`}>Ringkasan Bulanan</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      {['Bulan', 'Pendapatan', 'Pengeluaran', 'Laba', 'Transaksi'].map(h => (
                        <th key={h} className={`px-3 md:px-4 py-3 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {monthlyData.map((row, i) => (
                      <motion.tr key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ backgroundColor: isDarkMode ? '#374151' : '#f0fdf4' }} className="transition-colors">
                        <td className={`px-3 md:px-4 py-3 text-xs md:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{row.month}</td>
                        <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-green-600">+Rp {formatCurrency(row.pendapatan)}</td>
                        <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-red-500">-Rp {formatCurrency(row.pengeluaran)}</td>
                        <td className="px-3 md:px-4 py-3 text-xs md:text-sm font-semibold text-blue-600">Rp {formatCurrency(row.laba)}</td>
                        <td className={`px-3 md:px-4 py-3 text-xs md:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{row.transaksi}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Export Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 md:gap-3">
              {['PDF', 'Excel', 'Print'].map((type, i) => (
                <motion.button key={type} className={`px-4 md:px-5 py-2 ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:shadow-md'} rounded-full text-xs md:text-sm font-medium shadow-sm transition-all`} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type === 'PDF' ? 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' : type === 'Excel' ? 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' : 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'} /></svg>
                    Export {type}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Profit Summary */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 md:p-5 shadow-lg cursor-pointer">
              <h3 className="font-semibold text-white mb-2 text-sm md:text-base">Margin Laba</h3>
              <motion.p className="text-3xl md:text-4xl font-bold text-white" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>{stats.marginPercentage}%</motion.p>
              <p className="text-white/70 text-xs mt-1">Margin laba kotor</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-white/80">Target</span>
                  <span className="text-white font-semibold">50%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <motion.div className="bg-white rounded-full h-2" initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1, delay: 0.5 }} />
                </div>
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-5 shadow-sm`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 text-sm md:text-base`}>Produk Terlaris</h3>
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <motion.div key={i} className="flex items-center justify-between" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-600' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>{i + 1}</span>
                      <div>
                        <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{p.name}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{p.sold} terjual</p>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-emerald-600">Rp {formatCurrency(p.revenue)}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Insights */}
            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'} rounded-xl p-4 md:p-5 border`}>
              <div className="flex gap-3">
                <motion.div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </motion.div>
                <div>
                  <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>Insight Cepat</p>
                  <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>Penjualan naik 12% di akhir pekan. Pertimbangkan promo khusus!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default LaporanPage;
