import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    props.setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav>
      <div className="bg-slate-800 text-white">
        <div className="mycontainer flex justify-between h-14 px-4 py-5 items-center">

          {/* Logo */}
          <div className="logo font-bold text-2xl ml-[60px]">
            <span className="text-green-500">&lt;</span>
            <span>Pass</span>
            <span className="text-green-500">OP/&gt;</span>
          </div>

          {/* Center nav links if you want (currently only Home) */}
          <ul className="flex">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === "/" ? "text-green-500 font-bold" : ""}`} 
                to="/">
              </Link>
            </li>
          </ul>

          {/* Buttons section */}
          <div className="flex items-center space-x-4 mr-[60px]">
            {!localStorage.getItem('token') ? (
              <>
                <Link 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full font-semibold transition" 
                  to="/login"
                >Login
                </Link>
                <Link 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full font-semibold transition" 
                  to="/signup"
                >Signup
                </Link>
              </>
            ) : (
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full font-semibold transition"
                onClick={handleLogout}
              >Logout
              </button>
            )}

            {/* GitHub button */}
            <a
              href="https://github.com/your-repo-link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center bg-green-700 hover:bg-green-800 px-3 py-1 rounded-full font-semibold transition ring-white ring-1"
            >
              <lord-icon
                src="https://cdn.lordicon.com/esgpiyyb.json"
                trigger="hover"
                colors="primary:#ffffff"
                style={{ width: "25px", height: "25px" }}
              ></lord-icon>
              <span className="ml-1">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
