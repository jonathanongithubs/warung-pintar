import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import DashboardLayout from './DashboardLayout';

const ProdukPage = () => {
  const { isDarkMode } = useTheme();
  const [products, setProducts] = useState([
    { id: 1, name: 'Kroket Kentang', price: 10000, stock: 50, category: 'Gorengan' },
    { id: 2, name: 'Risol Mayo', price: 10000, stock: 35, category: 'Gorengan' },
    { id: 3, name: 'Pastel Ayam', price: 10000, stock: 8, category: 'Gorengan' },
    { id: 4, name: 'Lumpia Udang', price: 12000, stock: 25, category: 'Gorengan' },
    { id: 5, name: 'Cireng Isi', price: 4000, stock: 60, category: 'Gorengan' },
    { id: 6, name: 'Tahu Isi', price: 3000, stock: 45, category: 'Gorengan' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Gorengan' });
  const [editProduct, setEditProduct] = useState({ id: null, name: '', price: '', stock: '', category: '' });
  const [restockAmount, setRestockAmount] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID').format(amount);
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 15).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = { id: Date.now(), name: newProduct.name, price: Number(newProduct.price), stock: Number(newProduct.stock), category: newProduct.category };
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', stock: '', category: 'Gorengan' });
    setShowAddModal(false);
  };

  const handleEditClick = (product) => { setEditProduct({ ...product }); setShowEditModal(true); };
  const handleEditSave = (e) => { e.preventDefault(); setProducts(products.map(p => p.id === editProduct.id ? { ...editProduct, price: Number(editProduct.price), stock: Number(editProduct.stock) } : p)); setShowEditModal(false); };
  const handleDeleteClick = (product) => { setSelectedProduct(product); setShowDeleteModal(true); };
  const handleDeleteConfirm = () => { setProducts(products.filter(p => p.id !== selectedProduct.id)); setShowDeleteModal(false); setSelectedProduct(null); };
  const handleRestockClick = (product) => { setSelectedProduct(product); setRestockAmount(10); setShowRestockModal(true); };
  const handleRestockConfirm = () => { setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, stock: p.stock + restockAmount } : p)); setShowRestockModal(false); setSelectedProduct(null); };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-4 md:mb-6">
          <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Manajemen Produk</h2>
          <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kelola inventaris dan daftar produk Anda</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { label: 'Total Produk', value: totalProducts, color: 'blue', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                { label: 'Stok Rendah', value: lowStockProducts, color: 'orange', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                { label: 'Nilai Stok', value: `${(totalValue/1000000).toFixed(1)}jt`, color: 'green', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.03 }} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 md:p-4 shadow-sm border-l-4 border-${stat.color}-500`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                      <motion.p className={`text-lg md:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>{stat.value}</motion.p>
                    </div>
                    <motion.div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${isDarkMode ? `bg-${stat.color}-900/50` : `bg-${stat.color}-100`} flex items-center justify-center`} whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                      <svg className={`w-4 h-4 md:w-5 md:h-5 text-${stat.color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Search & Actions */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className={`w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari produk..." className={`w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 text-xs md:text-sm rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-200 bg-white'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`} />
              </div>
              <motion.button onClick={() => setShowAddModal(true)} className="px-4 md:px-6 py-2 md:py-2.5 rounded-full text-white text-xs md:text-sm font-medium whitespace-nowrap" style={{ backgroundColor: '#2ECC71' }} whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(46, 204, 113, 0.4)" }} whileTap={{ scale: 0.95 }}>+ Tambah Produk</motion.button>
            </motion.div>

            {/* Products Table/Cards */}
            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      {['Produk', 'Kategori', 'Harga', 'Stok', 'Aksi'].map(h => (
                        <th key={h} className={`px-4 py-3 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {filteredProducts.map((p, i) => (
                      <motion.tr key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ backgroundColor: isDarkMode ? '#374151' : '#f0fdf4' }} className="transition-colors">
                        <td className="px-4 py-3"><p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{p.name}</p></td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full text-xs`}>{p.category}</span></td>
                        <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rp {formatCurrency(p.price)}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock < 15 ? 'bg-red-100 text-red-600' : p.stock < 30 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>{p.stock}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <motion.button onClick={() => handleEditClick(p)} className={`p-1.5 text-blue-500 ${isDarkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50'} rounded`} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></motion.button>
                            <motion.button onClick={() => handleDeleteClick(p)} className={`p-1.5 text-red-500 ${isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'} rounded`} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className={`md:hidden divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {filteredProducts.map((p, i) => (
                  <motion.div key={p.id} className="p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{p.name}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock < 15 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{p.stock} stok</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`px-2 py-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full text-xs`}>{p.category}</span>
                        <p className="text-sm text-emerald-600 font-semibold mt-1">Rp {formatCurrency(p.price)}</p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button onClick={() => handleEditClick(p)} className={`p-2 text-blue-500 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-lg`} whileTap={{ scale: 0.9 }}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></motion.button>
                        <motion.button onClick={() => handleDeleteClick(p)} className={`p-2 text-red-500 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} rounded-lg`} whileTap={{ scale: 0.9 }}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 md:p-5 shadow-lg cursor-pointer">
              <h3 className="font-semibold text-white mb-3 text-sm md:text-base">Nilai Inventaris</h3>
              <motion.p className="text-2xl md:text-3xl font-bold text-white" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>Rp {formatCurrency(totalValue)}</motion.p>
              <p className="text-white/70 text-xs mt-1">{totalProducts} produk terdaftar</p>
            </motion.div>

            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-5 shadow-sm`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3 text-sm md:text-base`}>Stok Perlu Diisi</h3>
              <div className="space-y-2 md:space-y-3">
                {products.filter(p => p.stock < 15).map((p, i) => (
                  <motion.div key={p.id} className={`flex items-center justify-between p-2 md:p-3 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} rounded-lg`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                    <div>
                      <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{p.name}</p>
                      <p className="text-xs text-red-500">Sisa {p.stock} item</p>
                    </div>
                    <motion.button onClick={() => handleRestockClick(p)} className={`px-3 py-1.5 ${isDarkMode ? 'bg-red-800/50 hover:bg-red-800' : 'bg-red-100 hover:bg-red-200'} text-red-600 rounded-full text-xs font-medium`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Restock</motion.button>
                  </motion.div>
                ))}
                {products.filter(p => p.stock < 15).length === 0 && (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center py-4`}>Semua stok aman!</p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'} rounded-xl p-4 md:p-5 border`}>
              <div className="flex gap-3">
                <motion.div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </motion.div>
                <div>
                  <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>Tips Stok</p>
                  <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>Set notifikasi stok rendah untuk produk populer!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)}>
              <motion.div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 md:p-6 w-full max-w-md shadow-xl`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Tambah Produk Baru</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Nama Produk</label>
                    <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 outline-none text-sm`} placeholder="Masukkan nama produk" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Harga</label>
                      <input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 outline-none text-sm`} placeholder="0" />
                    </div>
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Stok</label>
                      <input type="number" required value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 outline-none text-sm`} placeholder="0" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <motion.button type="button" onClick={() => setShowAddModal(false)} className={`flex-1 py-2.5 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} font-medium text-sm`} whileTap={{ scale: 0.98 }}>Batal</motion.button>
                    <motion.button type="submit" className="flex-1 py-2.5 rounded-lg text-white font-medium text-sm" style={{ backgroundColor: '#2ECC71' }} whileHover={{ boxShadow: "0 10px 30px rgba(46, 204, 113, 0.4)" }} whileTap={{ scale: 0.98 }}>Tambah</motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditModal && (
            <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)}>
              <motion.div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 md:p-6 w-full max-w-md shadow-xl`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Edit Produk</h3>
                <form onSubmit={handleEditSave} className="space-y-4">
                  <div>
                    <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Nama Produk</label>
                    <input type="text" required value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 outline-none text-sm`} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Harga</label>
                      <input type="number" required value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 outline-none text-sm`} />
                    </div>
                    <div>
                      <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1.5`}>Stok</label>
                      <input type="number" required value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 outline-none text-sm`} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <motion.button type="button" onClick={() => setShowEditModal(false)} className={`flex-1 py-2.5 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} font-medium text-sm`} whileTap={{ scale: 0.98 }}>Batal</motion.button>
                    <motion.button type="submit" className="flex-1 py-2.5 rounded-lg bg-blue-500 text-white font-medium text-sm" whileHover={{ boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)" }} whileTap={{ scale: 0.98 }}>Simpan</motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDeleteModal && selectedProduct && (
            <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)}>
              <motion.div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 md:p-6 w-full max-w-sm shadow-xl`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Hapus Produk?</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Apakah Anda yakin ingin menghapus <strong>{selectedProduct.name}</strong>?</p>
                  <div className="flex gap-3">
                    <motion.button onClick={() => setShowDeleteModal(false)} className={`flex-1 py-2.5 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} font-medium text-sm`} whileTap={{ scale: 0.98 }}>Batal</motion.button>
                    <motion.button onClick={handleDeleteConfirm} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-medium text-sm" whileHover={{ boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4)" }} whileTap={{ scale: 0.98 }}>Hapus</motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRestockModal && selectedProduct && (
            <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRestockModal(false)}>
              <motion.div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 md:p-6 w-full max-w-sm shadow-xl`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Restock Produk</h3>
                <div className={`mb-4 p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{selectedProduct.name}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Stok saat ini: {selectedProduct.stock} item</p>
                </div>
                <div className="mb-6">
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>Jumlah Restock</label>
                  <div className="flex items-center gap-3">
                    <motion.button type="button" onClick={() => setRestockAmount(Math.max(1, restockAmount - 5))} className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} font-bold`} whileTap={{ scale: 0.9 }}>-</motion.button>
                    <input type="number" value={restockAmount} onChange={(e) => setRestockAmount(Math.max(1, Number(e.target.value)))} className={`flex-1 text-center px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white'} focus:border-emerald-500 outline-none text-lg font-semibold`} />
                    <motion.button type="button" onClick={() => setRestockAmount(restockAmount + 5)} className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} font-bold`} whileTap={{ scale: 0.9 }}>+</motion.button>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 text-center`}>Stok setelah restock: <span className="font-semibold text-emerald-600">{selectedProduct.stock + restockAmount} item</span></p>
                </div>
                <div className="flex gap-3">
                  <motion.button onClick={() => setShowRestockModal(false)} className={`flex-1 py-2.5 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} font-medium text-sm`} whileTap={{ scale: 0.98 }}>Batal</motion.button>
                  <motion.button onClick={handleRestockConfirm} className="flex-1 py-2.5 rounded-lg text-white font-medium text-sm" style={{ backgroundColor: '#2ECC71' }} whileHover={{ boxShadow: "0 10px 30px rgba(46, 204, 113, 0.4)" }} whileTap={{ scale: 0.98 }}>Restock</motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default ProdukPage;
