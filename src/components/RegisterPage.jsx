import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [userType, setUserType] = useState('umkm');
  const [namaUsaha, setNamaUsaha] = useState('');
  const [kategori, setKategori] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const kategoriOptions = [
    { value: 'warung-makan', label: 'Warung Makan' },
    { value: 'toko-kelontong', label: 'Toko Kelontong' },
    { value: 'warung-kopi', label: 'Warung Kopi' },
    { value: 'sembako', label: 'Sembako' },
    { value: 'makanan-ringan', label: 'Makanan Ringan & Snack' },
    { value: 'minuman', label: 'Minuman & Es' },
    { value: 'gorengan', label: 'Gorengan & Jajanan' },
    { value: 'sayur-buah', label: 'Sayur & Buah' },
    { value: 'daging-ikan', label: 'Daging & Ikan' },
    { value: 'bumbu-dapur', label: 'Bumbu Dapur' },
    { value: 'kebutuhan-harian', label: 'Kebutuhan Harian' },
    { value: 'pulsa-token', label: 'Pulsa & Token Listrik' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!agreeTerms) {
      setError('Anda harus menyetujui syarat & ketentuan');
      return;
    }
    
    setLoading(true);
    
    const result = await register({
      nama_usaha: namaUsaha,
      user_type: userType,
      kategori: kategori || 'Umum',
      email: email,
      password: password,
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const selectedKategori = kategoriOptions.find(opt => opt.value === kategori);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="min-h-screen w-full font-inter flex flex-col"
      style={{ backgroundColor: '#114B3A' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header 
        className="flex items-center justify-between px-8 md:px-16 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <motion.svg 
            className="w-7 h-7" 
            viewBox="0 0 32 32" 
            fill="none"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M16 2C16 2 6 8 6 18C6 24.627 10.373 30 16 30C21.627 30 26 24.627 26 18C26 8 16 2 16 2Z" fill="#2ECC71"/>
            <path d="M16 8C16 8 12 12 12 18C12 22 13.5 25 16 25C18.5 25 20 22 20 18C20 12 16 8 16 8Z" fill="#114B3A"/>
          </motion.svg>
          <span className="text-white text-lg font-semibold">Warung Pintar</span>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="px-8 py-2.5 rounded-full text-white text-sm font-medium" style={{ backgroundColor: '#2ECC71' }}>
            Masuk
          </Link>
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-[700px]">
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Bergabung dengan platform kami</h1>
            <p className="text-sm text-white/60">Menghubungkan UMKM dengan investor</p>
          </motion.div>

          {/* User Type Toggle */}
          <motion.div variants={itemVariants} className="flex gap-4 mb-8">
            {['umkm', 'investor'].map((type) => (
              <motion.button
                key={type}
                type="button"
                onClick={() => setUserType(type)}
                className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium border-2 ${userType === type ? 'text-white' : 'text-white/60 border-white/30'}`}
                style={{ backgroundColor: userType === type ? '#2ECC71' : 'transparent', borderColor: userType === type ? '#2ECC71' : undefined }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Saya {type === 'umkm' ? 'UMKM' : 'Investor'}
              </motion.button>
            ))}
          </motion.div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/70 block mb-2">Nama Usaha</label>
                <input
                  type="text"
                  value={namaUsaha}
                  onChange={(e) => setNamaUsaha(e.target.value)}
                  placeholder="Masukkan nama usaha anda"
                  className="w-full text-white text-sm px-4 py-3.5 rounded-lg border-none outline-none transition-all placeholder:text-white/40 focus:ring-2 focus:ring-emerald-500/50"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                  required
                />
              </div>
              
              {/* Custom Dropdown */}
              <div ref={dropdownRef} className="relative z-50">
                <label className="text-xs text-white/70 block mb-2">Kategori</label>
                <motion.button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full text-sm px-4 py-3.5 rounded-lg border-none outline-none transition-all text-left flex items-center justify-between"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', color: selectedKategori ? 'white' : 'rgba(255, 255, 255, 0.4)' }}
                  whileFocus={{ boxShadow: '0 0 20px rgba(46, 204, 113, 0.3)' }}
                >
                  <span>{selectedKategori ? selectedKategori.label : 'Pilih kategori usaha'}</span>
                  <motion.svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl overflow-hidden border border-white/10"
                      style={{ backgroundColor: '#0D3A2D', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)', zIndex: 9999 }}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="max-h-60 overflow-y-auto">
                        {kategoriOptions.map((option, index) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => { setKategori(option.value); setIsDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 ${kategori === option.value ? 'text-white' : 'text-white/70'}`}
                            style={{ backgroundColor: kategori === option.value ? 'rgba(46, 204, 113, 0.2)' : 'transparent' }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', x: 5 }}
                          >
                            {kategori === option.value && (
                              <svg className="w-4 h-4" fill="none" stroke="#2ECC71" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {kategori !== option.value && <span className="w-4"></span>}
                            {option.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={isDropdownOpen ? 'relative z-0' : ''}>
              <label className="text-xs text-white/70 block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email anda"
                className="w-full text-white text-sm px-4 py-3.5 rounded-lg border-none outline-none transition-all placeholder:text-white/40 focus:ring-2 focus:ring-emerald-500/50"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className={isDropdownOpen ? 'relative z-0' : ''}>
              <label className="text-xs text-white/70 block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Buat password untuk usaha anda"
                className="w-full text-white text-sm px-4 py-3.5 rounded-lg border-none outline-none transition-all placeholder:text-white/40 focus:ring-2 focus:ring-emerald-500/50"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                required
                minLength={8}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreeTerms} 
                onChange={(e) => setAgreeTerms(e.target.checked)} 
                className="w-4 h-4 rounded border-white/30 bg-transparent accent-emerald-500 cursor-pointer transition-all" 
              />
              <label htmlFor="terms" className="text-sm text-white/70 cursor-pointer">
                Saya setuju dengan <motion.span style={{ color: '#2ECC71' }} whileHover={{ textShadow: '0 0 10px rgba(46, 204, 113, 0.5)' }}>syarat & ketentuan</motion.span> kebijakan privasi
              </label>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <motion.button 
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-3.5 px-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed" 
                style={{ backgroundColor: '#2ECC71' }}
                whileHover={!loading ? { scale: 1.02, boxShadow: '0 10px 30px rgba(46, 204, 113, 0.4)' } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : 'Daftar'}
              </motion.button>
            </motion.div>

            <motion.p variants={itemVariants} className="text-center text-sm text-white/60 pt-2">
              Sudah punya akun?{' '}
              <Link to="/">
                <motion.span style={{ color: '#2ECC71' }} whileHover={{ textShadow: '0 0 10px rgba(46, 204, 113, 0.5)' }}>Masuk di sini</motion.span>
              </Link>
            </motion.p>
          </form>
        </div>
      </motion.main>
    </motion.div>
  );
};

export default RegisterPage;
