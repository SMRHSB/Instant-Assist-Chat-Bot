import { motion } from 'framer-motion';
import { X, Bot, Brain, Shield, Sparkles } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const features = [
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Get expert tech advice and recommendations"
    },
    {
      icon: Brain,
      title: "Smart Analysis",
      description: "Compare products and find what suits you best"
    },
    {
      icon: Shield,
      title: "Trusted Info",
      description: "Access reliable product information and insights"
    },
    {
      icon: Sparkles,
      title: "Quick Results",
      description: "Get instant suggestions for any tech category"
    }
  ];

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Instant Assist</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-8">
          <div className="prose dark:prose-invert">
            <p className="text-gray-600 dark:text-gray-400">
              Let us help you find the perfect tech products. From laptops to smartphones, we'll guide you to make the right choice.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2 shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help? Just ask about any tech product, and we'll guide you.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}