import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { testSiteFunctionality } from './utils/testSite';
import { SportProvider } from './context/SportContext';
import { isAuthenticated } from './services/authService';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';
import AuthPage from './pages/AuthPage';
import WelcomePage from './pages/WelcomePage';
import Home from './pages/Home';
import Routine from './pages/Routine';
import Sport from './pages/Sport';
import Finance from './pages/Finance';
import Journal from './pages/JournalSimple';
import Travel from './pages/Travel';
import GameStats from './pages/GameStats';
import Diagnostics from './pages/Diagnostics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    testSiteFunctionality();
    // Check if user is already authenticated
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowWelcome(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowWelcome(false);
  };

  // Show welcome page after successful login
  if (showWelcome) {
    return (
      <SportProvider>
        <WelcomePage onLogout={handleLogout} onContinue={() => setShowWelcome(false)} />
      </SportProvider>
    );
  }

  // Show auth page if not logged in
  if (!isLoggedIn) {
    return (
      <SportProvider>
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      </SportProvider>
    );
  }

  // Show main app if logged in and welcome is done
  return (
    <SportProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
          <div className="min-h-screen bg-gray-950 transition-all duration-500 ease-in-out">
            <Navbar />
            <CommandPalette />
            
            <main className="min-h-screen">
              <Routes>
              {/* Public Routes */}
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/" element={<Home />} />
              <Route path="/routine" element={<Routine />} />
              <Route path="/sport" element={<Sport />} />
              <Route path="/water" element={<Sport />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/gamestats" element={<GameStats />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SportProvider>
  );
}

export default App;
