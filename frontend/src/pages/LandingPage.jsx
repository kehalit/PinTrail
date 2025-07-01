import { useRef, useEffect, useContext } from "react";
import HeroSection from "../components/HeroSection";
import PopularDestinations from "../components/PopularDestinations";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Footer from "../components/Footer";
import { ThemeContext } from "../context/ThemeContext";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const continentMarkers = [
  { name: "Africa", position: [1, 17], description: "The second largest continent." },
  { name: "Asia", position: [34, 100], description: "The largest continent." },
  { name: "Europe", position: [54, 15], description: "Home to many cultures." },
  { name: "North America", position: [40, -100], description: "Includes Canada, USA, Mexico." },
  { name: "South America", position: [-15, -60], description: "Known for Amazon rainforest." },
  { name: "Australia", position: [-25, 133], description: "The island continent." },
  { name: "Antarctica", position: [-82, 0], description: "The coldest continent." },
];

function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    const bounds = L.latLngBounds(markers.map(m => m.position));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, markers]);
  return null;
}

export default function LandingPage() {
  const mapSectionRef = useRef();
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  const { theme } = useContext(ThemeContext);

  const scrollToExplore = () => {
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex flex-col z-10 dark:bg-gray-900 text-black dark:text-white">
      {/* Map as full screen fixed background */}
      <MapContainer
        center={[40, -1]}
        zoom={3}
        scrollWheelZoom={false}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "70vh",
          width: "100%",
          zIndex: 0,
          filter: theme === "dark" ? "brightness(1)" : "brightness(0.6)", // darken map for overlay text contrast
        }}
      >
        <TileLayer
          url={
            theme === "dark"
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        {continentMarkers.map(continent => (
          <Marker key={continent.name} position={continent.position}>
            <Popup autoOpen={false} closeButton={true} autoClose={false}>
              <div className="text-center">
                <h2 className="font-bold text-lg mb-1">{continent.name}</h2>
                <p>{continent.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <FitBounds markers={continentMarkers} />
      </MapContainer>

      {/* HeroSection content over the map */}
      <div
        className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-white "
        style={{ minHeight: "70vh" }}
      >
        <HeroSection onStart={scrollToExplore} />
      </div>

      {/* Popular Destinations below */}
      <div ref={mapSectionRef} className="relative z-10 bg-white py-16 px-6 dark:bg-gray-900 text-black dark:text-white">
        <PopularDestinations accessKey={UNSPLASH_ACCESS_KEY} />
      </div>
      <Footer />
    </div>

  );
}