import React, { useState, useEffect } from 'react';
import EnhancedProgressBar from './EnhancedProgressBar';

/**
 * Test component to verify progress bars work correctly
 */
export default function TestProgressBar() {
  const [testValue, setTestValue] = useState(0);
  const [testMax, setTestMax] = useState(100);

  useEffect(() => {
    // Animate test value from 0 to 75 over 3 seconds
    const interval = setInterval(() => {
      setTestValue(prev => {
        if (prev >= 75) {
          clearInterval(interval);
          return 75;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 m-4">
      <h3 className="text-lg font-semibold text-gray-50 mb-4">Progress Bar Test</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-400 mb-2">
            Test Progress: {testValue}/{testMax} ({Math.round((testValue/testMax) * 100)}%)
          </p>
          <EnhancedProgressBar
            value={testValue}
            max={testMax}
            label="Test Progress"
            variant="blue"
            size="lg"
            glow={true}
            animated={true}
          />
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-2">
            Static Progress: 50/100 (50%)
          </p>
          <EnhancedProgressBar
            value={50}
            max={100}
            label="Static Progress"
            variant="green"
            size="lg"
            glow={true}
            animated={true}
          />
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-2">
            Water Test: 2500/3000 (83%)
          </p>
          <EnhancedProgressBar
            value={2500}
            max={3000}
            label="Water Intake"
            variant="blue"
            size="lg"
            glow={true}
            animated={true}
          />
        </div>
      </div>
    </div>
  );
}
