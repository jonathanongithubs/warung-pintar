import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import InvestorLayout from './InvestorLayout';

const InvestorPortfolioPage = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [stats, setStats] = useState({
    totalInvestments: 0,
    totalRevenue: 0,
    totalProfit: 0,
    estimatedDividend: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      // Set example data
      setStats({
        totalInvestments: 15000000,
        totalRevenue: 2500000,
        totalProfit: 750000,
        estimatedDividend: 375000,
      });
      setInvestments([
        { id: 1, name: 'Warung Makan Bu Sari', category: 'Makanan', invested: 5000000, currentValue: 5750000, returns: 15, status: 'active', monthlyRevenue: 800000 },
        { id: 2, name: 'Toko Sembako Jaya', category: 'Retail', invested: 3000000, currentValue: 3300000, returns: 10, status: 'active', monthlyRevenue: 450000 },
        { id: 3, name: 'Laundry Express', category: 'Jasa', invested: 4000000, currentValue: 4600000, returns: 15, status: 'active', monthlyRevenue: 600000 },
      ]);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <InvestorLayout>
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading portfolio...</p>
          </motion.div>
        </div>
      </InvestorLayout>
    );
  }

  return (
    <InvestorLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Investment Portfolio
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Overview of all your investments
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Investments', value: stats.totalInvestments, color: 'text-gray-800' },
            { label: 'Total Revenue', value: stats.totalRevenue, color: 'text-emerald-500' },
            { label: 'Total Profit', value: stats.totalProfit, color: 'text-emerald-500' },
            { label: 'Estimated Dividend', value: stats.estimatedDividend, color: 'text-emerald-500' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg border-l-4 border-emerald-500`}
            >
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>{stat.label}</p>
              <motion.p 
                className={`text-lg md:text-xl font-bold ${isDarkMode ? (stat.color === 'text-gray-800' ? 'text-white' : stat.color) : stat.color}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {formatCurrency(stat.value)}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Investments Section */}
        <motion.div 
          variants={itemVariants}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}
        >
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Your Investments</h3>
          
          {investments.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Empty State Illustration */}
              <motion.div 
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center"
                animate={{ 
                  rotateY: [0, 180, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </motion.div>
              
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                No Investments Yet
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                Start investing in UMKM to build your portfolio
              </p>
              
              <Link to="/investor/temukan">
                <motion.button
                  className="px-8 py-3 rounded-xl bg-emerald-500 text-white font-semibold"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(46, 204, 113, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Discover Opportunities
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {investments.map((investment, index) => (
                <motion.div
                  key={investment.id}
                  className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-5 transition-all hover:shadow-md`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {investment.name.charAt(0)}
                      </motion.div>
                      <div>
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{investment.name}</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{investment.category}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 md:gap-8">
                      <div className="text-center md:text-right">
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Invested</p>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(investment.invested)}</p>
                      </div>
                      <div className="text-center md:text-right">
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Value</p>
                        <p className="text-sm font-semibold text-emerald-500">{formatCurrency(investment.currentValue)}</p>
                      </div>
                      <div className="text-center md:text-right">
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Returns</p>
                        <p className="text-sm font-semibold text-emerald-500">+{investment.returns}%</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <motion.button
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Details
                      </motion.button>
                      <motion.button
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-white"
                        whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Top Up
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Monthly Target Progress</span>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{formatCurrency(investment.monthlyRevenue)} / Rp 1.000.000</span>
                    </div>
                    <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((investment.monthlyRevenue / 1000000) * 100, 100)}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        {investments.length > 0 && (
          <motion.div variants={itemVariants} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Withdraw Dividends', desc: 'Transfer earnings to your bank', icon: '💰', color: 'from-emerald-400 to-emerald-600' },
              { title: 'Reinvest Profits', desc: 'Grow your portfolio automatically', icon: '📈', color: 'from-blue-400 to-blue-600' },
              { title: 'View Reports', desc: 'Detailed investment analytics', icon: '📊', color: 'from-purple-400 to-purple-600' },
            ].map((action, index) => (
              <motion.div
                key={index}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-lg cursor-pointer overflow-hidden relative`}
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br ${action.color} opacity-20`} />
                <div className="relative z-10">
                  <span className="text-2xl">{action.icon}</span>
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mt-2`}>{action.title}</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{action.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorPortfolioPage;

