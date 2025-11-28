import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Halo! 👋 Saya asisten virtual Warung Pintar. Ada yang bisa saya bantu hari ini?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const quickRepliesRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle horizontal scroll with mouse wheel on desktop
  useEffect(() => {
    const quickRepliesEl = quickRepliesRef.current;
    if (!quickRepliesEl) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        quickRepliesEl.scrollLeft += e.deltaY;
      }
    };

    quickRepliesEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => quickRepliesEl.removeEventListener('wheel', handleWheel);
  }, [isOpen]);

  const botResponses = [
    'Tentu! Saya bisa membantu Anda dengan pertanyaan seputar manajemen warung.',
    'Untuk menambah produk baru, Anda bisa pergi ke menu Produk dan klik tombol "Tambah Item".',
    'Laporan keuangan bisa diakses melalui menu Laporan. Anda bisa filter berdasarkan tanggal.',
    'Jika ada kendala teknis, silakan hubungi tim support kami di support@warungpintar.id',
    'Tips: Catat setiap transaksi secara rutin untuk laporan yang lebih akurat!',
    'Anda bisa mengatur notifikasi stok rendah di menu Profil > Notifikasi.',
    'Terima kasih sudah menggunakan Warung Pintar! Ada yang lain yang bisa saya bantu?',
  ];

  const quickReplies = [
    'Cara tambah produk?',
    'Lihat laporan',
    'Bantuan teknis',
    'Tips bisnis',
    'Kelola stok',
    'Hubungi support',
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = { id: messages.length + 1, type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = { id: messages.length + 2, type: 'bot', text: randomResponse };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (text) => {
    setInputValue(text);
    setTimeout(() => {
      const userMessage = { id: messages.length + 1, type: 'user', text };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);

      setTimeout(() => {
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        const botMessage = { id: messages.length + 2, type: 'bot', text: randomResponse };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);
    }, 100);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center z-50"
        style={{ backgroundColor: '#2ECC71' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: isOpen 
            ? '0 0 0 0 rgba(46, 204, 113, 0)' 
            : ['0 0 0 0 rgba(46, 204, 113, 0.4)', '0 0 0 20px rgba(46, 204, 113, 0)', '0 0 0 0 rgba(46, 204, 113, 0)']
        }}
        transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 md:bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50"
            style={{ maxHeight: 'calc(100vh - 140px)' }}
          >
            {/* Header */}
            <div className="p-4 text-white" style={{ backgroundColor: '#114B3A' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2C16 2 6 8 6 18C6 24.627 10.373 30 16 30C21.627 30 26 24.627 26 18C26 8 16 2 16 2Z" fill="#2ECC71"/>
                    <path d="M16 8C16 8 12 12 12 18C12 22 13.5 25 16 25C18.5 25 20 22 20 18C20 12 16 8 16 8Z" fill="#114B3A"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Asisten Warung Pintar</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-white/70">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-72 md:h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-emerald-500 text-white rounded-br-md' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm rounded-bl-md'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1">
                      <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} />
                      <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }} />
                      <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies - Horizontal scroll with wheel and touch swipe */}
            <div className="px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <div 
                ref={quickRepliesRef}
                className="flex gap-2 overflow-x-auto touch-pan-x"
                style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              >
                {quickReplies.map((reply, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 text-center">
                <span className="hidden md:inline">Scroll untuk opsi lainnya</span>
                <span className="md:hidden">Geser untuk opsi lainnya →</span>
              </p>
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ketik pesan..."
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-full text-sm outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all"
                />
                <motion.button
                  onClick={handleSend}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: '#2ECC71' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
