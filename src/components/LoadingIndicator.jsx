import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';

export default function LoadingIndicator() {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center p-6 rounded-xl bg-gray-800 border border-gray-700 shadow-2xl"
          >
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
            <p className="text-lg font-semibold text-gray-50">Loading...</p>
            <p className="text-sm text-gray-400 mt-1">Please wait a moment</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
