import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI } from '../../services/api';
import DashboardLayout from './DashboardLayout';

const DashboardPage = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    transaksiHariIni: 0,
    omset: 0,
    labaKotor: 0,
    omzetTarget: 10000000,
    omzetPercentage: 0
  });

  const [chartData, setChartData] = useState([
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 35 },
    { month: 'Apr', value: 50 },
    { month: 'May', value: 40 },
    { month: 'Jun', value: 65 },
    { month: 'Jul', value: 55 },
  ]);

  const [monthlySummary, setMonthlySummary] = useState({
    totalTransaksi: 0,
    produkTerjual: 0,
    pelangganBaru: 0,
  });

  const [tips] = useState([
    { title: 'Tingkatkan Penjualan', desc: 'Tawarkan paket bundling untuk produk populer.' },
    { title: 'Kelola Stok', desc: 'Periksa stok secara berkala untuk menghindari kehabisan.' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getStats();
      const data = response.data.data;
      
      setStats({
        transaksiHariIni: data.stats.transaksi_hari_ini,
        omset: data.stats.omset,
        labaKotor: data.stats.laba_kotor,
        omzetTarget: data.stats.omzet_target,
        omzetPercentage: data.stats.omzet_percentage,
      });
      
      // Normalize chart data values for display
      const maxValue = Math.max(...data.chart_data.map(d => d.value), 1);
      setChartData(data.chart_data.map(d => ({
        month: d.month,
        value: maxValue > 0 ? (d.value / maxValue) * 100 : 0,
        actualValue: d.value,
      })));
      
      setMonthlySummary({
        totalTransaksi: data.monthly_summary.total_transaksi,
        produkTerjual: data.monthly_summary.produk_terjual,
        pelangganBaru: data.monthly_summary.pelanggan_baru,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID').format(amount);

  const generateChartPath = () => {
    const width = 600, height = 200, padding = 40;
    
    // Return empty paths if no data
    if (!chartData || chartData.length === 0) {
      return { linePath: '', areaPath: '', points: [] };
    }
    
    const maxValue = Math.max(...chartData.map(d => d.value), 1);
    const points = chartData.map((d, i) => ({
      x: padding + (i * (width - 2 * padding)) / Math.max(chartData.length - 1, 1),
      y: height - padding - (d.value / maxValue) * (height - 2 * padding)
    }));
    
    if (points.length === 0) {
      return { linePath: '', areaPath: '', points: [] };
    }
    
    const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
    return { linePath, areaPath, points };
  };

  const { linePath, areaPath, points } = generateChartPath();

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const cardHover = { scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", transition: { duration: 0.2 } };

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Greeting */}
        <motion.div variants={itemVariants} className="mb-4 md:mb-6">
          <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{getGreeting()}, {user?.nama_usaha || 'User'}!</h2>
          <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ringkasan operasional hari ini dan performa bisnis Anda.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          {[
            { label: 'Transaksi Hari Ini', value: stats.transaksiHariIni, color: 'blue', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Omset', value: stats.omset, color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Laba Kotor', value: stats.labaKotor, color: 'orange', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={cardHover}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-5 shadow-sm border-l-4 border-${stat.color}-500 cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>{stat.label}</p>
                  <motion.p 
                    className={`text-lg md:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    Rp {formatCurrency(stat.value)}
                  </motion.p>
                  <p className="text-xs text-green-500 mt-1">+6% dari kemarin</p>
                </div>
                <motion.div 
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${isDarkMode ? `bg-${stat.color}-900/50` : `bg-${stat.color}-100`} flex items-center justify-center`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className={`w-4 h-4 md:w-5 md:h-5 text-${stat.color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-6 shadow-sm`}>
              <div className="mb-4">
                <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Omzet vs Target</p>
                <motion.p 
                  className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  Rp {formatCurrency(stats.omzetTarget)}
                </motion.p>
                <p className="text-xs md:text-sm">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Bulan Ini </span>
                  <span className="text-green-500 font-medium">+{stats.omzetPercentage}%</span>
                </p>
              </div>
              <div className="relative h-40 md:h-52 mt-4 overflow-x-auto">
                <svg viewBox="0 0 600 200" className="w-full h-full min-w-[400px]" preserveAspectRatio="xMidYMid meet">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={i} x1="40" y1={40 + i * 30} x2="560" y2={40 + i * 30} stroke={isDarkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                  ))}
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <motion.path d={areaPath} fill="url(#areaGradient)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />
                  <motion.path d={linePath} fill="none" stroke="#2ECC71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
                  {points.map((point, i) => (
                    <motion.circle key={i} cx={point.x} cy={point.y} r="5" fill={isDarkMode ? '#1f2937' : 'white'} stroke="#2ECC71" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }} whileHover={{ scale: 1.5 }} />
                  ))}
                  {chartData.map((d, i) => (
                    <text key={i} x={40 + (i * 520) / (chartData.length - 1)} y="190" textAnchor="middle" className="text-xs" fill={isDarkMode ? '#9CA3AF' : '#9CA3AF'}>{d.month}</text>
                  ))}
                </svg>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/transaksi">
                <motion.button
                  className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-full text-white font-medium text-sm md:text-base"
                  style={{ backgroundColor: '#2ECC71' }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(46, 204, 113, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Transaksi Baru
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 md:space-y-6">
            <motion.div variants={itemVariants} whileHover={cardHover} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-5 shadow-sm cursor-pointer`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 text-sm md:text-base`}>Notifikasi Penting</h3>
              <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada notifikasi</p>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={cardHover} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-5 shadow-sm cursor-pointer`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 text-sm md:text-base`}>Tips Untuk Anda</h3>
              <div className="space-y-3 md:space-y-4">
                {tips.map((tip, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-2 md:gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${isDarkMode ? 'bg-emerald-900/50' : 'bg-emerald-100'} flex items-center justify-center flex-shrink-0`}>
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{tip.title}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tip.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 md:p-5 shadow-lg cursor-pointer"
            >
              <h3 className="font-semibold text-white mb-3 text-sm md:text-base">Ringkasan Bulan Ini</h3>
              <div className="space-y-2 md:space-y-3">
                {[
                  { label: 'Total Transaksi', value: monthlySummary.totalTransaksi.toString() },
                  { label: 'Produk Terjual', value: monthlySummary.produkTerjual.toString() },
                  { label: 'Pelanggan Baru', value: monthlySummary.pelangganBaru.toString() },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    <span className="text-white/80 text-xs md:text-sm">{item.label}</span>
                    <span className="text-white font-semibold text-sm">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default DashboardPage;
