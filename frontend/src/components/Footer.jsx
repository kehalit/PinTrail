import { Link } from "react-router-dom";

export default function Footer() {
  
    return (
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Travel PinTrail. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
             <Link to="/">Home</Link>
             <Link to="/search">Explore</Link>
            
          </div>
        </div>
      </footer>
    );
  }
  