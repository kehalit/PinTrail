
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="h-[40vh] flex flex-col justify-center items-center text-white text-center p-8 z-20">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Track Your Travel Memories</h1>
      <p className="text-lg md:text-xl mb-6 max-w-2xl">
        You don’t need paper and pen just one login to track your memories from anywhere.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
          <button 
          onClick={() => {
            const isLoggedIn = localStorage.getItem("user"); 
            if (isLoggedIn) {
              navigate("/dashboard");
            } else {
              navigate("/register");
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-xl transition duration-300">
            Start Your Travel Journal
          </button>
          <button 
          onClick={() => navigate("/search")}
          className="bg-white hover:bg-gray-100 text-blue-600 text-lg px-6 py-3 rounded-xl transition duration-300">
            Explore Trips
          </button>
        </div>
    </section>
  );
}



