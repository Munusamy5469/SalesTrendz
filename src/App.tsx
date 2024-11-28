import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home'; // Home page component
import MenuBar from './components/MenuBar';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Forecast from './pages/Forecast';
import SalesManagement from './pages/SalesManagement';
import Chatbot from './components/Chatbot';
import { auth } from './lib/firebase'; // Firebase auth import

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); // Once auth state is determined, set loading to false
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth state
  }

  return (
    <Router>
      <Toaster position="top-right" />
      {/* Wrap authenticated routes with the MenuBar layout */}
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <>
              <Navbar />
              <Home />
              </>
              } 
            /> {/* Default page is Home */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (with MenuBar) */}
        <Route
          path="/profile"
          element={
            user ? (
              <>
                <Profile />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/analytics"
          element={
            user ? (
              <>
                <Analytics />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/forecast"
          element={
            user ? (
              <>
                <Forecast />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/sales"
          element={
            user ? (
              <>
                <SalesManagement />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Default route to home for unmatched routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {user && <Chatbot />}
    </Router>
  );
}

export default App;
