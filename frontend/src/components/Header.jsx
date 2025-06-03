import { Link, useNavigate } from "react-router-dom"
import React, { useState, useContext } from "react";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate("/login");
    };
  
    const isLoggedIn = !!user;
  
    return (
      <header className="fixed top-0 left-0 right-0 bg-white/40 backdrop-blur-md z-[1000] px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="h-20 w-auto" />
          <Link to="/search" className="hidden md:inline bg-gray-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            Explore
          </Link>
        </div>
  
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-gray-800 font-medium">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 font-medium hover:underline">Sign In</Link>
              <Link to="/register" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Create Your Memory
              </Link>
            </>
          )}
        </div>
  
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-800">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
  
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-md shadow-md py-4 flex flex-col items-center space-y-2 z-[999]">
            <Link to="/search" className="text-gray-700 hover:underline">Explore</Link>
            {isLoggedIn ? (
              <>
                <span className="text-gray-800 font-medium">Welcome, {user.username}</span>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:underline">Sign In</Link>
                <Link to="/register" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  Create Your Memory
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    );
  };
  
  export default Header;