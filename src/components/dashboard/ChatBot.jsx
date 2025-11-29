import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../../services/geminiService';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Halo! 👋 Ada yang bisa saya bantu tentang Warung Pintar?' },
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

  const quickReplies = [
    'Cara tambah produk?',
    'Cara input transaksi?',
    'Lihat laporan',
    'Kelola stok',
  ];

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = { id: Date.now(), type: 'user', text: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = messages.filter(m => m.type === 'user' || m.type === 'bot');
      const response = await sendMessageToGemini(inputValue.trim(), history);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: 'Maaf, coba lagi nanti. 🙏' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = async (text) => {
    if (isTyping) return;
    
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text }]);
    setIsTyping(true);

    try {
      const history = messages.filter(m => m.type === 'user' || m.type === 'bot');
      const response = await sendMessageToGemini(text, history);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: 'Maaf, coba lagi. 🙏' }]);
    } finally {
      setIsTyping(false);
    }
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
            className="fixed bottom-20 md:bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50"
            style={{ maxHeight: 'calc(100vh - 140px)' }}
          >
            {/* Header */}
            <div className="p-3 text-white" style={{ backgroundColor: '#114B3A' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2C16 2 6 8 6 18C6 24.627 10.373 30 16 30C21.627 30 26 24.627 26 18C26 8 16 2 16 2Z" fill="#2ECC71"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Asisten Warung Pintar</h3>
                  <span className="text-[10px] text-white/60">Hanya menjawab tentang fitur web ini</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-emerald-500 text-white rounded-br-sm' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1">
                      <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} />
                      <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }} />
                      <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-3 py-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <div ref={quickRepliesRef} className="flex gap-2 overflow-x-auto" style={{ scrollBehavior: 'smooth' }}>
                {quickReplies.map((reply, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    disabled={isTyping}
                    className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium whitespace-nowrap disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tanya tentang fitur..."
                  disabled={isTyping}
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-full text-sm outline-none focus:ring-2 focus:ring-emerald-200 disabled:opacity-50"
                />
                <motion.button
                  onClick={handleSend}
                  disabled={isTyping || !inputValue.trim()}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-50"
                  style={{ backgroundColor: '#2ECC71' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
