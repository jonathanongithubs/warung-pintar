import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import DashboardPage from './components/dashboard/DashboardPage'
import TransaksiPage from './components/dashboard/TransaksiPage'
import ProdukPage from './components/dashboard/ProdukPage'
import LaporanPage from './components/dashboard/LaporanPage'
import ProfilPage from './components/dashboard/ProfilPage'
// Investor Pages
import InvestorDashboard from './components/investor/InvestorDashboard'
import InvestorPortofolio from './components/investor/InvestorPortofolio'
import InvestorTemukan from './components/investor/InvestorTemukan'
import InvestorLaporan from './components/investor/InvestorLaporan'
import InvestorProfil from './components/investor/InvestorProfil'
import InvestorPengaturan from './components/investor/InvestorPengaturan'
import InvestorBantuan from './components/investor/InvestorBantuan'
import './App.css'

// Protected Route Component for UMKM users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Redirect investor to investor dashboard
  if (user?.user_type === 'investor') {
    return <Navigate to="/investor/dashboard" replace />;
  }
  
  return children;
};

// Protected Route Component for Investor users
const InvestorRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Redirect UMKM to UMKM dashboard
  if (user?.user_type !== 'investor') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Public Route (redirect based on user type if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    // Redirect based on user type
    if (user?.user_type === 'investor') {
      return <Navigate to="/investor/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      
      {/* UMKM Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/transaksi" element={<ProtectedRoute><TransaksiPage /></ProtectedRoute>} />
      <Route path="/produk" element={<ProtectedRoute><ProdukPage /></ProtectedRoute>} />
      <Route path="/laporan" element={<ProtectedRoute><LaporanPage /></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
      
      {/* Investor Routes */}
      <Route path="/investor/dashboard" element={<InvestorRoute><InvestorDashboard /></InvestorRoute>} />
      <Route path="/investor/portofolio" element={<InvestorRoute><InvestorPortofolio /></InvestorRoute>} />
      <Route path="/investor/temukan" element={<InvestorRoute><InvestorTemukan /></InvestorRoute>} />
      <Route path="/investor/laporan" element={<InvestorRoute><InvestorLaporan /></InvestorRoute>} />
      <Route path="/investor/profil" element={<InvestorRoute><InvestorProfil /></InvestorRoute>} />
      <Route path="/investor/pengaturan" element={<InvestorRoute><InvestorPengaturan /></InvestorRoute>} />
      <Route path="/investor/bantuan" element={<InvestorRoute><InvestorBantuan /></InvestorRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
