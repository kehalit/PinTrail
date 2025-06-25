import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sayings = [
  "Keep your travel memories forever",
  "Explore travels like never before",
  "You don’t need paper and pen just one login to track your memories",
  "Capture, relive, and share your adventures in one place",
  "Your personal travel journal, accessible anywhere",
];


const UNSPLASH_BASE_URL = "https://api.unsplash.com/search/photos";
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function UnsplashGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(
          `${UNSPLASH_BASE_URL}?query=travel,destination&per_page=6&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        const data = await res.json();
        setImages(data.results || []);
      } catch (error) {
        console.error("Error fetching Unsplash images:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  if (loading) return <p className="text-black mt-5">Loading images...</p>;

  return (
    <div className="mt-10 grid grid-cols-3 md:grid-cols-3 gap-3 max-w-8xl mx-auto">
      {images.map((img) => (
        <motion.img
          key={img.id}
          src={img.urls.small}
          alt={img.alt_description || "Travel destination"}
          className="rounded-lg shadow-lg cursor-pointer object-cover w-full h-64"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          loading="lazy"
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [sayIndex, setSayIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return;
    const interval = setInterval(() => {
      setSayIndex((prev) => (prev + 1) % sayings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [started]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black-1000 to-blue-100 text-black">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-24 text-center relative">
        <AnimatePresence mode="wait">
          <motion.h1
            key={sayings[sayIndex]}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold max-w-3xl mb-6"
          >
            {sayings[sayIndex]}
          </motion.h1>
        </AnimatePresence>

        {/* Unsplash images below the sayings */}
        <UnsplashGallery />

        <motion.button
          onClick={() => setStarted(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 bg-white text-blue-700 font-bold rounded-full px-8 py-4 shadow-lg uppercase tracking-wide"
        >
          Start Your Journey
        </motion.button>
      </div>

      {/* You can add Features or other sections here */}
    </div>
  );
}
