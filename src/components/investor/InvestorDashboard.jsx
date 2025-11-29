import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import InvestorLayout from './InvestorLayout';

const InvestorDashboard = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('30hari');
  const [stats] = useState({
    totalInvestasi: 15000000,
    pendapatanPortofolio: 2500000,
    labaPortofolio: 750000,
    rataMargin: 19.9,
    pertumbuhanInvestasi: 15.2,
    pertumbuhanPendapatan: 18.1,
    pertumbuhanLaba: 12.4,
    pertumbuhanMargin: 11.5,
  });
  const [chartData] = useState([
    { bulan: 'Jun', pengeluaran: 20, laba: 35, pendapatan: 55 },
    { bulan: 'Jul', pengeluaran: 25, laba: 40, pendapatan: 65 },
    { bulan: 'Agu', pengeluaran: 22, laba: 38, pendapatan: 60 },
    { bulan: 'Sep', pengeluaran: 30, laba: 45, pendapatan: 75 },
    { bulan: 'Okt', pengeluaran: 28, laba: 50, pendapatan: 78 },
    { bulan: 'Nov', pengeluaran: 35, laba: 55, pendapatan: 90 },
  ]);
  const [categoryData] = useState([
    { name: 'Makanan', percentage: 45, color: '#10B981' },
    { name: 'Minuman', percentage: 25, color: '#3B82F6' },
    { name: 'Retail', percentage: 20, color: '#F59E0B' },
    { name: 'Jasa', percentage: 10, color: '#8B5CF6' },
  ]);
  const [investments] = useState([
    { id: 1, name: 'Warung Makan Barokah', pendapatan: 5000000, pengeluaran: 3500000, laba: 1500000, status: 'aktif' },
    { id: 2, name: 'Kedai Kopi Nusantara', pendapatan: 3500000, pengeluaran: 2100000, laba: 1400000, status: 'aktif' },
    { id: 3, name: 'Toko Kelontong Jaya', pendapatan: 2800000, pengeluaran: 2000000, laba: 800000, status: 'perhatian' },
  ]);

  const filterOptions = [
    { key: '30hari', label: '30 Hari Terakhir' },
    { key: 'kuartal', label: 'Kuartal Ini' },
    { key: '6bulan', label: '6 Bulan Terakhir' },
    { key: 'semua', label: 'Semua Waktu' },
  ];

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
    { 
      label: 'Total Investasi', 
      value: stats.totalInvestasi, 
      growth: stats.pertumbuhanInvestasi, 
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    { 
      label: 'Pendapatan Portofolio', 
      value: stats.pendapatanPortofolio, 
      growth: stats.pertumbuhanPendapatan, 
      color: 'emerald',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    { 
      label: 'Laba Bersih Portofolio', 
      value: stats.labaPortofolio, 
      growth: stats.pertumbuhanLaba, 
      color: 'red',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
        </svg>
      ),
    },
    { 
      label: 'Rata-rata Margin', 
      value: stats.rataMargin, 
      growth: stats.pertumbuhanMargin, 
      color: 'purple',
      isPercentage: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50', text: 'text-blue-500', border: 'border-l-blue-500' },
      emerald: { bg: isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-50', text: 'text-emerald-500', border: 'border-l-emerald-500' },
      red: { bg: isDarkMode ? 'bg-red-900/30' : 'bg-red-50', text: 'text-red-500', border: 'border-l-red-500' },
      purple: { bg: isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50', text: 'text-purple-500', border: 'border-l-purple-500' },
    };
    return colors[color];
  };

  const handleExportCSV = () => {
    const headers = ['Nama UMKM', 'Pendapatan', 'Pengeluaran', 'Laba Bersih', 'Status'];
    const csvContent = [
      headers.join(','),
      ...investments.map(inv => 
        `"${inv.name}",${inv.pendapatan},${inv.pengeluaran},${inv.laba},${inv.status}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `investasi_umkm_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const barWidth = 60;
  const chartWidth = chartData.length * (barWidth + 40);
  const chartHeight = 200;

  return (
    <InvestorLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Dasbor Investor
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Pantau portofolio investasi Anda
            </p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((option) => (
              <motion.button
                key={option.key}
                onClick={() => setActiveFilter(option.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeFilter === option.key
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, index) => {
            const colorClasses = getColorClasses(stat.color);
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-sm border-l-4 ${colorClasses.border} relative overflow-hidden group cursor-pointer`}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate('/investor/laporan')}
              >
                <motion.div 
                  className={`absolute inset-0 ${colorClasses.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                      {stat.label}
                    </p>
                    <motion.div 
                      className={`w-10 h-10 rounded-xl ${colorClasses.bg} flex items-center justify-center ${colorClasses.text}`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {stat.icon}
                    </motion.div>
                  </div>
                  
                  <motion.p 
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {stat.isPercentage ? `${stat.value}%` : `Rp ${formatCurrency(stat.value)}`}
                  </motion.p>
                  
                  <div className="flex items-center gap-1 mt-2">
                    <motion.span 
                      className={`text-xs font-medium ${stat.growth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {stat.growth >= 0 ? '+' : ''}{stat.growth}%
                    </motion.span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>dari periode lalu</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div 
            variants={itemVariants}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
              Performa Portofolio
            </h3>
            
            <div className="h-64 overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`} className="w-full h-full min-w-[400px]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <line 
                    key={i} 
                    x1="40" 
                    y1={20 + i * 45} 
                    x2={chartWidth - 20} 
                    y2={20 + i * 45} 
                    stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
                    strokeWidth="1" 
                  />
                ))}
                
                {chartData.map((d, i) => {
                  const x = 60 + i * (barWidth + 40);
                  const expenseHeight = (d.pengeluaran / 100) * chartHeight;
                  const profitHeight = (d.laba / 100) * chartHeight;
                  const revenueHeight = (d.pendapatan / 100) * chartHeight;
                  
                  return (
                    <g key={i}>
                      <motion.rect
                        x={x}
                        y={chartHeight - revenueHeight + 20}
                        width={18}
                        height={revenueHeight}
                        fill="#10B981"
                        rx="4"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        style={{ transformOrigin: 'bottom' }}
                      />
                      <motion.rect
                        x={x + 22}
                        y={chartHeight - profitHeight + 20}
                        width={18}
                        height={profitHeight}
                        fill="#22C55E"
                        rx="4"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.1 + 0.1, duration: 0.5 }}
                        style={{ transformOrigin: 'bottom' }}
                      />
                      <motion.rect
                        x={x + 44}
                        y={chartHeight - expenseHeight + 20}
                        width={18}
                        height={expenseHeight}
                        fill="#EF4444"
                        rx="4"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                        style={{ transformOrigin: 'bottom' }}
                      />
                      <text 
                        x={x + 30} 
                        y={chartHeight + 45} 
                        textAnchor="middle" 
                        className="text-xs" 
                        fill={isDarkMode ? '#9CA3AF' : '#6B7280'}
                      >
                        {d.bulan}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4">
              {[
                { label: 'Pengeluaran', color: '#EF4444' },
                { label: 'Laba', color: '#22C55E' },
                { label: 'Pendapatan', color: '#10B981' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
              Investasi per Kategori
            </h3>
            
            <div className="flex items-center justify-center h-52">
              <svg viewBox="0 0 200 200" className="w-48 h-48">
                {categoryData.reduce((acc, category, index) => {
                  const total = categoryData.reduce((sum, c) => sum + c.percentage, 0);
                  const startAngle = acc.angle;
                  const angle = (category.percentage / total) * 360;
                  const endAngle = startAngle + angle;
                  
                  const startRad = (startAngle - 90) * Math.PI / 180;
                  const endRad = (endAngle - 90) * Math.PI / 180;
                  
                  const x1 = 100 + 70 * Math.cos(startRad);
                  const y1 = 100 + 70 * Math.sin(startRad);
                  const x2 = 100 + 70 * Math.cos(endRad);
                  const y2 = 100 + 70 * Math.sin(endRad);
                  
                  const largeArc = angle > 180 ? 1 : 0;
                  
                  const pathD = `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`;
                  
                  acc.elements.push(
                    <motion.path
                      key={index}
                      d={pathD}
                      fill={category.color}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.15, duration: 0.5 }}
                      style={{ transformOrigin: 'center', cursor: 'pointer' }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/investor/portofolio')}
                    />
                  );
                  
                  return { angle: endAngle, elements: acc.elements };
                }, { angle: 0, elements: [] }).elements}
                
                <circle cx="100" cy="100" r="40" fill={isDarkMode ? '#1F2937' : '#FFFFFF'} />
                <text x="100" y="95" textAnchor="middle" className="text-sm font-bold" fill={isDarkMode ? '#FFFFFF' : '#1F2937'}>
                  Total
                </text>
                <text x="100" y="115" textAnchor="middle" className="text-xs" fill={isDarkMode ? '#9CA3AF' : '#6B7280'}>
                  100%
                </text>
              </svg>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categoryData.map((category, index) => (
                <motion.div 
                  key={category.name}
                  className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} cursor-pointer`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/investor/temukan')}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{category.name}</span>
                  <span className={`text-sm font-semibold ml-auto ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{category.percentage}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Semua UMKM yang Diinvestasi
            </h3>
            <motion.button 
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ekspor CSV
            </motion.button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Nama UMKM</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Pendapatan</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Pengeluaran</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Laba Bersih</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {investments.length > 0 ? investments.map((inv, index) => (
                  <motion.tr 
                    key={inv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                    onClick={() => navigate('/investor/portofolio')}
                  >
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium`}>{inv.name}</td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rp {formatCurrency(inv.pendapatan)}</td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rp {formatCurrency(inv.pengeluaran)}</td>
                    <td className={`px-6 py-4 text-emerald-500 font-medium`}>Rp {formatCurrency(inv.laba)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        inv.status === 'aktif' 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {inv.status === 'aktif' ? 'Aktif' : 'Perhatian'}
                      </span>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={5} className={`px-6 py-12 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="font-medium">Belum ada investasi</p>
                        <p className="text-sm mt-1">Mulai berinvestasi untuk melihat portofolio Anda</p>
                        <motion.button
                          onClick={() => navigate('/investor/temukan')}
                          className="mt-4 px-6 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Temukan UMKM
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorDashboard;
