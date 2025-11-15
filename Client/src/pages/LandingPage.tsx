import { Link } from 'react-router-dom';
import { Laptop, Smartphone, Headphones, Gamepad, Bot, Sun, Moon } from 'lucide-react';
import Logo from '../components/Logo';
import { useTheme } from '../hooks/useTheme';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Logo size="sm" />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Instant Assist</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm sm:text-base">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Sign Up →
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Your Tech Expert AI Assistant
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 px-4">
            Get expert advice on tech products, compare devices, and discover the best options tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:border-blue-600 dark:hover:border-blue-400 transition-colors"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>

        <div className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
            Expert Tech Guidance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
              <Laptop className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                Laptops
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Find the perfect laptop for your needs
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
              <Smartphone className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                Mobile Devices
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Compare smartphones, tablets, and wearables
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
              <Headphones className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                Audio Equipment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Discover the best headphones and speakers
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
              <Gamepad className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                Gaming & Entertainment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Expert advice on gaming consoles and TVs
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why Choose Instant Assist?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <Bot className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get detailed comparisons and recommendations based on your specific needs
              </p>
            </div>
            <div className="text-center">
              <Smartphone className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Mobile-First Design
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get tech advice on any device, whenever you need it
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}