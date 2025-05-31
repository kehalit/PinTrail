import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/40 backdrop-blur-md z-[1000] px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
            {/* Left: Logo + Button */}
            <div className="flex items-center space-x-4">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                <button className="hidden md:inline bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Explore
                </button>
            </div>

            {/* Right: Buttons */}
            <div className="hidden md:flex space-x-4">
                <button className="text-blue-700 font-medium hover:underline">Sign In</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Create Your Memory
                </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-blue-800"
            >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-md shadow-md py-4 flex flex-col items-center space-y-2 z-[999]">
                    <button className="text-blue-700 hover:underline">Sign In</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Register
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
