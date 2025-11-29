import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import InvestorLayout from './InvestorLayout';

const InvestorLaporan = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({ start: '2025-11-01', end: '2025-11-28' });
  const [activeReport, setActiveReport] = useState('summary');
  const [stats] = useState({
    totalReturns: 2850000,
    totalDividends: 750000,
    portfolioGrowth: 23.5,
    avgROI: 18.2,
  });
  const [monthlyReturns] = useState([
    { month: 'Jun 2025', investment: 10000000, returns: 280000, roi: 2.8 },
    { month: 'Jul 2025', investment: 12000000, returns: 350000, roi: 2.9 },
    { month: 'Aug 2025', investment: 12000000, returns: 420000, roi: 3.5 },
    { month: 'Sep 2025', investment: 14000000, returns: 490000, roi: 3.5 },
    { month: 'Oct 2025', investment: 15000000, returns: 560000, roi: 3.7 },
    { month: 'Nov 2025', investment: 15000000, returns: 750000, roi: 5.0 },
  ]);
  const [investmentBreakdown] = useState([
    { umkm: 'Warung Makan Barokah', invested: 5000000, returns: 850000, roi: 17.0, status: 'excellent' },
    { umkm: 'Kedai Kopi Nusantara', invested: 4000000, returns: 720000, roi: 18.0, status: 'excellent' },
    { umkm: 'Toko Kelontong Jaya', invested: 3500000, returns: 525000, roi: 15.0, status: 'good' },
    { umkm: 'Laundry Express', invested: 2500000, returns: 450000, roi: 18.0, status: 'excellent' },
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

  const reportTabs = [
    { key: 'summary', label: 'Summary' },
    { key: 'returns', label: 'Returns' },
    { key: 'breakdown', label: 'Breakdown' },
  ];

  const statCards = [
    { label: 'Total Returns', value: stats.totalReturns, prefix: 'Rp ', color: 'emerald' },
    { label: 'Total Dividends', value: stats.totalDividends, prefix: 'Rp ', color: 'blue' },
    { label: 'Portfolio Growth', value: stats.portfolioGrowth, suffix: '%', color: 'purple' },
    { label: 'Average ROI', value: stats.avgROI, suffix: '%', color: 'orange' },
  ];

  // Generate chart data for returns
  const chartHeight = 180;
  const chartWidth = monthlyReturns.length * 100;
  const maxReturns = Math.max(...monthlyReturns.map(m => m.returns));

  return (
    <InvestorLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Investment Reports
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Track your investment performance and returns
            </p>
          </div>
          
          {/* Date Range */}
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className={`px-3 py-2 rounded-lg border text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-800'
              } focus:border-emerald-500 outline-none`}
            />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className={`px-3 py-2 rounded-lg border text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-800'
              } focus:border-emerald-500 outline-none`}
            />
            <motion.button
              className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Export
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-sm relative overflow-hidden group`}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Decorative gradient */}
              <motion.div 
                className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 bg-${stat.color}-500`}
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                {stat.label}
              </p>
              <motion.p 
                className={`text-2xl font-bold ${
                  stat.color === 'emerald' ? 'text-emerald-500' :
                  stat.color === 'blue' ? 'text-blue-500' :
                  stat.color === 'purple' ? 'text-purple-500' :
                  'text-orange-500'
                }`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {stat.prefix}{typeof stat.value === 'number' && stat.prefix ? formatCurrency(stat.value) : stat.value}{stat.suffix}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Report Tabs */}
        <motion.div variants={itemVariants} className="flex gap-2 mb-6">
          {reportTabs.map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveReport(tab.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeReport === tab.key
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Summary View */}
        {activeReport === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Returns Chart */}
            <motion.div 
              variants={itemVariants}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}
            >
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Monthly Returns Trend
              </h3>
              
              <div className="h-56 overflow-x-auto">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} className="w-full h-full min-w-[400px]">
                  {/* Grid lines */}
                  {[0, 1, 2, 3].map((i) => (
                    <line 
                      key={i} 
                      x1="40" 
                      y1={20 + i * 50} 
                      x2={chartWidth - 20} 
                      y2={20 + i * 50} 
                      stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
                      strokeWidth="1" 
                      strokeDasharray="4"
                    />
                  ))}
                  
                  {/* Area path */}
                  <defs>
                    <linearGradient id="returnsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  
                  {/* Line and Area */}
                  <motion.path
                    d={monthlyReturns.map((m, i) => {
                      const x = 60 + i * 80;
                      const y = chartHeight - (m.returns / maxReturns) * (chartHeight - 40) + 10;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  
                  {/* Data points */}
                  {monthlyReturns.map((m, i) => {
                    const x = 60 + i * 80;
                    const y = chartHeight - (m.returns / maxReturns) * (chartHeight - 40) + 10;
                    return (
                      <g key={i}>
                        <motion.circle
                          cx={x}
                          cy={y}
                          r="6"
                          fill={isDarkMode ? '#1F2937' : 'white'}
                          stroke="#10B981"
                          strokeWidth="3"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          whileHover={{ scale: 1.5 }}
                        />
                        <text 
                          x={x} 
                          y={chartHeight + 30} 
                          textAnchor="middle" 
                          className="text-[10px]" 
                          fill={isDarkMode ? '#9CA3AF' : '#6B7280'}
                        >
                          {m.month.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </motion.div>

            {/* ROI Distribution */}
            <motion.div 
              variants={itemVariants}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}
            >
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Investment Performance
              </h3>
              
              <div className="space-y-4">
                {investmentBreakdown.map((inv, index) => (
                  <motion.div 
                    key={inv.umkm}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{inv.umkm}</span>
                      <span className={`text-sm font-semibold ${
                        inv.status === 'excellent' ? 'text-emerald-500' : 'text-blue-500'
                      }`}>
                        {inv.roi}% ROI
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full rounded-full ${
                          inv.status === 'excellent' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${inv.roi * 5}%` }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Returns View */}
        {activeReport === 'returns' && (
          <motion.div 
            variants={itemVariants}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Period</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Total Investment</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Returns</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {monthlyReturns.map((m, index) => (
                    <motion.tr 
                      key={m.month}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}
                    >
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium`}>{m.month}</td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rp {formatCurrency(m.investment)}</td>
                      <td className="px-6 py-4 text-emerald-500 font-medium">Rp {formatCurrency(m.returns)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          m.roi >= 3.5 ? 'bg-emerald-100 text-emerald-600' : 
                          m.roi >= 2.5 ? 'bg-blue-100 text-blue-600' : 
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {m.roi}%
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Breakdown View */}
        {activeReport === 'breakdown' && (
          <motion.div 
            variants={itemVariants}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>UMKM Name</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Invested</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Returns</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>ROI</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {investmentBreakdown.map((inv, index) => (
                    <motion.tr 
                      key={inv.umkm}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}
                    >
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium`}>{inv.umkm}</td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rp {formatCurrency(inv.invested)}</td>
                      <td className="px-6 py-4 text-emerald-500 font-medium">Rp {formatCurrency(inv.returns)}</td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold`}>{inv.roi}%</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          inv.status === 'excellent' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {inv.status === 'excellent' ? 'Excellent' : 'Good'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorLaporan;

