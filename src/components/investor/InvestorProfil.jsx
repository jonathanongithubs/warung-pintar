import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import InvestorLayout from './InvestorLayout';

const InvestorProfil = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, setUser, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    alamat: '',
  });
  const [notifSettings, setNotifSettings] = useState({
    emailNotif: true,
    investmentUpdates: true,
    weeklyReport: true,
    newOpportunities: true,
  });
  const [activeTab, setActiveTab] = useState('profil');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [accountStats] = useState({
    totalInvestments: 4,
    totalReturns: 2850000,
    avgROI: 18.2,
    memberSince: 'Nov 2025',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.nama_usaha || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        alamat: user.alamat || '',
      });
    }
  }, [user]);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID').format(amount);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    try {
      const response = await authAPI.updateProfile({
        nama_usaha: profileData.name,
        phone: profileData.phone,
        alamat: profileData.alamat,
      });
      setUser(response.data.data);
      alert('Profil berhasil disimpan!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Gagal menyimpan profil.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleNotifSave = () => {
    alert('Pengaturan notifikasi berhasil disimpan!');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
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
            Pengaturan Profil
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Kelola akun dan preferensi Anda
          </p>
        </motion.div>

        {/* Dark Mode Toggle */}
        <motion.div 
          variants={itemVariants}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}
              animate={{ rotate: isDarkMode ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </motion.div>
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Mode Gelap</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{isDarkMode ? 'Sedang aktif' : 'Tidak aktif'}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className="sr-only peer" />
            <div className={`w-11 h-6 ${isDarkMode ? 'bg-emerald-500' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}></div>
          </label>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <motion.div variants={itemVariants} className="flex gap-2 flex-wrap">
              {['profil', 'notifikasi', 'keamanan'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab === 'profil' ? 'Profil' : tab === 'notifikasi' ? 'Notifikasi' : 'Keamanan'}
                </motion.button>
              ))}
            </motion.div>

            {/* Profile Tab */}
            {activeTab === 'profil' && (
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                  Informasi Pribadi
                </h3>
                
                {profileError && (
                  <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
                    {profileError}
                  </div>
                )}
                
                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Nama Lengkap</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'
                        } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                      />
                    </div>
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className={`w-full px-4 py-3 rounded-lg border ${
                          isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'
                        } opacity-60 cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Nomor Telepon</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'
                        } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                      />
                    </div>
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Alamat</label>
                      <input
                        type="text"
                        value={profileData.alamat}
                        onChange={(e) => setProfileData({ ...profileData, alamat: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'
                        } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                      />
                    </div>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={profileLoading}
                    className="px-8 py-3 bg-emerald-500 text-white font-semibold rounded-full disabled:opacity-50"
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {profileLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifikasi' && (
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                  Preferensi Notifikasi
                </h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'emailNotif', title: 'Notifikasi Email', desc: 'Terima notifikasi melalui email' },
                    { key: 'investmentUpdates', title: 'Update Investasi', desc: 'Pembaruan tentang performa investasi Anda' },
                    { key: 'weeklyReport', title: 'Laporan Mingguan', desc: 'Ringkasan performa portofolio Anda' },
                    { key: 'newOpportunities', title: 'Peluang Baru', desc: 'Notifikasi peluang investasi UMKM baru' },
                  ].map((item, index) => (
                    <motion.div 
                      key={item.key}
                      className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifSettings[item.key]} 
                          onChange={(e) => setNotifSettings({ ...notifSettings, [item.key]: e.target.checked })} 
                          className="sr-only peer" 
                        />
                        <div className={`w-11 h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500`}></div>
                      </label>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  onClick={handleNotifSave}
                  className="mt-6 px-8 py-3 bg-emerald-500 text-white font-semibold rounded-full"
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Simpan Pengaturan
                </motion.button>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'keamanan' && (
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                  Ubah Password
                </h3>
                
                {passwordError && (
                  <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
                    {passwordError}
                  </div>
                )}
                
                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div>
                    <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Password Saat Ini</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'
                      } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
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
                        className={`w-full px-4 py-3 rounded-lg border ${
                          isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'
                        } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Konfirmasi Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'
                        } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
                        required
                      />
                    </div>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-8 py-3 bg-emerald-500 text-white font-semibold rounded-full disabled:opacity-50"
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {passwordLoading ? 'Mengubah...' : 'Ubah Password'}
                  </motion.button>
                </form>
                
                <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <h4 className="text-sm font-semibold text-red-500 mb-4">Zona Berbahaya</h4>
                  <div className={`p-4 ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100'} rounded-lg border`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                      Hapus akun Anda secara permanen. Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <motion.button
                      onClick={logout}
                      className={`px-6 py-2 rounded-full text-red-500 text-sm font-medium border-2 ${
                        isDarkMode ? 'border-red-700 hover:bg-red-900/30' : 'border-red-200 hover:bg-red-100'
                      } transition-all`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Hapus Akun
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Account Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Akun Investor
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Bergabung sejak {accountStats.memberSince}
                </div>
              </div>
            </motion.div>

            {/* Account Stats */}
            <motion.div 
              variants={itemVariants}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-sm`}
            >
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Statistik Akun</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: accountStats.totalInvestments, label: 'Investasi', color: 'emerald' },
                  { value: `Rp ${formatCurrency(accountStats.totalReturns)}`, label: 'Total Return', color: 'blue' },
                  { value: `${accountStats.avgROI}%`, label: 'ROI Rata-rata', color: 'purple' },
                  { value: '4.9 ⭐', label: 'Rating', color: 'yellow' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    className={`p-3 rounded-lg text-center ${
                      isDarkMode ? `bg-${stat.color}-900/30` : `bg-${stat.color}-50`
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className={`text-lg font-bold ${
                      stat.color === 'emerald' ? 'text-emerald-500' :
                      stat.color === 'blue' ? 'text-blue-500' :
                      stat.color === 'purple' ? 'text-purple-500' :
                      'text-yellow-500'
                    }`}>{stat.value}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Premium Upgrade */}
            <motion.div 
              variants={itemVariants}
              className={`${isDarkMode ? 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'} rounded-xl p-5 border`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Upgrade ke Premium</h3>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Dapatkan akses eksklusif ke daftar UMKM premium dan prioritas investasi.
              </p>
              <motion.button
                className="w-full py-2.5 bg-purple-500 text-white text-sm font-semibold rounded-lg"
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                Upgrade Sekarang
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorProfil;

