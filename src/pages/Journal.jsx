import { motion } from 'framer-motion';
import { useState } from 'react';
import { BookOpen, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import Card from '../components/Card';
import JournalEditor from '../components/JournalEditor';
import PhysicsButton from '../components/PhysicsButton';

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

export default function Journal() {
  const { 
    journalEntries, 
    addEntry, 
    updateEntry, 
    deleteEntry, 
    searchEntries,
    getEntriesCount 
  } = useJournal();
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState(journalEntries);

  // Update filtered entries when search query or entries change
  useState(() => {
    if (searchQuery.trim()) {
      setFilteredEntries(searchEntries(searchQuery));
    } else {
      setFilteredEntries(journalEntries);
    }
  }, [searchQuery, journalEntries]);

  const handleAddEntry = (title, content, tags) => {
    addEntry(title, content, tags);
    setShowEditor(false);
  };

  const handleUpdateEntry = (id, title, content, tags) => {
    updateEntry(id, title, content, tags);
    setEditingEntry(null);
    setShowEditor(false);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowEditor(true);
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setFilteredEntries(searchEntries(query));
    } else {
      setFilteredEntries(journalEntries);
    }
  };

  const sortedEntries = filteredEntries.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
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
              <h1 className="text-3xl font-bold text-gray-50 mb-2">Journal</h1>
              <p className="text-gray-300">Record your thoughts and experiences</p>
            </div>
            <PhysicsButton
              onClick={() => {
                setEditingEntry(null);
                setShowEditor(true);
              }}
              className="flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>New Entry</span>
            </PhysicsButton>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search entries..."
              className="w-full pl-10 pr-4 py-3 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Journal Editor */}
        {showEditor && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <JournalEditor
              entry={editingEntry}
              onSave={editingEntry ? handleUpdateEntry : handleAddEntry}
              onCancel={() => {
                setShowEditor(false);
                setEditingEntry(null);
              }}
            />
          </motion.div>
        )}

        {/* Entries Count */}
        <motion.div variants={itemVariants} className="mb-6">
          <p className="text-gray-400">
            {getEntriesCount()} total entries
            {searchQuery && ` • ${filteredEntries.length} found`}
          </p>
        </motion.div>

        {/* Entries List */}
        <motion.div variants={itemVariants}>
          {sortedEntries.length > 0 ? (
            <div className="space-y-4">
              {sortedEntries.map((entry) => (
                <Card key={entry.id} className="p-6 hover:border-blue-500/50 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-50 mb-2">
                        {entry.title}
                      </h3>
                      <p className="text-gray-300 mb-4 whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {entry.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString()}
                        {entry.updatedAt !== entry.createdAt && (
                          <span className="ml-2">• Edited</span>
                        )}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <PhysicsButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEntry(entry)}
                        className="text-gray-500 hover:text-blue-400"
                      >
                        <Edit size={16} />
                      </PhysicsButton>
                      <PhysicsButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-gray-500 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </PhysicsButton>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <BookOpen className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-50 mb-2">
                {searchQuery ? 'No entries found' : 'No entries yet'}
              </h3>
              <p className="text-gray-400 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms.'
                  : 'Start writing your first journal entry.'
                }
              </p>
              {!searchQuery && (
                <PhysicsButton onClick={() => setShowEditor(true)}>
                  <Plus size={18} className="mr-2" />
                  Write First Entry
                </PhysicsButton>
              )}
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}