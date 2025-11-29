import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ChatBot from './InvestorChatBot';

const InvestorLayout = ({ children }) => {
  const { isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const menuItems = [
    { path: '/investor/dashboard', label: 'Dasbor', icon: 'dashboard' },
    { path: '/investor/portofolio', label: 'Portofolio', icon: 'portfolio' },
    { path: '/investor/temukan', label: 'Temukan UMKM', icon: 'search' },
    { path: '/investor/laporan', label: 'Laporan', icon: 'report' },
  ];

  const getIcon = (icon, isActive) => {
    const color = isActive ? 'white' : 'rgba(255,255,255,0.7)';
    switch (icon) {
      case 'dashboard':
        return <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
      case 'portfolio':
        return <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
      case 'search':
        return <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
      case 'report':
        return <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
      case 'profil':
        return <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
      default: return null;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isProfilActive = location.pathname === '/investor/profil';

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/investor/dashboard': return 'Dasbor Investor';
      case '/investor/portofolio': return 'Portofolio Investasi';
      case '/investor/temukan': return 'Temukan UMKM';
      case '/investor/laporan': return 'Laporan Investasi';
      case '/investor/profil': return 'Profil Investor';
      default: return 'Warung Pintar';
    }
  };

  return (
    <div className={`flex h-screen font-inter transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-[#F5F7FA]'}`}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar - Same color as UMKM */}
      <aside className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'} w-56 transition-transform duration-300 flex flex-col`} style={{ backgroundColor: isDarkMode ? '#0a2f24' : '#114B3A' }}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-2 border-b border-white/10">
          <motion.svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 32 32" fill="none" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <path d="M16 2C16 2 6 8 6 18C6 24.627 10.373 30 16 30C21.627 30 26 24.627 26 18C26 8 16 2 16 2Z" fill="#2ECC71"/>
            <path d="M16 8C16 8 12 12 12 18C12 22 13.5 25 16 25C18.5 25 20 22 20 18C20 12 16 8 16 8Z" fill={isDarkMode ? '#0a2f24' : '#114B3A'}/>
          </motion.svg>
          <span className="text-white font-semibold text-sm">Warung Pintar</span>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="ml-auto text-white/70 p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-white font-medium text-sm">{user?.nama_usaha || user?.name || 'Investor'}</p>
          <p className="text-emerald-400 text-xs">Investor</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div key={item.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <Link to={item.path} className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`} style={{ boxShadow: isActive ? '0 4px 15px rgba(46, 204, 113, 0.4)' : 'none' }}>
                  {getIcon(item.icon, isActive)}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Profil at Bottom */}
        <div className="border-t border-white/10 p-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Link to="/investor/profil" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isProfilActive ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`} style={{ boxShadow: isProfilActive ? '0 4px 15px rgba(46, 204, 113, 0.4)' : 'none' }}>
              {getIcon('profil', isProfilActive)}
              <span className="text-sm font-medium">Profil</span>
            </Link>
          </motion.div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <motion.header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 transition-colors duration-300`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(true)} className={`p-2 -ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          )}
          
          <h1 className={`text-base md:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate`}>
            {getPageTitle()}
          </h1>
          
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} truncate max-w-[120px] md:max-w-none`}>{user?.email}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Investor</p>
            </div>
            <motion.button onClick={handleLogout} className="px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap" style={{ backgroundColor: isDarkMode ? '#4a2020' : '#FFE5E5', color: '#FF6B6B' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Keluar</motion.button>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>

      {/* Floating ChatBot */}
      <ChatBot />
    </div>
  );
};

export default InvestorLayout;
