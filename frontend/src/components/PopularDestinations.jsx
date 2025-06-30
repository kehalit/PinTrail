
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function PopularDestinations({ accessKey }) {
  const [destinations, setDestinations] = useState([]);

  const popularDestinations = [
    { name: "Paris", query: "Eiffel Tower" },
    { name: "New York", query: "Statue of Liberty" },
    { name: "Tokyo", query: "Tokyo Tower" },
    { name: "Rome", query: "Colosseum" },
    { name: "Sydney", query: "Sydney Opera House" },
    { name: "Cairo", query: "Pyramids" },
    { name: "Rio de Janeiro", query: "Christ the Redeemer" },
    { name: "London", query: "Big Ben" },
    { name: "Bangkok", query: "Grand Palace Bangkok" },
    { name: "Dubai", query: "Burj Khalifa" }
  ];

  useEffect(() => {
    const fetchDestinations = async () => {
        try {
          const results = await Promise.all(
            popularDestinations.map(async (dest) => {
              const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(dest.query)}&per_page=1&client_id=${accessKey}`
              );
              const data = await response.json();
      
              const image = data.results?.[0]?.urls?.regular || ""; 
      
              return {
                name: dest.name,
                image,
                description: `Explore the iconic ${dest.name}!`,
              };
            })
          );
      
          setDestinations(results);
        } catch (error) {
          console.error("Error fetching destinations:", error);
        }
      };
      

    fetchDestinations();
  }, [accessKey]);

  return (
    <section className=" py-16 bg-white text-gray-800 px-6 dark:bg-gray-900 text-black dark:text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">Popular Destinations</h2>

      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        loop={destinations.length > 3}
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        modules={[Autoplay]}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {destinations.map((dest, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src={dest.image} alt={dest.name} className="w-full h-60 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-xl mb-2">{dest.name}</h3>
                <p className="text-sm text-gray-600">{dest.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
