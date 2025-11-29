import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import InvestorLayout from './InvestorLayout';

const InvestorBantuan = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: 'Bagaimana cara memulai investasi di platform ini?',
      answer: 'Untuk memulai investasi, Anda perlu: 1) Mendaftar dan verifikasi akun, 2) Lengkapi profil investor Anda, 3) Telusuri peluang investasi di halaman "Temukan", 4) Pilih UMKM yang sesuai dengan kriteria Anda, 5) Lakukan investasi dengan jumlah minimum yang ditentukan.',
    },
    {
      question: 'Berapa minimum investasi yang diperlukan?',
      answer: 'Setiap UMKM memiliki ketentuan minimum investasi yang berbeda, mulai dari Rp 1.000.000. Anda dapat melihat detail minimum investasi di halaman profil setiap UMKM.',
    },
    {
      question: 'Bagaimana cara melihat performa investasi saya?',
      answer: 'Anda dapat memantau performa investasi melalui halaman "Dasbor" dan "Portofolio". Di sana Anda akan melihat statistik lengkap termasuk total investasi, revenue, profit, dan ROI dari setiap UMKM yang Anda investasikan.',
    },
    {
      question: 'Kapan saya akan menerima dividen?',
      answer: 'Dividen biasanya dibagikan setiap kuartal (3 bulan sekali) tergantung pada perjanjian dengan UMKM terkait. Anda akan menerima notifikasi ketika dividen siap dicairkan.',
    },
    {
      question: 'Apa itu Trust Score?',
      answer: 'Trust Score adalah penilaian kredibilitas UMKM berdasarkan beberapa faktor: riwayat keuangan, konsistensi pembayaran dividen, pertumbuhan bisnis, dan review dari investor lain. Score A adalah tertinggi, diikuti B dan C.',
    },
    {
      question: 'Bagaimana cara mencairkan keuntungan?',
      answer: 'Untuk mencairkan keuntungan: 1) Buka halaman Portofolio, 2) Pilih "Withdraw Profit", 3) Masukkan jumlah yang ingin dicairkan, 4) Pilih rekening tujuan, 5) Konfirmasi transaksi. Dana akan masuk dalam 1-3 hari kerja.',
    },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const contactOptions = [
    { icon: 'email', title: 'Email Support', desc: 'support@investpro.id', action: 'mailto:support@investpro.id' },
    { icon: 'whatsapp', title: 'WhatsApp', desc: '+62 812 3456 7890', action: 'https://wa.me/6281234567890' },
    { icon: 'phone', title: 'Call Center', desc: '021-1234-5678', action: 'tel:02112345678' },
  ];

  return (
    <InvestorLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6 text-center">
          <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Help Center
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Find answers to frequently asked questions
          </p>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for help..."
              className={`w-full px-5 py-4 pl-12 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
              } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all shadow-sm`}
            />
            <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto mb-8">
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <motion.div 
                key={index}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className={`w-full px-5 py-4 flex items-center justify-between text-left ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
                >
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{faq.question}</span>
                  <motion.svg 
                    className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-5 pb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed`}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Options */}
        <motion.div variants={itemVariants}>
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 text-center`}>
            Still Need Help?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {contactOptions.map((option, index) => (
              <motion.a
                key={option.title}
                href={option.action}
                className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-xl p-5 shadow-sm text-center transition-colors`}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'} flex items-center justify-center`}>
                  {option.icon === 'email' && (
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {option.icon === 'whatsapp' && (
                    <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  )}
                  {option.icon === 'phone' && (
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  )}
                </div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{option.title}</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{option.desc}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </InvestorLayout>
  );
};

export default InvestorBantuan;

