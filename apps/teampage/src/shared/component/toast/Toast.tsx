'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Text } from '@/shared/component/Text';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-6 left-1/2 z-50"
          style={{ x: '-50%' }}
          initial={{
            opacity: 0,
            y: -50,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -30,
            scale: 0.9,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.3,
          }}
        >
          <motion.div
            className="bg-grey-900 px-5 py-3 rounded-[40px] shadow-lg"
            initial={{ boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            animate={{
              boxShadow: '0 10px 25px rgba(0,0,0,0.3), 0 0 0 rgba(0,0,0,0)',
            }}
            transition={{ delay: 0.1 }}
          >
            <Text variant="body-16-b" color="white">
              {message}
            </Text>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
