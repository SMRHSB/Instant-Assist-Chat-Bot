import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bot, X } from 'lucide-react';
import { useTutorialStore } from '../store/tutorialStore';
import { motion, AnimatePresence } from 'framer-motion';

const tutorialSteps = [
  {
    path: '/dashboard',
    message: "Welcome to Instant Assist! I'm your AI assistant for tech products. Let me show you around.",
    highlight: '.logo',
  },
  {
    path: '/dashboard',
    message: "This is your dashboard where you can choose different product categories to get expert advice. Click on any category to start asking questions.",
    highlight: '.category-grid',
  },
  {
    path: '/qa/laptops',
    message: "This is the Q&A page where you can ask me anything about tech products. I'll provide detailed answers based on the selected category.",
    highlight: '.chat-input',
  },
  // {
  //   path: '/profile',
  //   message: "This is your profile page where you can manage your account settings and preferences.",
  //   highlight: '.profile-section',
  // },
  // {
  //   path: '/profile',
  //   message: "You can update your profile information, change your password, and customize your experience here.",
  //   highlight: '.profile-form',
  // },
  {
    path: '/dashboard',
    message: "That's it! You're all set to start exploring tech products. Remember, I'm here to help you make informed decisions.",
    highlight: '.category-grid',
  }
];

export default function Tutorial() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, hasCompletedTutorial, setHasCompletedTutorial } = useTutorialStore();

  useEffect(() => {
    const targetPath = tutorialSteps[currentStep]?.path;
    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [currentStep, location.pathname, navigate]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTutorial();
    }
  };

  const finishTutorial = () => {
    setHasCompletedTutorial(true);
    setCurrentStep(0);
    navigate('/dashboard');
  };

  if (hasCompletedTutorial || !tutorialSteps[currentStep]) {
    return null;
  }

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center"
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
        >
          <button
            onClick={finishTutorial}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
              <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white mb-4">{currentTutorialStep.message}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={finishTutorial}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Skip tutorial
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}