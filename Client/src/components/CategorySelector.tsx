import { motion } from 'framer-motion';
import { Laptop, Watch, Smartphone, Tablet, Gamepad, Tv, Camera, Headphones, X } from 'lucide-react';

interface CategorySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
}

const categories = [
  { name: 'Laptop', icon: Laptop, path: 'laptops' },
  { name: 'Wearable', icon: Watch, path: 'wearables' },
  { name: 'Mobile', icon: Smartphone, path: 'mobiles' },
  { name: 'Tablet', icon: Tablet, path: 'tablets' },
  { name: 'Gaming Console', icon: Gamepad, path: 'gaming_consoles' },
  { name: 'Television', icon: Tv, path: 'televisoins' },
  { name: 'Camera', icon: Camera, path: 'cameras' },
  { name: 'Headphones & Speakers', icon: Headphones, path: 'headphones_and_speakers' },
]; 

export default function CategorySelector({ isOpen, onClose, onSelect }: CategorySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${!isOpen && 'pointer-events-none'}`}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select a Category</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <motion.button
              key={category.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(category.path)}
              className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <category.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                {category.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}