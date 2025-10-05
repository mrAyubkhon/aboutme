import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Routine from './pages/Routine';
import Water from './pages/Water';
import Finance from './pages/Finance';
import Journal from './pages/Journal';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 transition-colors duration-300">
        <Navbar />
        
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/water" element={<Water />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
