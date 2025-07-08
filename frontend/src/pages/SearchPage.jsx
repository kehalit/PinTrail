import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { fetchAllTrips } from "../api/trips";
import { useNavigate } from "react-router-dom";
import api from '../utils/api';


const UNSPLASH_BASE_URL = "https://api.unsplash.com/search/photos";
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;



const SearchPage = () => {
  const [trips, setTrips] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);

      const data = await fetchAllTrips();
      const publicTrips = data.filter(trip => trip.is_public === true);
      const tripsWithImages = await Promise.all(
        publicTrips.map(async (trip) => {
          const searchQuery = trip.city || trip.country || trip.title || "travel";
          const imageUrl = await fetchUnsplashImage(searchQuery);

          let username = "Unknown";
        try {
          const response = await api.get(`/users/${trip.user_id}`);
          if (response.status === 200) {
            username = response.data.username;
          }
        } catch (err) {
          console.error(`Failed to fetch user for trip ${trip.id}`, err);
        }
          return { ...trip, image_url: imageUrl , username,};
        })
      );

      setTrips(tripsWithImages);
    } catch (err) {
      console.error("Error fetching trips or images:", err);
    } finally {
      setLoading(false);
    }
  };


  const fetchUnsplashImage = async (query) => {
    try {
      const url = `${UNSPLASH_BASE_URL}?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`;
      const res = await fetch(url);
      const data = await res.json();
      return data.results[0]?.urls?.regular || "https://source.unsplash.com/featured/?travel";
    } catch (error) {
      console.error("Error fetching image from Unsplash:", error);
      return "https://source.unsplash.com/featured/?travel";
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const lower = query.toLowerCase();
    return (
      trip.title.toLowerCase().includes(lower) ||
      trip.city.toLowerCase().includes(lower) ||
      trip.country.toLowerCase().includes(lower)
    );
  });

  const handleSearch = useCallback(
    debounce((text) => {
      setQuery(text);
    }, 500),
    []
  );


  return (
    <div className="pt-28 px-4 min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Public Trips</h1>

      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search by title, city, or country"
          className="w-full max-w-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-3 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:bg-gray-900 text-black dark:text-white">Loading trips...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <motion.div
                key={trip.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    src={trip.image_url}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h2
                    className="font-bold text-2xl font-semibold mb-2 cursor-pointer hover:underline"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    {trip.title}
                  </h2>
                  <p className="text-gray-700 mb-1 dark:bg-gray-900 text-black dark:text-white">{trip.city}, {trip.country}</p>
                  <p className="text-gray-500 text-sm mb-3 dark:bg-gray-900 text-black dark:text-white">{trip.description}</p>
                  <p className="text-gray-600 text-sm dark:bg-gray-900 text-black dark:text-white">
                    <strong>{trip.start_date}</strong> → <strong>{trip.end_date}</strong>
                  </p>
                  <p className="text-gray-500 text-sm mb-3 dark:bg-gray-900 text-black dark:text-white">Shared by: {trip.username}</p>
                </div>
              </motion.div>

            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No trips found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
