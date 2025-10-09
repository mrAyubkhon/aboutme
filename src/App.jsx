import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { testSiteFunctionality } from './utils/testSite';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';
// import NotificationSystem, { NotificationProvider } from './components/NotificationSystem';
// import { LoadingProvider } from './context/LoadingContext';
// import LoadingIndicator from './components/LoadingIndicator';
import Home from './pages/Home';
import Routine from './pages/Routine';
import Water from './pages/Water';
import Finance from './pages/Finance';
import Journal from './pages/JournalSimple';
import Travel from './pages/Travel';
import TravelMap from './pages/TravelMap';
import GameStats from './pages/GameStats';
import Diagnostics from './pages/Diagnostics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  useEffect(() => {
    testSiteFunctionality();
  }, []);

  return (
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
              <Route path="/water" element={<Water />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/travel-map" element={<TravelMap />} />
              <Route path="/gamestats" element={<GameStats />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
}

export default App;
