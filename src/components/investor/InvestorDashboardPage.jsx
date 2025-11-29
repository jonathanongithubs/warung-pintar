import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import InvestorLayout from './InvestorLayout';

const InvestorDashboardPage = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [activeTimeFilter, setActiveTimeFilter] = useState('30d');
  const [stats, setStats] = useState({
    totalInvestment: 15000000,
    portfolioRevenue: 2500000,
    portfolioNetProfit: 750000,
    avgProfitMargin: 19.9,
  });
  const [investedMSMEs, setInvestedMSMEs] = useState([
    { id: 1, name: 'Warung Makan Sederhana', revenue: 5000000, expenses: 3500000, netProfit: 1500000, status: 'active' },
    { id: 2, name: 'Toko Kelontong Berkah', revenue: 3200000, expenses: 2400000, netProfit: 800000, status: 'active' },
    { id: 3, name: 'Kedai Kopi Nusantara', revenue: 4500000, expenses: 3000000, netProfit: 1500000, status: 'pending' },
  ]);
  const [loading, setLoading] = useState(false);

  const timeFilters = [
    { key: '30d', label: 'Last 30 Days' },
    { key: 'quarter', label: 'This Quarter' },
    { key: '6m', label: 'Last 6 Months' },
    { key: 'all', label: 'All Time' },
  ];

  const formatCurrency = (amount) => `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;

  // Chart data for performance
  const chartData = [
    { month: 'Jun', expenses: 2000000, profit: 500000, revenue: 2500000 },
    { month: 'Jul', expenses: 2200000, profit: 600000, revenue: 2800000 },
    { month: 'Aug', expenses: 2100000, profit: 700000, revenue: 2800000 },
    { month: 'Sep', expenses: 2400000, profit: 650000, revenue: 3050000 },
    { month: 'Oct', expenses: 2300000, profit: 800000, revenue: 3100000 },
    { month: 'Nov', expenses: 2500000, profit: 750000, revenue: 3250000 },
  ];

  // Investment by category
  const categoryData = [
    { name: 'Makanan', percentage: 45, color: '#2ECC71' },
    { name: 'Retail', percentage: 25, color: '#3498DB' },
    { name: 'Jasa', percentage: 20, color: '#9B59B6' },
    { name: 'Lainnya', percentage: 10, color: '#F39C12' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardHover = {
    scale: 1.02,
    transition: { duration: 0.2 },
  };

  // Generate bar chart
  const maxValue = Math.max(...chartData.map(d => d.revenue));
  const barHeight = 160;

  return (
    <InvestorLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header with Time Filters */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Investor Dashboard
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Monitor your investment portfolio
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {timeFilters.map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => setActiveTimeFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTimeFilter === filter.key
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: activeTimeFilter === filter.key ? '0 4px 15px rgba(46, 204, 113, 0.4)' : 'none' }}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { 
              label: 'Total Investment', 
              value: stats.totalInvestment, 
              change: '+15.2%', 
              isPositive: true,
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              bgGradient: 'from-blue-500 to-blue-600',
            },
            { 
              label: 'Portfolio Revenue', 
              value: stats.portfolioRevenue, 
              change: '+18.1%', 
              isPositive: true,
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
              bgGradient: 'from-emerald-500 to-emerald-600',
            },
            { 
              label: 'Portfolio Net Profit', 
              value: stats.portfolioNetProfit, 
              change: '+12.4%', 
              isPositive: true,
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              bgGradient: 'from-amber-500 to-amber-600',
            },
            { 
              label: 'Avg. Profit Margin', 
              value: `${stats.avgProfitMargin}%`, 
              change: '+11.5%', 
              isPositive: true,
              isPercentage: true,
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
              bgGradient: 'from-purple-500 to-purple-600',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={cardHover}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg cursor-pointer overflow-hidden relative`}
            >
              {/* Background Decoration */}
              <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${stat.bgGradient} opacity-10`} />
              
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>{stat.label}</p>
                  <motion.p 
                    className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {stat.isPercentage ? stat.value : formatCurrency(stat.value)}
                  </motion.p>
                  <p className={`text-xs mt-2 font-medium ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.change}
                  </p>
                </div>
                <motion.div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center text-white shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {stat.icon}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Portfolio Performance Chart */}
          <motion.div 
            variants={itemVariants}
            className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Portfolio Performance</h3>
            
            {/* Bar Chart */}
            <div className="relative h-48 flex items-end gap-4 px-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 items-end" style={{ height: barHeight }}>
                    {/* Expenses Bar */}
                    <motion.div
                      className="flex-1 bg-red-400 rounded-t-md"
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.expenses / maxValue) * 100}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    />
                    {/* Profit Bar */}
                    <motion.div
                      className="flex-1 bg-emerald-400 rounded-t-md"
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.profit / maxValue) * 100}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    />
                    {/* Revenue Bar */}
                    <motion.div
                      className="flex-1 bg-emerald-600 rounded-t-md"
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.revenue / maxValue) * 100}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{data.month}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
              {[
                { label: 'Expenses', color: 'bg-red-400' },
                { label: 'Profit', color: 'bg-emerald-400' },
                { label: 'Revenue', color: 'bg-emerald-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Investment by Category */}
          <motion.div 
            variants={itemVariants}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Investment by Category</h3>
            
            {/* Donut Chart Visualization */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {categoryData.reduce((acc, category, index) => {
                  const previousTotal = categoryData.slice(0, index).reduce((sum, c) => sum + c.percentage, 0);
                  const circumference = 2 * Math.PI * 35;
                  const offset = (previousTotal / 100) * circumference;
                  const dashLength = (category.percentage / 100) * circumference;
                  
                  acc.push(
                    <motion.circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke={category.color}
                      strokeWidth="12"
                      strokeDasharray={`${dashLength} ${circumference}`}
                      strokeDashoffset={-offset}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                    />
                  );
                  return acc;
                }, [])}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>4</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Categories</p>
                </div>
              </div>
            </div>

            {/* Category Legend */}
            <div className="space-y-3">
              {categoryData.map((category, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{category.name}</span>
                  </div>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{category.percentage}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Invested MSMEs Table */}
        <motion.div 
          variants={itemVariants}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>All Invested MSMEs</h3>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium"
              whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>UMKM Name</th>
                  <th className={`text-right py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</th>
                  <th className={`text-right py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expenses</th>
                  <th className={`text-right py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Net Profit</th>
                  <th className={`text-center py-3 px-4 text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {investedMSMEs.map((msme, index) => (
                  <motion.tr 
                    key={msme.id}
                    className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-50 hover:bg-gray-50'} transition-colors`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium`}>{msme.name}</td>
                    <td className={`py-4 px-4 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formatCurrency(msme.revenue)}</td>
                    <td className={`py-4 px-4 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formatCurrency(msme.expenses)}</td>
                    <td className="py-4 px-4 text-right text-emerald-500 font-medium">{formatCurrency(msme.netProfit)}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        msme.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        {msme.status === 'active' ? 'Active' : 'Pending'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {investedMSMEs.length === 0 && (
            <div className="text-center py-12">
              <svg className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No investments yet</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorDashboardPage;

