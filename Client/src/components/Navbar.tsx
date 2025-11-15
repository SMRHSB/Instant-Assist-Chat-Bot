import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Home, MessageSquare, User, Menu, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import Logo from './Logo';
import clsx from 'clsx';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSidebarOpen(true);
  };

  // const handleLogout = () => {
  //   navigate('/');
  // };

  const handleLogout = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      sessionStorage.clear();
      navigate('/');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        sessionStorage.clear();
        navigate('/');
      } else {
        console.error('Failed to logout from server');
        sessionStorage.clear();
        navigate('/');
      }
    } catch (err) {
      console.error('Logout error:', err);
      sessionStorage.clear();
      navigate('/');
    }
  };
  

  const isActive = (path: string) => {
    if (path === '/qa') {
      return location.pathname.startsWith('/qa');
    }
    return location.pathname === path;
  };

  const navIconClasses = (path: string) => clsx(
    'transition-colors duration-200',
    isActive(path)
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
  );

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="#" onClick={handleLogoClick} className="flex items-center space-x-2">
              <Logo size="sm" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Instant Assist</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/dashboard" className={navIconClasses('/dashboard')}>
                <Home className="w-5 h-5" />
              </Link>
              <Link to="/qa" className={navIconClasses('/qa')}>
                <MessageSquare className="w-5 h-5" />
              </Link>
              {/* <Link to="/profile" className={navIconClasses('/profile')}>
                <User className="w-5 h-5" />
              </Link> */}
              <button
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/dashboard"
                  className={clsx(
                    "flex items-center space-x-2",
                    navIconClasses('/dashboard')
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/qa"
                  className={clsx(
                    "flex items-center space-x-2",
                    navIconClasses('/qa')
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Ask Questions</span>
                </Link>
                {/* <Link
                  to="/profile"
                  className={clsx(
                    "flex items-center space-x-2",
                    navIconClasses('/profile')
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link> */}
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}