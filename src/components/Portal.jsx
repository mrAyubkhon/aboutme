import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal component to render children outside the normal DOM hierarchy
 */
export default function Portal({ children, targetId = 'modal-root' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Create modal root if it doesn't exist
    if (!document.getElementById(targetId)) {
      const modalRoot = document.createElement('div');
      modalRoot.id = targetId;
      modalRoot.style.position = 'relative';
      modalRoot.style.zIndex = '9999';
      document.body.appendChild(modalRoot);
    }

    return () => {
      // Clean up modal root on unmount
      const modalRoot = document.getElementById(targetId);
      if (modalRoot && modalRoot.children.length === 0) {
        document.body.removeChild(modalRoot);
      }
    };
  }, [targetId]);

  if (!mounted) {
    return null;
  }

  const targetElement = document.getElementById(targetId);
  return targetElement ? createPortal(children, targetElement) : null;
}
