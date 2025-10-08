import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit3, Save, X } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';
// import { useNotificationHelpers } from '../components/NotificationSystem';
import apiService from '../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export default function JournalSimple() {
  const [entries, setEntries] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  // const { showEntrySaved, showError } = useNotificationHelpers();

  // Load entries from backend
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const response = await apiService.getJournalEntries();
      if (response.entries) {
        setEntries(response.entries);
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
      // Fallback to localStorage
      const savedEntries = JSON.parse(localStorage.getItem('journal_entries') || '[]');
      setEntries(savedEntries);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    try {
        if (!formData.title.trim() || !formData.content.trim()) {
          console.error('Validation Error: Please fill in both title and content fields.');
          alert('Please fill in both title and content fields.');
          return;
        }

      const newEntry = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      setLoading(true);
      
      // Try to save to backend first
      try {
        const response = await apiService.createJournalEntry(newEntry);
        if (response.entry_id) {
          // Backend saved successfully
          const savedEntry = {
            id: response.entry_id,
            ...newEntry,
            created_at: new Date().toISOString()
          };
          setEntries(prev => [savedEntry, ...prev]);
          
          console.log('Journal entry saved successfully!', savedEntry);
          
          // Entry saved successfully
        }
      } catch (backendError) {
        console.warn('Backend save failed, saving to localStorage:', backendError);
        // Fallback to localStorage
        const savedEntry = {
          id: Date.now(),
          ...newEntry,
          createdAt: new Date().toISOString(),
          mood: 'neutral'
        };
        
        const existingEntries = JSON.parse(localStorage.getItem('journal_entries') || '[]');
        const updatedEntries = [savedEntry, ...existingEntries];
        localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
        
        setEntries(updatedEntries);
        
        console.log('Journal entry saved locally!', savedEntry);
        alert('Journal entry saved locally!');
      }
      
      setFormData({ title: '', content: '', tags: '' });
      setShowEditor(false);
      
    } catch (error) {
      console.error('Save Error: Failed to save journal entry. Please try again.', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sortedEntries = entries.sort((a, b) => 
    new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)
  );

  return (
    <motion.div
      className="min-h-screen bg-gray-950 pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-50 mb-2 flex items-center">
                <BookOpen className="mr-3 text-blue-400" size={32} />
                Journal & Thoughts
              </h1>
              <p className="text-gray-300">Capture your thoughts, ideas, and daily reflections</p>
            </div>
            <PhysicsButton
              onClick={() => setShowEditor(!showEditor)}
              icon={Plus}
              variant="primary"
              className="flex items-center space-x-2"
            >
              New Entry
            </PhysicsButton>
          </div>
        </motion.div>

        {/* Journal Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <BookOpen className="mr-2 text-blue-400" size={24} />
                Total Entries
              </h3>
              <span className="text-2xl font-bold text-blue-400">{entries.length}</span>
            </div>
            <p className="text-sm text-gray-400">Journal entries</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <Edit3 className="mr-2 text-green-400" size={24} />
                This Week
              </h3>
              <span className="text-2xl font-bold text-green-400">
                {entries.filter(entry => {
                  const entryDate = new Date(entry.created_at || entry.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return entryDate > weekAgo;
                }).length}
              </span>
            </div>
            <p className="text-sm text-gray-400">New entries</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <span className="mr-2 text-purple-400">📝</span>
                Last Entry
              </h3>
              <span className="text-2xl font-bold text-purple-400">
                {entries.length > 0 ? new Date(sortedEntries[0].created_at || sortedEntries[0].createdAt).toLocaleDateString() : '-'}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {entries.length > 0 ? 'Most recent' : 'Never'}
            </p>
          </div>
        </motion.div>

        {/* Journal Editor */}
        {showEditor && (
          <motion.div 
            variants={itemVariants}
            className="bg-gray-900 p-6 rounded-xl mb-8 border border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-50 mb-4">New Journal Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Entry title"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Write your thoughts here..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="personal, thoughts, ideas"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex space-x-2">
                <PhysicsButton
                  onClick={handleSaveEntry}
                  variant="primary"
                  className="flex-1 flex items-center justify-center space-x-2"
                  disabled={loading}
                >
                  <Save size={16} />
                  <span>{loading ? 'Saving...' : 'Save Entry'}</span>
                </PhysicsButton>
                <PhysicsButton
                  onClick={() => {
                    setShowEditor(false);
                    setFormData({ title: '', content: '', tags: '' });
                  }}
                  variant="secondary"
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </PhysicsButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Entries */}
        <motion.div variants={itemVariants} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold text-gray-50 mb-4">Recent Entries</h3>
          {entries.length > 0 ? (
            <div className="space-y-4">
              {sortedEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} data-entry-id={entry.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-gray-50 font-medium mb-2">{entry.title}</h4>
                      <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                        {entry.content}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{new Date(entry.created_at || entry.createdAt).toLocaleDateString()}</span>
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex space-x-1">
                            {entry.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="bg-gray-700 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                            {entry.tags.length > 3 && (
                              <span className="text-gray-500">+{entry.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <PhysicsButton
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-50"
                      >
                        View
                      </PhysicsButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-50 mb-2">No entries yet</h3>
              <p className="text-gray-400 mb-4">Start your journaling journey by writing your first entry.</p>
              <PhysicsButton
                onClick={() => setShowEditor(true)}
                icon={Plus}
                variant="primary"
                className="flex items-center space-x-2"
              >
                Write Your First Entry
              </PhysicsButton>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
