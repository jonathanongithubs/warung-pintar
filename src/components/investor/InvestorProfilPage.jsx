import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import InvestorLayout from './InvestorLayout';

const InvestorProfilPage = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profil');
  const [profileData, setProfileData] = useState({
    name: '', email: '', phone: '', address: ''
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [investmentStats, setInvestmentStats] = useState({
    totalInvested: 15000000,
    activeInvestments: 4,
    totalReturns: 2250000,
    memberSince: 'November 2025',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.nama_usaha || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.alamat || '',
      });
    }
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    try {
      const response = await authAPI.updateProfile({
        nama_usaha: profileData.name,
        phone: profileData.phone,
        alamat: profileData.address,
      });
      setUser(response.data.data);
      alert('Profil berhasil disimpan!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Gagal menyimpan profil.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Password baru tidak cocok');
      return;
    }
    setPasswordLoading(true);
    setPasswordError('');
    try {
      await authAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      alert('Password berhasil diubah!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Gagal mengubah password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatCurrency = (amount) => `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <InvestorLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Profil
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Kelola profil dan preferensi akun Anda
          </p>
        </motion.div>

        {/* Dark Mode Toggle Card */}
        <motion.div 
          variants={itemVariants}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-lg mb-6`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}
                animate={{ rotate: isDarkMode ? 180 : 0 }}
              >
                {isDarkMode ? '🌙' : '☀️'}
              </motion.div>
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Dark Mode</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Toggle dark/light theme</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className="sr-only peer" />
              <div className={`w-11 h-6 ${isDarkMode ? 'bg-emerald-500' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2">
              {['profil', 'keamanan', 'notifikasi'].map((tab) => (
                <motion.button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? 'bg-emerald-500 text-white shadow-lg' 
                      : isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </motion.div>

            {/* Profile Tab */}
            {activeTab === 'profil' && (
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Informasi Profil</h3>
                
                {profileError && (
                  <motion.div 
                    className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-sm mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {profileError}
                  </motion.div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Nama</label>
                      <input 
                        type="text" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                      />
                    </div>
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Email</label>
                      <input 
                        type="email" 
                        value={profileData.email} 
                        disabled
                        className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'} cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>No. Telepon</label>
                      <input 
                        type="tel" 
                        value={profileData.phone} 
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                      />
                    </div>
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Alamat</label>
                      <input 
                        type="text" 
                        value={profileData.address} 
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                      />
                    </div>
                  </div>
                  
                  <motion.button 
                    type="submit" 
                    disabled={profileLoading}
                    className="px-8 py-3 rounded-xl text-white font-semibold bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!profileLoading ? { scale: 1.02, boxShadow: '0 10px 30px rgba(46, 204, 113, 0.4)' } : {}}
                    whileTap={!profileLoading ? { scale: 0.98 } : {}}
                  >
                    {profileLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'keamanan' && (
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Keamanan Akun</h3>
                
                {passwordError && (
                  <motion.div 
                    className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-sm mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {passwordError}
                  </motion.div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div>
                    <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Password Lama</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Masukkan password lama"
                      className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Password Baru</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Masukkan password baru"
                        className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Konfirmasi Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Konfirmasi password baru"
                        className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                        required
                      />
                    </div>
                  </div>
                  
                  <motion.button 
                    type="submit" 
                    disabled={passwordLoading}
                    className="px-8 py-3 rounded-xl text-white font-semibold bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!passwordLoading ? { scale: 1.02, boxShadow: '0 10px 30px rgba(46, 204, 113, 0.4)' } : {}}
                    whileTap={!passwordLoading ? { scale: 0.98 } : {}}
                  >
                    {passwordLoading ? 'Mengubah...' : 'Ubah Password'}
                  </motion.button>
                </form>

                {/* Danger Zone */}
                <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <h4 className="text-sm font-semibold text-red-500 mb-4">Zona Berbahaya</h4>
                  <div className={`p-4 ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100'} rounded-xl border`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>Hapus akun Anda secara permanen.</p>
                    <motion.button 
                      onClick={logout}
                      className={`px-6 py-2 rounded-xl text-red-500 text-sm font-medium border-2 ${isDarkMode ? 'border-red-700 hover:bg-red-900/30' : 'border-red-200 hover:bg-red-100'} transition-all`}
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      Hapus Akun
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifikasi' && (
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Pengaturan Notifikasi</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'email', title: 'Notifikasi Email', desc: 'Terima update via email' },
                    { key: 'investment', title: 'Update Investasi', desc: 'Notifikasi perubahan nilai investasi' },
                    { key: 'dividend', title: 'Pengumuman Dividen', desc: 'Notifikasi saat dividen dibagikan' },
                    { key: 'opportunity', title: 'Peluang Baru', desc: 'Notifikasi UMKM baru yang potensial' },
                  ].map((item, index) => (
                    <motion.div 
                      key={item.key}
                      className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-colors`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className={`w-11 h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500`}></div>
                      </label>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button 
                  className="mt-6 px-8 py-3 rounded-xl text-white font-semibold bg-emerald-500"
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(46, 204, 113, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => alert('Pengaturan disimpan!')}
                >
                  Simpan Pengaturan
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Right Column - Account Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-lg cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-2xl font-bold text-white">{profileData.name?.charAt(0) || 'I'}</span>
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{profileData.name || 'Investor'}</h3>
                  <p className="text-white/80 text-sm">{profileData.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Verified Investor
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Member since {investmentStats.memberSince}
                </div>
              </div>
            </motion.div>

            {/* Investment Stats */}
            <motion.div 
              variants={itemVariants}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg`}
            >
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 text-sm`}>Statistik Investasi</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: formatCurrency(investmentStats.totalInvested), label: 'Total Invested', color: 'blue' },
                  { value: investmentStats.activeInvestments, label: 'Active Investments', color: 'green' },
                  { value: formatCurrency(investmentStats.totalReturns), label: 'Total Returns', color: 'purple' },
                  { value: '15%', label: 'Avg. ROI', color: 'amber' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    className={`p-3 ${isDarkMode ? `bg-${stat.color}-900/30` : `bg-${stat.color}-50`} rounded-xl text-center`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className={`text-lg font-bold ${isDarkMode ? `text-${stat.color}-400` : `text-${stat.color}-600`}`}>{stat.value}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              variants={itemVariants}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg`}
            >
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 text-sm`}>Aksi Cepat</h3>
              <div className="space-y-2">
                {[
                  { icon: '📥', label: 'Tarik Dividen', desc: 'Withdraw to bank' },
                  { icon: '📊', label: 'Lihat Laporan', desc: 'Full analytics' },
                  { icon: '💳', label: 'Metode Pembayaran', desc: 'Manage cards' },
                ].map((action, i) => (
                  <motion.button
                    key={i}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors text-left`}
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-xl">{action.icon}</span>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{action.label}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{action.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorProfilPage;

