import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Laptop,
  Watch,
  Smartphone,
  Tablet,
  Gamepad,
  Tv,
  Camera,
  Headphones,
} from 'lucide-react';

const categories = [
  { name: 'Laptop', icon: Laptop, path: '/qa/laptops' },
  { name: 'Wearable', icon: Watch, path: '/qa/wearables' },
  { name: 'Mobile', icon: Smartphone, path: '/qa/mobiles' },
  { name: 'Tablet', icon: Tablet, path: '/qa/tablets' },
  { name: 'Gaming Console', icon: Gamepad, path: '/qa/gaming_consoles' },
  { name: 'Television', icon: Tv, path: '/qa/televisions' },
  { name: 'Camera', icon: Camera, path: '/qa/cameras' },
  { name: 'Headphones & Speakers', icon: Headphones, path: '/qa/headphones_and_speakers' },
]; // ✅ Closing the array

export default function Dashboard() {
  const navigate = useNavigate(); // ✅ Add this line inside the component

  useEffect(() => {
    const validateSession = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/validate-session', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok || !data.valid) {
          sessionStorage.clear();
          navigate('/login');
        }
      } catch (err) {
        sessionStorage.clear();
        navigate('/login');
      }
    };

    validateSession();
  }, [navigate]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
        How can we help you today?
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
        Choose a product category below to start asking questions and get personalized recommendations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 category-grid">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={category.path}
            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <category.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
