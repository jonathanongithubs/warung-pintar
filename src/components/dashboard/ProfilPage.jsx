import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import DashboardLayout from './DashboardLayout';

const ProfilPage = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [profileData, setProfileData] = useState({
    namaUsaha: 'Kroketin', email: 'umkm@gmail.com', noTelp: '081234567890', alamat: 'Jl. Contoh No. 123, Jakarta', kategori: 'Makanan'
  });
  const [notifSettings, setNotifSettings] = useState({ emailNotif: true, stokRendah: true, laporanMingguan: false, promoTips: true });
  const [activeTab, setActiveTab] = useState('profil');

  const handleProfileSave = (e) => { e.preventDefault(); alert('Profil berhasil disimpan!'); };
  const handleNotifSave = () => { alert('Pengaturan notifikasi berhasil disimpan!'); };

  const accountStats = { totalTransaksi: 156, produkTerdaftar: 24, hariAktif: 45, ratingUsaha: 4.8 };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-4 md:mb-6">
          <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Profil</h2>
          <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kelola profil dan preferensi akun Anda</p>
        </motion.div>

        {/* Dark Mode Toggle Card */}
        <motion.div variants={itemVariants} className="mb-4 md:mb-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 md:p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-yellow-400' : 'bg-gray-600'}`}
                animate={{ rotate: isDarkMode ? 0 : 180 }}
                transition={{ duration: 0.5 }}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </motion.div>
              <div>
                <h3 className="text-white font-semibold text-sm md:text-base">Mode Tampilan</h3>
                <p className="text-gray-400 text-xs">{isDarkMode ? 'Mode Gelap Aktif' : 'Mode Terang Aktif'}</p>
              </div>
            </div>
            <motion.button
              onClick={toggleDarkMode}
              className={`relative w-14 h-7 md:w-16 md:h-8 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-emerald-500' : 'bg-gray-500'}`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="absolute top-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-md"
                animate={{ left: isDarkMode ? 'calc(100% - 24px)' : '4px' }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Account Card */}
        <motion.div variants={itemVariants} className="lg:hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 shadow-lg mb-4" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center gap-3">
            <motion.div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <span className="text-xl font-bold text-white">{profileData.namaUsaha.charAt(0)}</span>
            </motion.div>
            <div>
              <h3 className="text-base font-semibold text-white">{profileData.namaUsaha}</h3>
              <p className="text-white/80 text-xs">{profileData.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Tabs */}
            <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2">
              {['profil', 'notifikasi', 'keamanan'].map((tab) => (
                <motion.button key={tab} onClick={() => setActiveTab(tab)} 
                  className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab ? 'bg-emerald-500 text-white shadow-lg' : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'}`}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {tab === 'profil' ? 'Profil Usaha' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </motion.div>

            {/* Profile Tab */}
            {activeTab === 'profil' && (
              <motion.div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-6 shadow-sm`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 md:mb-6 text-sm md:text-base`}>Informasi Profil Usaha</h3>
                <form onSubmit={handleProfileSave} className="space-y-4 md:space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {[{ label: 'Nama Usaha', key: 'namaUsaha', type: 'text' }, { label: 'Kategori Usaha', key: 'kategori', type: 'text' }, { label: 'Email', key: 'email', type: 'email' }, { label: 'No. Telepon', key: 'noTelp', type: 'tel' }].map((field, index) => (
                      <motion.div key={field.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                        <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5 md:mb-2`}>{field.label}</label>
                        <input type={field.type} value={profileData[field.key]} onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })} 
                          className={`w-full text-xs md:text-sm px-3 md:px-4 py-2.5 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`} />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5 md:mb-2`}>Alamat</label>
                    <textarea value={profileData.alamat} onChange={(e) => setProfileData({ ...profileData, alamat: e.target.value })} rows={3} 
                      className={`w-full text-xs md:text-sm px-3 md:px-4 py-2.5 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none`} />
                  </motion.div>
                  <motion.div className="pt-2 md:pt-4" whileHover={{ scale: 1.02 }}>
                    <motion.button type="submit" className="w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 rounded-full text-white text-xs md:text-sm font-semibold transition-all" style={{ backgroundColor: '#2ECC71' }} whileHover={{ boxShadow: "0 10px 30px rgba(46, 204, 113, 0.4)" }} whileTap={{ scale: 0.95 }}>Simpan Perubahan</motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifikasi' && (
              <motion.div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-6 shadow-sm`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 md:mb-6 text-sm md:text-base`}>Pengaturan Notifikasi</h3>
                <div className="space-y-3 md:space-y-4">
                  {[{ key: 'emailNotif', title: 'Notifikasi Email', desc: 'Terima notifikasi melalui email' }, { key: 'stokRendah', title: 'Peringatan Stok Rendah', desc: 'Notifikasi saat stok produk menipis' }, { key: 'laporanMingguan', title: 'Laporan Mingguan', desc: 'Ringkasan performa usaha setiap minggu' }, { key: 'promoTips', title: 'Tips & Promo', desc: 'Tips bisnis dan info promo terbaru' }].map((item, index) => (
                    <motion.div key={item.key} className={`flex items-center justify-between p-3 md:p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ backgroundColor: isDarkMode ? '#374151' : '#f0fdf4' }}>
                      <div className="pr-3">
                        <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input type="checkbox" checked={notifSettings[item.key]} onChange={(e) => setNotifSettings({ ...notifSettings, [item.key]: e.target.checked })} className="sr-only peer" />
                        <div className={`w-10 h-5 md:w-11 md:h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-emerald-500`}></div>
                      </label>
                    </motion.div>
                  ))}
                </div>
                <motion.div className="pt-4 md:pt-6" whileHover={{ scale: 1.02 }}>
                  <motion.button onClick={handleNotifSave} className="w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 rounded-full text-white text-xs md:text-sm font-semibold transition-all" style={{ backgroundColor: '#2ECC71' }} whileHover={{ boxShadow: "0 10px 30px rgba(46, 204, 113, 0.4)" }} whileTap={{ scale: 0.95 }}>Simpan Pengaturan</motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'keamanan' && (
              <motion.div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-6 shadow-sm`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 md:mb-6 text-sm md:text-base`}>Keamanan Akun</h3>
                <div className="space-y-4 md:space-y-5">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5 md:mb-2`}>Password Lama</label>
                    <input type="password" placeholder="Masukkan password lama" className={`w-full text-xs md:text-sm px-3 md:px-4 py-2.5 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`} />
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5 md:mb-2`}>Password Baru</label>
                      <input type="password" placeholder="Masukkan password baru" className={`w-full text-xs md:text-sm px-3 md:px-4 py-2.5 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5 md:mb-2`}>Konfirmasi Password</label>
                      <input type="password" placeholder="Konfirmasi password baru" className={`w-full text-xs md:text-sm px-3 md:px-4 py-2.5 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-gray-800'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`} />
                    </motion.div>
                  </div>
                  <motion.div className="pt-2 md:pt-4" whileHover={{ scale: 1.02 }}>
                    <motion.button className="w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 rounded-full text-white text-xs md:text-sm font-semibold transition-all" style={{ backgroundColor: '#2ECC71' }} whileHover={{ boxShadow: "0 10px 30px rgba(46, 204, 113, 0.4)" }} whileTap={{ scale: 0.95 }}>Ubah Password</motion.button>
                  </motion.div>
                </div>
                <motion.div className={`mt-6 md:mt-8 pt-4 md:pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <h4 className="text-xs md:text-sm font-semibold text-red-600 mb-3 md:mb-4">Zona Berbahaya</h4>
                  <div className={`p-3 md:p-4 ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100'} rounded-lg border`}>
                    <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>Hapus akun Anda secara permanen.</p>
                    <motion.button className={`px-4 md:px-6 py-2 rounded-full text-red-600 text-xs md:text-sm font-medium border-2 ${isDarkMode ? 'border-red-700 hover:bg-red-900/30' : 'border-red-200 hover:bg-red-100'} transition-all`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Hapus Akun</motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Desktop Account Info */}
          <div className="hidden lg:block space-y-6">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-lg cursor-pointer">
              <div className="flex items-center gap-4 mb-6">
                <motion.div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <span className="text-2xl font-bold text-white">{profileData.namaUsaha.charAt(0)}</span>
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{profileData.namaUsaha}</h3>
                  <p className="text-white/80 text-sm">{profileData.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                {[{ icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', label: profileData.kategori }, { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Bergabung November 2025' }].map((item, i) => (
                  <motion.div key={i} className="flex items-center gap-2 text-white/90 text-sm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                    {item.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-sm`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 text-sm`}>Statistik Akun</h3>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: accountStats.totalTransaksi, label: 'Total Transaksi', color: 'blue' }, { value: accountStats.produkTerdaftar, label: 'Produk Terdaftar', color: 'green' }, { value: accountStats.hariAktif, label: 'Hari Aktif', color: 'purple' }, { value: accountStats.ratingUsaha, label: 'Rating ⭐', color: 'yellow' }].map((stat, i) => (
                  <motion.div key={i} className={`p-3 ${isDarkMode ? `bg-${stat.color}-900/30` : `bg-${stat.color}-50`} rounded-lg text-center`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }} whileHover={{ scale: 1.05 }}>
                    <p className={`text-2xl font-bold ${isDarkMode ? `text-${stat.color}-400` : `text-${stat.color}-600`}`}>{stat.value}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 shadow-lg cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm">Paket Anda</h3>
                <motion.span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white font-medium" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>Gratis</motion.span>
              </div>
              <p className="text-white/80 text-sm mb-4">Upgrade ke Premium untuk fitur lebih lengkap!</p>
              <motion.button className="w-full py-2.5 bg-white text-blue-600 rounded-full text-sm font-semibold transition-colors" whileHover={{ scale: 1.05, backgroundColor: '#EBF5FF' }} whileTap={{ scale: 0.95 }}>Upgrade Sekarang</motion.button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Account Stats */}
        <motion.div variants={itemVariants} className="lg:hidden grid grid-cols-2 gap-3 mt-4">
          {[{ value: accountStats.totalTransaksi, label: 'Transaksi', color: 'blue' }, { value: accountStats.produkTerdaftar, label: 'Produk', color: 'green' }].map((stat, i) => (
            <motion.div key={i} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 shadow-sm text-center`} whileHover={{ scale: 1.05 }}>
              <p className={`text-xl font-bold ${isDarkMode ? `text-${stat.color}-400` : `text-${stat.color}-600`}`}>{stat.value}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ProfilPage;
