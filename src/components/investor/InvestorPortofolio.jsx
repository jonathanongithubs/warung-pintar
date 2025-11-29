import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import InvestorLayout from './InvestorLayout';

const InvestorPortofolio = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [stats] = useState({
    totalInvestments: 15000000,
    totalRevenue: 2500000,
    totalProfit: 750000,
    estimatedDividend: 375000,
  });
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);

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
    { label: 'Total Investments', value: stats.totalInvestments, color: 'slate', prefix: 'Rp ' },
    { label: 'Total Revenue', value: stats.totalRevenue, color: 'emerald', prefix: 'Rp ' },
    { label: 'Total Profit', value: stats.totalProfit, color: 'blue', prefix: 'Rp ' },
    { label: 'Estimated Dividend', value: stats.estimatedDividend, color: 'emerald', prefix: 'Rp ' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      slate: { text: isDarkMode ? 'text-white' : 'text-gray-800' },
      emerald: { text: 'text-emerald-500' },
      blue: { text: 'text-blue-500' },
    };
    return colors[color];
  };

  return (
    <InvestorLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Investment Portfolio
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Overview of all your investments
          </p>
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
                }`}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
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
              Your Investments
            </h3>
          </div>
          
          <div className="p-8">
            {investments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {investments.map((inv, index) => (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-5`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{inv.name}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{inv.category}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Invested</p>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Rp {formatCurrency(inv.invested)}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Returns</p>
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
                  No Investments Yet
                </motion.h4>
                <motion.p 
                  className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6 text-center max-w-sm`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Start investing in UMKM to build your portfolio
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
                      Discover Opportunities
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Performance Summary (when there are investments) */}
        {investments.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm mt-6`}
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
              Performance Summary
            </h3>
            <div className="h-64 flex items-center justify-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Performance chart will appear here
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorPortofolio;

