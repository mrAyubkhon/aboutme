import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Tag } from 'lucide-react';
import PhysicsButton from './PhysicsButton';

/**
 * Journal entry editor component
 */
export default function JournalEditor({ 
  entry = null, 
  onSave, 
  onCancel,
  className = '' 
}) {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [tags, setTags] = useState(entry?.tags?.join(', ') || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsLoading(true);
    
    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
      
      if (entry) {
        onSave(entry.id, title, content, tagsArray);
      } else {
        onSave(title, content, tagsArray);
      }
      
      // Reset form
      setTitle('');
      setContent('');
      setTags('');
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    setTitle('');
    setContent('');
    setTags('');
    onCancel();
  };
  
  return (
        <motion.div
          className={`bg-gray-900 rounded-2xl p-6 border border-gray-800 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg relative overflow-hidden ${className}`}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{
            scale: 1.02,
            y: -2,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
          }}
          transition={{ 
            type: "spring",
            stiffness: 280,
            damping: 25,
            mass: 1.2,
            duration: 0.6
          }}
        >
          {/* Subtle background animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-50">
          {entry ? 'Edit Entry' : 'New Journal Entry'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="text-gray-500 hover:text-white"
        >
          <X size={16} />
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter entry title..."
            className="w-full px-3 py-2 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        
        {/* Content Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
          />
        </div>
        
        {/* Tags Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Tag size={16} className="inline mr-1" />
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., work, personal, ideas..."
            className="w-full px-3 py-2 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim() || isLoading}
            loading={isLoading}
            className="flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{entry ? 'Update' : 'Save'}</span>
          </Button>
            </div>
          </div>
          </div>
        </motion.div>
      );
    }
