import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

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
  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 bg-blue-600 text-white text-center font-bold text-xl">
        Explore Continents
      </header>

      <div className="flex-grow relative">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={true}
          className="h-full w-full"
          zoomControl={false}
        >
          <ZoomControl position="topright" />

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {continentMarkers.map(continent => (
            <Marker key={continent.name} position={continent.position}>
              <Popup autoOpen={true} closeButton={false} autoClose={false}>
                <div className="text-center">
                  <h2 className="font-bold text-lg mb-1">{continent.name}</h2>
                  <p>{continent.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          <FitBounds markers={continentMarkers} />
        </MapContainer>

        <div className="absolute bottom-5 left-5 bg-white bg-opacity-90 rounded p-3 shadow-lg max-w-xs">
          <h3 className="font-semibold mb-2">Continents</h3>
          <ul className="list-disc list-inside text-sm">
            {continentMarkers.map(continent => (
              <li key={continent.name}>{continent.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
