import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';
import Home from './pages/Home';
import RoutineDebug from './pages/RoutineDebug';
import WaterDebug from './pages/WaterDebug';
import FinanceDebug from './pages/FinanceDebug';
import JournalDebug from './pages/JournalDebug';
import SettingsDebug from './pages/SettingsDebug';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 transition-all duration-500 ease-in-out">
        <Navbar />
        <CommandPalette />
        
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/routine" element={<RoutineDebug />} />
            <Route path="/water" element={<WaterDebug />} />
            <Route path="/finance" element={<FinanceDebug />} />
            <Route path="/journal" element={<JournalDebug />} />
            <Route path="/settings" element={<SettingsDebug />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
