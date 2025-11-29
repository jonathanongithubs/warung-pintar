import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import InvestorLayout from './InvestorLayout';

const InvestorLaporanPage = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({ start: '2025-11-01', end: '2025-11-28' });
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalInvestasi: 15000000,
    totalDividen: 2250000,
    rataReturnBulanan: 5.2,
    umkmAktif: 3,
  });

  const [monthlyData, setMonthlyData] = useState([
    { month: 'Jun 2025', invested: 10000000, returns: 450000, roi: 4.5 },
    { month: 'Jul 2025', invested: 12000000, returns: 600000, roi: 5.0 },
    { month: 'Aug 2025', invested: 12500000, returns: 625000, roi: 5.0 },
    { month: 'Sep 2025', invested: 14000000, returns: 770000, roi: 5.5 },
    { month: 'Oct 2025', invested: 14500000, returns: 725000, roi: 5.0 },
    { month: 'Nov 2025', invested: 15000000, returns: 825000, roi: 5.5 },
  ]);

  const [performanceByUMKM, setPerformanceByUMKM] = useState([
    { name: 'Warung Makan Bu Sari', invested: 5000000, returns: 750000, roi: 15, trend: 'up' },
    { name: 'Toko Sembako Jaya', invested: 3000000, returns: 300000, roi: 10, trend: 'stable' },
    { name: 'Laundry Express', invested: 4000000, returns: 600000, roi: 15, trend: 'up' },
    { name: 'Kedai Kopi Nusantara', invested: 3000000, returns: 450000, roi: 15, trend: 'up' },
  ]);

  const formatCurrency = (amount) => `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Chart calculations
  const maxInvested = Math.max(...monthlyData.map(d => d.invested));
  const maxReturns = Math.max(...monthlyData.map(d => d.returns));

  const exportReport = () => {
    alert('Report exported successfully!');
  };

  return (
    <InvestorLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Investment Reports
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Detailed analytics and performance metrics
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={exportReport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium"
              whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PDF
            </motion.button>
            <motion.button
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Excel
            </motion.button>
          </div>
        </motion.div>

        {/* Date Filter & Report Type */}
        <motion.div 
          variants={itemVariants}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg mb-6`}
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex gap-4">
              <div>
                <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className={`px-4 py-2.5 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 outline-none transition-all`}
                />
              </div>
              <div>
                <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className={`px-4 py-2.5 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 outline-none transition-all`}
                />
              </div>
            </div>
            
            <div className="flex gap-2 ml-auto">
              {['overview', 'detailed', 'comparison'].map((type) => (
                <motion.button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    reportType === type
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Investasi', value: stats.totalInvestasi, icon: '💰', gradient: 'from-blue-400 to-blue-600' },
            { label: 'Total Dividen', value: stats.totalDividen, icon: '📈', gradient: 'from-emerald-400 to-emerald-600' },
            { label: 'Rata-rata Return/Bulan', value: `${stats.rataReturnBulanan}%`, isPercentage: true, icon: '📊', gradient: 'from-purple-400 to-purple-600' },
            { label: 'UMKM Aktif', value: stats.umkmAktif, isNumber: true, icon: '🏪', gradient: 'from-amber-400 to-amber-600' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg overflow-hidden relative`}
            >
              <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20`} />
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>{stat.label}</p>
              <motion.p 
                className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {stat.isPercentage || stat.isNumber ? stat.value : formatCurrency(stat.value)}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Investment Trend Chart */}
          <motion.div 
            variants={itemVariants}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Investment Trend</h3>
            
            <div className="relative h-48 flex items-end gap-2 px-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg cursor-pointer relative group"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.invested / maxInvested) * 180}px` }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    whileHover={{ opacity: 0.8 }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(data.invested)}
                    </div>
                  </motion.div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                    {data.month.split(' ')[0].slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Investment Value</span>
              </div>
            </div>
          </motion.div>

          {/* Returns Chart */}
          <motion.div 
            variants={itemVariants}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Monthly Returns</h3>
            
            <div className="relative h-48">
              <svg className="w-full h-full" viewBox="0 0 400 180">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="40" y1={20 + i * 35} x2="380" y2={20 + i * 35} stroke={isDarkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" />
                ))}
                
                {/* Area */}
                <defs>
                  <linearGradient id="returnsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                
                <motion.path
                  d={`M 40 ${160 - (monthlyData[0].returns / maxReturns) * 140} ${monthlyData.map((d, i) => `L ${40 + i * 68} ${160 - (d.returns / maxReturns) * 140}`).join(' ')} L 380 160 L 40 160 Z`}
                  fill="url(#returnsGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
                
                {/* Line */}
                <motion.path
                  d={`M 40 ${160 - (monthlyData[0].returns / maxReturns) * 140} ${monthlyData.map((d, i) => `L ${40 + i * 68} ${160 - (d.returns / maxReturns) * 140}`).join(' ')}`}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />
                
                {/* Points */}
                {monthlyData.map((d, i) => (
                  <motion.circle
                    key={i}
                    cx={40 + i * 68}
                    cy={160 - (d.returns / maxReturns) * 140}
                    r="5"
                    fill={isDarkMode ? '#1F2937' : 'white'}
                    stroke="#10B981"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  />
                ))}
                
                {/* Month labels */}
                {monthlyData.map((d, i) => (
                  <text key={i} x={40 + i * 68} y="175" textAnchor="middle" className="text-xs" fill={isDarkMode ? '#9CA3AF' : '#6B7280'}>
                    {d.month.split(' ')[0].slice(0, 3)}
                  </text>
                ))}
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Performance by UMKM */}
        <motion.div 
          variants={itemVariants}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}
        >
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Performance by UMKM</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>UMKM</th>
                  <th className={`text-right py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Invested</th>
                  <th className={`text-right py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Returns</th>
                  <th className={`text-right py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>ROI</th>
                  <th className={`text-center py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {performanceByUMKM.map((umkm, index) => (
                  <motion.tr 
                    key={index}
                    className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-50 hover:bg-gray-50'} transition-colors`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                          {umkm.name.charAt(0)}
                        </div>
                        {umkm.name}
                      </div>
                    </td>
                    <td className={`py-4 px-4 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formatCurrency(umkm.invested)}</td>
                    <td className="py-4 px-4 text-right text-emerald-500 font-medium">{formatCurrency(umkm.returns)}</td>
                    <td className="py-4 px-4 text-right text-emerald-500 font-medium">+{umkm.roi}%</td>
                    <td className="py-4 px-4 text-center">
                      <motion.div 
                        className="flex justify-center"
                        animate={umkm.trend === 'up' ? { y: [0, -3, 0] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        {umkm.trend === 'up' && (
                          <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        )}
                        {umkm.trend === 'stable' && (
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                          </svg>
                        )}
                        {umkm.trend === 'down' && (
                          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                          </svg>
                        )}
                      </motion.div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorLaporanPage;

