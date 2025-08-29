import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TripPopupCard = ({ trip, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25 }}
        className="relative w-64 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-start"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Title */}
        <h3
          className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate mb-1 cursor-pointer hover:underline"
          onClick={() => navigate(`/trips/${trip.id}`)}
        >
          {trip.title}
        </h3>

        {/* Location */}
        {(trip.city || trip.country) && (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {trip.city}{trip.city && trip.country ? ", " : ""}{trip.country}
          </p>
        )}

        {/* Trip Dates */}
        {trip.start_date && trip.end_date && (
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-2">
            {trip.start_date} → {trip.end_date}
          </p>
        )}

        {/* Photo Carousel */}
        {trip.photos && trip.photos.length > 0 && (
          <Swiper
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            className="w-full h-32 rounded-lg overflow-hidden mb-2"
          >
            {trip.photos.map((photo) => (
              <SwiperSlide key={photo.id}>
                <img
                  src={photo.url}
                  alt={photo.caption || "Trip photo"}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Description */}
        {trip.description && (
          <p className="text-sm font-normal text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
            {trip.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-2 w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
            onClick={() => onEdit(trip)}
          >
            ✏️ Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
            onClick={() => onDelete(trip.id)}
          >
            🗑 Delete
          </motion.button>
        </div>

        {/* Optional Hover Badge */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 right-2 bg-indigo-500 text-white px-2 py-1 text-xs rounded-full shadow"
          >
            New Trip!
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default TripPopupCard;
