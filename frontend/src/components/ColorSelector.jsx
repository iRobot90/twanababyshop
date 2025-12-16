import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ColorSelector = ({
  colors = [],
  selectedColor,
  onColorSelect,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const borderSize = {
    sm: 'p-0.5',
    md: 'p-1',
    lg: 'p-1.5',
  };

  if (!colors.length) return null;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {colors.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onColorSelect(color)}
          className={`${borderSize[size]} rounded-full transition-all ${
            selectedColor === color.value
              ? 'ring-2 ring-offset-2 ring-primary'
              : 'hover:ring-1 hover:ring-gray-300'
          }`}
          aria-label={`Select color ${color.name}`}
          title={color.name}
        >
          <div
            className={`${sizeClasses[size]} rounded-full border border-gray-200 shadow-sm`}
            style={{ backgroundColor: color.value }}
          >
            <AnimatePresence>
              {selectedColor === color.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <svg
                    className="w-3/4 h-3/4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ColorSelector;
