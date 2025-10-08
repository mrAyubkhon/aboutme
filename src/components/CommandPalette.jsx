import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Home, 
  Calendar, 
  Droplets, 
  DollarSign, 
  BookOpen, 
  Settings,
  Plus,
  X
} from 'lucide-react';
import PhysicsButton from './PhysicsButton';

/**
 * Command Palette for quick navigation (Cmd+K / Ctrl+K)
 */
export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const commands = [
    { id: 'home', name: 'Go to Home', icon: Home, action: () => navigate('/'), keywords: ['dashboard', 'overview'] },
    { id: 'routine', name: 'Go to Routine Tracker', icon: Calendar, action: () => navigate('/routine'), keywords: ['habits', 'tasks'] },
    { id: 'water', name: 'Go to Water Tracker', icon: Droplets, action: () => navigate('/water'), keywords: ['hydration', 'drink'] },
    { id: 'finance', name: 'Go to Finance Helper', icon: DollarSign, action: () => navigate('/finance'), keywords: ['money', 'budget', 'expenses'] },
    { id: 'journal', name: 'Go to Journal', icon: BookOpen, action: () => navigate('/journal'), keywords: ['notes', 'thoughts', 'diary'] },
    { id: 'settings', name: 'Go to Settings', icon: Settings, action: () => navigate('/settings'), keywords: ['preferences', 'config'] },
    { id: 'add-habit', name: 'Add New Habit', icon: Plus, action: () => navigate('/routine'), keywords: ['create habit', 'new task'] },
    { id: 'add-water', name: 'Log Water', icon: Plus, action: () => navigate('/water'), keywords: ['drink water'] },
    { id: 'add-expense', name: 'Add Expense', icon: Plus, action: () => navigate('/finance'), keywords: ['spend', 'payment'] },
    { id: 'new-journal', name: 'New Journal Entry', icon: Plus, action: () => navigate('/journal'), keywords: ['write', 'note'] },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.keywords.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommandClick = (command) => {
    command.action();
    setIsOpen(false);
    setSearch('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Command Palette */}
          <motion.div
            className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center space-x-3 p-4 border-b border-gray-800">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-gray-50 placeholder-gray-400"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <PhysicsButton
                  onClick={() => setIsOpen(false)}
                  icon={X}
                  variant="ghost"
                  size="sm"
                />
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                  <div className="space-y-1">
                    {filteredCommands.map((command, index) => (
                      <PhysicsButton
                        key={command.id}
                        onClick={() => handleCommandClick(command)}
                        icon={command.icon}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto p-3"
                      >
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                          <command.icon size={20} className="text-blue-400" />
                        </div>
                        <span className="flex-1 text-gray-50 font-medium">
                          {command.name}
                        </span>
                      </PhysicsButton>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="p-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-gray-400">No commands found</p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-3 border-t border-gray-800 text-xs text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>Esc Close</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-800 rounded">⌘</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-gray-800 rounded">K</kbd>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
