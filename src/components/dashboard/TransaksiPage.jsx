import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { transactionsAPI, productsAPI } from '../../services/api';
import { analyzeTransactionFile } from '../../services/geminiService';
import DashboardLayout from './DashboardLayout';

const TransaksiPage = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('manual');
  const [formData, setFormData] = useState({ product: '', productId: null, qty: 1, price: 0, notes: '', paymentMethod: 'Cash' });
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [quickProducts, setQuickProducts] = useState([]);
  const [todayStats, setTodayStats] = useState({ totalTransaksi: 0, pendapatan: 0, itemTerjual: 0 });
  
  // File upload states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTransactions, setParsedTransactions] = useState([]);
  const [aiResponse, setAiResponse] = useState('');
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  
  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID').format(amount);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, recentRes, statsRes] = await Promise.all([
        productsAPI.getAll(),
        transactionsAPI.getRecent(),
        transactionsAPI.getTodayStats(),
      ]);
      
      setQuickProducts(productsRes.data.data.products.slice(0, 6));
      setTransactions(recentRes.data.data.map(t => ({
        id: t.id,
        date: new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: `${t.product_name} x${t.quantity}`,
        total: t.total,
        method: t.payment_method,
      })));
      setTodayStats({
        totalTransaksi: statsRes.data.data.total_transaksi,
        pendapatan: statsRes.data.data.pendapatan,
        itemTerjual: statsRes.data.data.item_terjual,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product || formData.price <= 0) {
      alert('Mohon lengkapi data transaksi');
      return;
    }
    
    setLoading(true);
    try {
      await transactionsAPI.create({
        product_id: formData.productId,
        product_name: formData.product,
        quantity: formData.qty,
        price: formData.price,
        payment_method: formData.paymentMethod,
        notes: formData.notes,
      });
      
      alert('Transaksi berhasil disimpan!');
      setFormData({ product: '', productId: null, qty: 1, price: 0, notes: '', paymentMethod: 'Cash' });
      fetchData();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  const selectQuickProduct = (product) => {
    setFormData({ ...formData, product: product.name, productId: product.id, price: product.price });
  };

  // File upload handlers
  const handleFileSelect = useCallback(async (file) => {
    if (!file) return;

    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan: CSV, XLS, XLSX, JPG, PNG, PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 10MB.');
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);
    setAiResponse('');
    setParsedTransactions([]);

    try {
      const result = await analyzeTransactionFile(file);
      setAiResponse(result.message);
      if (result.transactions && result.transactions.length > 0) {
        setParsedTransactions(result.transactions);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setAiResponse('Gagal memproses file. Pastikan format file benar dan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropZoneRef.current && !e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const removeFile = () => {
    setUploadedFile(null);
    setParsedTransactions([]);
    setAiResponse('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveParsedTransactions = async () => {
    if (parsedTransactions.length === 0) return;
    
    setLoading(true);
    try {
      for (const t of parsedTransactions) {
        await transactionsAPI.create({
          product_name: t.product,
          quantity: t.qty,
          price: t.price,
          payment_method: 'Cash',
          notes: 'Diimpor dari file',
        });
      }
      alert(`${parsedTransactions.length} transaksi berhasil disimpan!`);
      removeFile();
      fetchData();
    } catch (error) {
      console.error('Error saving transactions:', error);
      alert('Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-4 md:mb-6">
          <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Input Transaksi</h2>
          <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Catat transaksi harian Anda dengan mudah</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <motion.div variants={itemVariants} className="flex gap-2">
              {['manual', 'upload'].map((tab) => (
                <motion.button key={tab} onClick={() => setActiveTab(tab)} 
                  className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === tab ? 'bg-emerald-500 text-white shadow-lg' : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'}`}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {tab === 'manual' ? 'Input Manual' : 'Upload File'}
                </motion.button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {activeTab === 'manual' ? (
                <motion.div 
                  key="manual" 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 md:space-y-6"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-6 shadow-sm`}
                  >
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 md:mb-4 text-sm md:text-base`}>Produk Cepat</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                      {quickProducts.map((product, i) => (
                        <motion.button key={product.id || i} onClick={() => selectQuickProduct(product)}
                          className={`p-3 md:p-4 rounded-lg border-2 text-left transition-all ${formData.product === product.name ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : isDarkMode ? 'border-gray-600 hover:border-emerald-400 bg-gray-700' : 'border-gray-100 hover:border-emerald-200'}`}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }}>
                          <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{product.name}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rp {formatCurrency(product.price)}</p>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-6 shadow-sm`}
                  >
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 md:mb-4 text-sm md:text-base`}>Detail Transaksi</h3>
                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Nama Produk</label>
                          <input type="text" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} placeholder="Ketik produk" className={`w-full text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`} />
                        </div>
                        <div>
                          <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Harga Satuan</label>
                          <input 
                            type="text" 
                            inputMode="numeric"
                            value={formData.price === 0 ? '' : formData.price} 
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              setFormData({ ...formData, price: val === '' ? 0 : parseInt(val, 10) });
                            }}
                            placeholder="0"
                            className={`w-full text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`} 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Jumlah</label>
                          <div className="flex items-center gap-2">
                            <motion.button type="button" onClick={() => setFormData({ ...formData, qty: Math.max(1, formData.qty - 1) })} className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} flex items-center justify-center`} whileTap={{ scale: 0.9 }}>-</motion.button>
                            <input 
                              type="text" 
                              inputMode="numeric"
                              value={formData.qty} 
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setFormData({ ...formData, qty: val === '' ? 1 : Math.max(1, parseInt(val, 10)) });
                              }}
                              className={`w-12 md:w-16 text-center text-xs md:text-sm px-2 py-2 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 outline-none`} 
                            />
                            <motion.button type="button" onClick={() => setFormData({ ...formData, qty: formData.qty + 1 })} className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} flex items-center justify-center`} whileTap={{ scale: 0.9 }}>+</motion.button>
                          </div>
                        </div>
                        <div>
                          <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Total</label>
                          <motion.p className="text-lg md:text-2xl font-bold text-emerald-600 py-1" key={formData.price * formData.qty} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>Rp {formatCurrency(formData.price * formData.qty)}</motion.p>
                        </div>
                      </div>
                      <div>
                        <label className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Catatan</label>
                        <input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Opsional..." className={`w-full text-xs md:text-sm px-3 md:px-4 py-2 md:py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`} />
                      </div>
                      <motion.button type="submit" disabled={loading} className="w-full py-3 md:py-4 rounded-xl text-white font-semibold text-sm md:text-base disabled:opacity-50" style={{ backgroundColor: '#2ECC71' }} whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(46, 204, 113, 0.4)" }} whileTap={{ scale: 0.98 }}>
                        {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
                      </motion.button>
                    </form>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  key="upload" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Drop Zone */}
                  <motion.div 
                    ref={dropZoneRef}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* Drag Overlay */}
                    <AnimatePresence>
                      {isDragging && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-emerald-500/90 z-10 flex flex-col items-center justify-center rounded-xl"
                        >
                          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                            <svg className="w-16 h-16 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </motion.div>
                          <p className="text-white font-semibold text-lg">Lepaskan file di sini</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!uploadedFile ? (
                      <motion.div 
                        className={`border-2 border-dashed ${isDragging ? 'border-emerald-500' : isDarkMode ? 'border-gray-600' : 'border-gray-200'} rounded-xl p-8 md:p-12 text-center transition-colors`} 
                        whileHover={{ borderColor: '#2ECC71', backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4' }}
                      >
                        <motion.svg className={`w-12 h-12 md:w-16 md:h-16 mx-auto ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24" animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </motion.svg>
                        <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Drag & drop file atau</p>
                        <motion.button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className={`px-6 py-2 ${isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-600'} rounded-full text-sm font-medium hover:bg-emerald-100`} 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }}
                        >
                          Pilih File
                        </motion.button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.pdf"
                          onChange={(e) => handleFileSelect(e.target.files?.[0])}
                          className="hidden"
                        />
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-4`}>Format: CSV, XLS, XLSX, JPG, PNG, PDF (maks 10MB)</p>
                        <p className={`text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} mt-2`}>✨ AI akan menganalisis file dan mengekstrak data transaksi</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {/* File Info */}
                        <div className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                          <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-emerald-900/50' : 'bg-emerald-100'} flex items-center justify-center`}>
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate`}>{uploadedFile.name}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button onClick={removeFile} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Processing Status */}
                        {isProcessing && (
                          <div className="flex items-center justify-center gap-3 py-8">
                            <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI sedang menganalisis file...</p>
                          </div>
                        )}

                        {/* AI Response */}
                        {aiResponse && !isProcessing && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} rounded-lg border`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`}>
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                              </div>
                              <div>
                                <p className={`text-xs font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} mb-1`}>Hasil Analisis AI</p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>{aiResponse}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Parsed Transactions */}
                        {parsedTransactions.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                          >
                            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Transaksi Terdeteksi ({parsedTransactions.length})</h4>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                              {parsedTransactions.map((t, i) => (
                                <div key={i} className={`flex items-center justify-between p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                                  <div>
                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.product}</p>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.qty} x Rp {formatCurrency(t.price)}</p>
                                  </div>
                                  <p className="text-sm font-semibold text-emerald-600">Rp {formatCurrency(t.qty * t.price)}</p>
                                </div>
                              ))}
                            </div>
                            <div className={`flex justify-between items-center pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Total</p>
                              <p className="text-lg font-bold text-emerald-600">
                                Rp {formatCurrency(parsedTransactions.reduce((sum, t) => sum + (t.qty * t.price), 0))}
                              </p>
                            </div>
                            <motion.button
                              onClick={saveParsedTransactions}
                              disabled={loading}
                              className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
                              style={{ backgroundColor: '#2ECC71' }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {loading ? 'Menyimpan...' : 'Simpan Semua Transaksi'}
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4 md:space-y-6">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 md:p-5 shadow-lg cursor-pointer">
              <h3 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Statistik Hari Ini</h3>
              <div className="space-y-3">
                {[{ label: 'Total Transaksi', value: todayStats.totalTransaksi }, { label: 'Pendapatan', value: `Rp ${formatCurrency(todayStats.pendapatan)}` }, { label: 'Item Terjual', value: todayStats.itemTerjual }].map((stat, i) => (
                  <motion.div key={i} className="flex justify-between items-center" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                    <span className="text-white/80 text-xs md:text-sm">{stat.label}</span>
                    <span className="text-white font-semibold text-sm">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-5 shadow-sm`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 md:mb-4 text-sm md:text-base`}>Transaksi Terbaru</h3>
              <div className="space-y-2 md:space-y-3">
                {transactions.slice(0, 5).map((t, i) => (
                  <motion.div key={t.id} className={`flex items-center justify-between p-2 md:p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} whileHover={{ backgroundColor: isDarkMode ? '#374151' : '#f0fdf4' }}>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate`}>{t.items}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t.date}</p>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <p className="text-xs md:text-sm font-semibold text-emerald-600">+Rp {formatCurrency(t.total)}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t.method}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'} rounded-xl p-4 md:p-5 border`}>
              <div className="flex gap-3">
                <motion.div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`} animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </motion.div>
                <div>
                  <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>Tips Cepat</p>
                  <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>Upload foto struk atau file Excel untuk input transaksi otomatis!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default TransaksiPage;
