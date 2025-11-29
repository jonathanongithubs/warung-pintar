import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const InvestorLayout = ({ children }) => {
  const { isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [notifications, setNotifications] = useState(3);

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

  const mainMenuItems = [
    { path: '/investor/dashboard', label: 'Dasbor', icon: 'dashboard' },
    { path: '/investor/portofolio', label: 'Portofolio', icon: 'portfolio' },
    { path: '/investor/laporan', label: 'Laporan', icon: 'report' },
    { path: '/investor/temukan', label: 'Temukan', icon: 'search' },
  ];

  const bottomMenuItems = [
    { path: '/investor/pengaturan', label: 'Pengaturan', icon: 'settings' },
    { path: '/investor/bantuan', label: 'Bantuan', icon: 'help' },
  ];

  const getIcon = (icon, isActive) => {
    const color = isActive ? 'white' : 'rgba(255,255,255,0.6)';
    const icons = {
      dashboard: (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      portfolio: (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      report: (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      search: (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      settings: (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      help: (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      profil: (
        <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    };
    return icons[icon] || null;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isProfilActive = location.pathname === '/investor/profil';

  return (
    <div className={`flex h-screen font-inter transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-[#F8FAFC]'}`}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" 
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'} w-60 transition-transform duration-300 flex flex-col`} 
        style={{ backgroundColor: isDarkMode ? '#0f1f1a' : '#1a1f2e' }}>
        
        {/* Logo Section */}
        <div className="p-5 border-b border-white/10">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white font-bold text-lg">P</span>
            </motion.div>
            <div>
              <span className="text-white font-semibold text-base">Platform</span>
              <p className="text-white/50 text-xs">InvestPro</p>
            </div>
          </motion.div>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white/70 p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-white font-medium text-sm">{user?.nama_usaha || 'Investor'}</p>
          <p className="text-emerald-400 text-xs">untuk Investor</p>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {mainMenuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div 
                  key={item.path} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={item.path} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                  >
                    <motion.span whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 400 }}>
                      {getIcon(item.icon, isActive)}
                    </motion.span>
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div 
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                        layoutId="activeIndicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-white/10 p-3 space-y-1">
          {bottomMenuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div 
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-500 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                >
                  {getIcon(item.icon, isActive)}
                  <span className="text-sm">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
          
          {/* Profil Link */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
          >
            <Link 
              to="/investor/profil" 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${isProfilActive ? 'bg-emerald-500 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              {getIcon('profil', isProfilActive)}
              <span className="text-sm">Profil</span>
            </Link>
          </motion.div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <motion.header 
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 transition-colors duration-300`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(true)} className={`p-2 -ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          <h1 className={`text-base md:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Investor Dashboard
          </h1>
          
          <div className="flex items-center gap-3 md:gap-4 ml-auto">
            {/* Notification Bell */}
            <motion.button 
              className="relative p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications > 0 && (
                <motion.span 
                  className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {notifications}
                </motion.span>
              )}
            </motion.button>

            <div className="text-right hidden sm:block">
              <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user?.email}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Investor</p>
            </div>
            
            <motion.button 
              onClick={handleLogout} 
              className="px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium text-red-500 transition-all whitespace-nowrap"
              style={{ backgroundColor: isDarkMode ? '#4a2020' : '#FFE5E5' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div 
            key={location.pathname} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default InvestorLayout;
