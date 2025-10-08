import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';
import { NotificationProvider } from './components/NotificationSystem';
import { LoadingProvider } from './context/LoadingContext';
import LoadingIndicator from './components/LoadingIndicator';
import Home from './pages/Home';
import Routine from './pages/Routine';
import Water from './pages/Water';
import Finance from './pages/Finance';
import Journal from './pages/JournalSimple';
import GameStats from './pages/GameStats';
import Diagnostics from './pages/Diagnostics';
import Settings from './pages/Settings';

function App() {
  return (
    <NotificationProvider>
      <LoadingProvider>
        <Router>
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
              <Route path="/gamestats" element={<GameStats />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <LoadingIndicator />
        </div>
        </Router>
      </LoadingProvider>
    </NotificationProvider>
  );
}

export default App;
