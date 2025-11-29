import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import InvestorLayout from './InvestorLayout';

const InvestorPengaturan = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [settings, setSettings] = useState({
    language: 'id',
    currency: 'IDR',
    timezone: 'Asia/Jakarta',
    twoFactor: false,
    dataSharing: true,
    analytics: true,
  });

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
            Settings
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Configure your app preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <motion.div 
            variants={itemVariants}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
              General Settings
            </h3>
            
            <div className="space-y-5">
              {/* Language */}
              <div>
                <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'
                  } focus:border-emerald-500 outline-none transition-all`}
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'
                  } focus:border-emerald-500 outline-none transition-all`}
                >
                  <option value="IDR">Indonesian Rupiah (IDR)</option>
                  <option value="USD">US Dollar (USD)</option>
                </select>
              </div>

              {/* Timezone */}
              <div>
                <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-800'
                  } focus:border-emerald-500 outline-none transition-all`}
                >
                  <option value="Asia/Jakarta">WIB (Jakarta)</option>
                  <option value="Asia/Makassar">WITA (Makassar)</option>
                  <option value="Asia/Jayapura">WIT (Jayapura)</option>
                </select>
              </div>

              {/* Dark Mode */}
              <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Dark Mode</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Toggle dark theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className="sr-only peer" />
                  <div className={`w-11 h-6 ${isDarkMode ? 'bg-emerald-500' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Security & Privacy */}
          <motion.div 
            variants={itemVariants}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
              Security & Privacy
            </h3>
            
            <div className="space-y-4">
              {[
                { key: 'twoFactor', title: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                { key: 'dataSharing', title: 'Data Sharing', desc: 'Share anonymized data for improvements' },
                { key: 'analytics', title: 'Analytics', desc: 'Help us improve with usage analytics' },
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
                      checked={settings[item.key]} 
                      onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })} 
                      className="sr-only peer" 
                    />
                    <div className={`w-11 h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500`}></div>
                  </label>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              className="mt-6 w-full py-3 bg-emerald-500 text-white font-semibold rounded-xl"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              Save All Settings
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorPengaturan;

