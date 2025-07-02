import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import Mnager from './components/Mnager';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Alert from './components/Alert';

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type || "info",
    });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <Router>
        <Navbar setIsAuthenticated={setIsAuthenticated} />
        <Alert alert={alert} />
        <div className="absolute top-0 -z-10 h-full w-full bg-green-50">
          <div className="min-h-[91vh]">
            <Routes>
              <Route path="/login" element={<Login showAlert={showAlert} setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/signup" element={<Signup showAlert={showAlert} setIsAuthenticated={setIsAuthenticated} />} />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <>
                      <Mnager />
                      <Footer />
                    </>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
