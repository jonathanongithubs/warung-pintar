import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import DashboardPage from './components/dashboard/DashboardPage'
import TransaksiPage from './components/dashboard/TransaksiPage'
import ProdukPage from './components/dashboard/ProdukPage'
import LaporanPage from './components/dashboard/LaporanPage'
import ProfilPage from './components/dashboard/ProfilPage'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transaksi" element={<TransaksiPage />} />
          <Route path="/produk" element={<ProdukPage />} />
          <Route path="/laporan" element={<LaporanPage />} />
          <Route path="/profil" element={<ProfilPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
