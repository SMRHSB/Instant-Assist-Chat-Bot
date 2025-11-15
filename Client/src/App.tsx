import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from './hooks/useTheme';
import { useTutorialStore } from './store/tutorialStore';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import QAPage from './pages/QAPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Layout from './components/Layout';
import Tutorial from './components/Tutorial';
import PageTransition from './components/PageTransition';

function App() {
  const { theme } = useTheme();
  const { hasCompletedTutorial } = useTutorialStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={theme}>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            
            {/* Protected routes */}
            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={
                  <PageTransition>
                    {!hasCompletedTutorial && <Tutorial />}
                    <Dashboard />
                  </PageTransition>
                }
              />
              <Route 
                path="/qa/:category?" 
                element={
                  <PageTransition>
                    {!hasCompletedTutorial && <Tutorial />}
                    <QAPage />
                  </PageTransition>
                }
              />
              <Route 
                path="/profile" 
                element={
                  <PageTransition>
                    {!hasCompletedTutorial && <Tutorial />}
                    <ProfilePage />
                  </PageTransition>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </div>
  );
}

export default App;