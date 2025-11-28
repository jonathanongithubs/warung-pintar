import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex h-screen w-screen font-inter" style={{ backgroundColor: '#114B3A' }}>
      {/* Left Pane - Visual */}
      <div className="hidden md:flex md:w-1/2 relative" style={{ backgroundColor: '#0D3A2D' }}>
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <motion.div 
          className="absolute bottom-0 left-0 p-10 text-white z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.h1 
            className="text-3xl font-bold leading-tight mb-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Menghubungkan Inovasi UMKM<br />dengan Visi Investor
          </motion.h1>
          <motion.p 
            className="text-sm text-white/80"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Platform terpadu untuk pertumbuhan bisnis dan investasi
          </motion.p>
        </motion.div>
      </div>

      {/* Right Pane - Form */}
      <motion.div 
        className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16"
        style={{ backgroundColor: '#114B3A' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-12">
            <motion.svg 
              className="w-8 h-8" 
              viewBox="0 0 32 32" 
              fill="none"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M16 2C16 2 6 8 6 18C6 24.627 10.373 30 16 30C21.627 30 26 24.627 26 18C26 8 16 2 16 2Z" fill="#2ECC71"/>
              <path d="M16 8C16 8 12 12 12 18C12 22 13.5 25 16 25C18.5 25 20 22 20 18C20 12 16 8 16 8Z" fill="#114B3A"/>
            </motion.svg>
            <span className="text-white text-xl font-semibold">Warung Pintar</span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Selamat Datang Kembali</h2>
            <p className="text-sm text-white/60">Masuk untuk melanjutkan ke dashboard anda</p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label className="text-xs text-white/70 block mb-2">Email</label>
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email anda"
                className="w-full text-white text-sm px-4 py-3.5 rounded-lg border-none outline-none transition-all placeholder:text-white/40"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                whileFocus={{ boxShadow: '0 0 20px rgba(46, 204, 113, 0.3)' }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="text-xs text-white/70 block mb-2">Password</label>
              <motion.input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password"
                className="w-full text-white text-sm px-4 py-3.5 rounded-lg border-none outline-none transition-all placeholder:text-white/40"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                whileFocus={{ boxShadow: '0 0 20px rgba(46, 204, 113, 0.3)' }}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="text-left pt-1">
              <motion.a 
                href="#" 
                className="text-xs transition-all"
                style={{ color: '#2ECC71' }}
                whileHover={{ textShadow: '0 0 10px rgba(46, 204, 113, 0.5)' }}
              >
                Lupa Kata Sandi?
              </motion.a>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                className="w-full text-white font-semibold py-3.5 px-8 rounded-full"
                style={{ backgroundColor: '#2ECC71' }}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(46, 204, 113, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                Masuk
              </motion.button>
            </motion.div>

            <motion.p variants={itemVariants} className="text-center text-sm text-white/60 pt-2">
              Belum punya akun?{' '}
              <Link to="/register">
                <motion.span 
                  style={{ color: '#2ECC71' }}
                  whileHover={{ textShadow: '0 0 10px rgba(46, 204, 113, 0.5)' }}
                >
                  Daftar di sini
                </motion.span>
              </Link>
            </motion.p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
