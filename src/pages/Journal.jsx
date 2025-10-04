import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Calendar,
  Tag,
  BookOpen,
  Filter
} from 'lucide-react';
import { useJournal } from '../hooks/useLocalStorage';
import Card from '../components/Card';
import { format } from 'date-fns';

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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function Journal() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournal();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [entryForm, setEntryForm] = useState({
    title: '',
    content: '',
    tag: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entryForm.title.trim() && entryForm.content.trim()) {
      if (editingEntry) {
        updateEntry(editingEntry.id, entryForm.title, entryForm.content, entryForm.tag);
        setEditingEntry(null);
      } else {
        addEntry(entryForm.title, entryForm.content, entryForm.tag);
      }
      setEntryForm({ title: '', content: '', tag: '' });
      setShowAddForm(false);
    }
  };

  const handleEdit = (entry) => {
    setEntryForm({
      title: entry.title,
      content: entry.content,
      tag: entry.tag || ''
    });
    setEditingEntry(entry);
    setShowAddForm(true);
  };

  // Get unique tags
  const tags = [...new Set(entries.map(entry => entry.tag).filter(Boolean))];

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !filterTag || entry.tag === filterTag;
    return matchesSearch && matchesTag;
  });

  const sortedEntries = filteredEntries.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Journal
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Capture your thoughts, ideas, and reflections
              </p>
            </div>
            
            <motion.button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={16} />
              <span>New Entry</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All tags</option>
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {entries.length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Entries
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {new Set(entries.map(e => new Date(e.createdAt).toDateString())).size}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active Days
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Tag size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {tags.length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Unique Tags
            </p>
          </Card>
        </motion.div>

        {/* Entries List */}
        <motion.div variants={itemVariants} className="space-y-6">
          <AnimatePresence>
            {sortedEntries.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    {entries.length === 0 ? 'No entries yet' : 'No matching entries'}
                  </h3>
                  <p className="text-sm mb-6">
                    {entries.length === 0 
                      ? 'Start writing your first journal entry' 
                      : 'Try adjusting your search or filter'}
                  </p>
                  {entries.length === 0 && (
                    <motion.button
                      onClick={() => setShowAddForm(true)}
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={16} className="inline mr-2" />
                      Create First Entry
                    </motion.button>
                  )}
                </div>
              </Card>
            ) : (
              sortedEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <Card className="p-6 hover:shadow-md dark:hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {entry.title}
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{format(new Date(entry.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                          {entry.tag && (
                            <div className="flex items-center space-x-1">
                              <Tag size={14} />
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                                {entry.tag}
                              </span>
                            </div>
                          )}
                          {entry.updatedAt !== entry.createdAt && (
                            <span className="text-xs opacity-75">
                              (edited)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <motion.button
                          onClick={() => handleEdit(entry)}
                          className="p-2 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit3 size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => deleteEntry(entry.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {entry.content}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Add/Edit Entry Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAddForm(false);
                setEditingEntry(null);
                setEntryForm({ title: '', content: '', tag: '' });
              }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={entryForm.title}
                      onChange={(e) => setEntryForm({...entryForm, title: e.target.value})}
                      placeholder="What's on your mind?"
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      value={entryForm.content}
                      onChange={(e) => setEntryForm({...entryForm, content: e.target.value})}
                      placeholder="Write your thoughts here..."
                      rows={8}
                      className="input resize-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tag (optional)
                    </label>
                    <input
                      type="text"
                      value={entryForm.tag}
                      onChange={(e) => setEntryForm({...entryForm, tag: e.target.value})}
                      placeholder="e.g., ideas, goals, reflection"
                      className="input"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingEntry(null);
                        setEntryForm({ title: '', content: '', tag: '' });
                      }}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 px-4 py-2 btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {editingEntry ? 'Update Entry' : 'Save Entry'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
