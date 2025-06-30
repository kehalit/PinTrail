import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";


const Header = ({ popupOpen }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [scrolling, setScrolling] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Detect Scroll and Hide Header
    useEffect(() => {
        const handleScroll = () => {
            setScrolling(window.scrollY > 50); // Hide header after 50px of scrolling
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 text-black dark:text-white shadow z-50 backdrop-blur-md z-[1000] px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm transition-transform duration-500 ${scrolling || popupOpen ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
                }`}
        >
            {/* Logo & Explore */}
            <div className="flex items-center space-x-4">
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="h-20 w-auto" />
                </Link>
                <Link
                    to="/search"
                    className="hidden md:inline bg-gray-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                    Explore
                </Link>
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-4">
                <button onClick={toggleTheme}>
                    {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
                {!user ? (
                    <>
                        <Link to="/login" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Register
                        </Link>
                    </>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <Link to="/dashboard" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                <span>{user.username}</span>
                            </Link>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-800">
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-md shadow-md py-4 flex flex-col items-center space-y-2 z-[999]">
                    {!user ? (
                        <>
                            <Link to="/login" className="text-gray-700 hover:underline">
                                Sign In
                            </Link>
                            <Link to="/register" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="text-gray-700">Hello, {user.username}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;