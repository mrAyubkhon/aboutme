import { useState } from 'react';
import { BookOpen, Plus, Edit3 } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';

/**
 * Debug version of Journal page
 */
export default function JournalDebug() {
  const [showEditor, setShowEditor] = useState(false);
  const [entries] = useState([]);

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-50 mb-2">Journal & Thoughts</h1>
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
        </div>

        {/* Journal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <BookOpen className="mr-2 text-blue-400" size={24} />
                Total Entries
              </h3>
              <span className="text-2xl font-bold text-blue-400">{entries.length}</span>
            </div>
            <p className="text-sm text-gray-400">Journal entries</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <Edit3 className="mr-2 text-green-400" size={24} />
                This Week
              </h3>
              <span className="text-2xl font-bold text-green-400">0</span>
            </div>
            <p className="text-sm text-gray-400">New entries</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <span className="mr-2 text-purple-400">📝</span>
                Last Entry
              </h3>
              <span className="text-2xl font-bold text-purple-400">-</span>
            </div>
            <p className="text-sm text-gray-400">Never</p>
          </div>
        </div>

        {/* Journal Editor */}
        {showEditor && (
          <div className="bg-gray-900 p-6 rounded-xl mb-8">
            <h3 className="text-lg font-semibold text-gray-50 mb-4">New Journal Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Entry title"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  rows={6}
                  placeholder="Write your thoughts here..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="personal, thoughts, ideas"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <PhysicsButton
                  onClick={() => alert('Entry saved!')}
                  variant="primary"
                  className="flex-1"
                >
                  Save Entry
                </PhysicsButton>
                <PhysicsButton
                  onClick={() => setShowEditor(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </PhysicsButton>
              </div>
            </div>
          </div>
        )}

        {/* Recent Entries */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-50 mb-4">Recent Entries</h3>
          {entries.length > 0 ? (
            <div className="space-y-4">
              {/* Entries would be listed here */}
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
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-50 mb-2">Debug Info</h3>
          <p className="text-gray-300">This is the debug version of the Journal page.</p>
          <p className="text-gray-300">If you see this, the basic components are working.</p>
        </div>
      </div>
    </div>
  );
}
