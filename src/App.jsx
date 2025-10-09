import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { testSiteFunctionality } from './utils/testSite';
import { SportProvider } from './context/SportContext';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';
// import NotificationSystem, { NotificationProvider } from './components/NotificationSystem';
// import { LoadingProvider } from './context/LoadingContext';
// import LoadingIndicator from './components/LoadingIndicator';
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

function App() {
  useEffect(() => {
    testSiteFunctionality();
  }, []);

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
