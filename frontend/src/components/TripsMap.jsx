import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { AuthContext } from "../context/AuthContext";

const TripsMap = ({ setTripForm, setSelectedLocation, refreshTrips }) => {
  const [trips, setTrips] = useState([]);
  const { user } = useContext(AuthContext);
  const [localSelectedLocation, setLocalSelectedLocation] = useState(null);

  useEffect(() => {
    if (!user) return;

    fetch(`http://127.0.0.1:5000/trips/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((error) => console.error("Error fetching trips:", error));
  }, [user, refreshTrips]); // Added user as a dependency for better practice

  // Capture Clicks on the Map
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        //console.log("Map clicked at:", e.latlng);
        const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
        setLocalSelectedLocation(newLocation);
        setSelectedLocation(newLocation); // Pass to Dashboard
        setTripForm(true); // Show form
      },
    });
    return null;
  };

  return (
    <MapContainer center={[40, -1]} zoom={3} style={{ height: "100vh", width: "100vw" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" noWrap={true} />
      <MapClickHandler />

      {trips.map((trip) =>
        trip.lat && trip.lng ? (
          <Marker key={trip.id} position={[trip.lat, trip.lng]}>
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-blue-600">{trip.title}</h3>
                <p>{trip.city}, {trip.country}</p>
                <p>{trip.description}</p>
                <p><strong>Start:</strong> {trip.start_date} | <strong>End:</strong> {trip.end_date}</p>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}

      {localSelectedLocation && (
        <Marker position={[localSelectedLocation.lat, localSelectedLocation.lng]}>
          <Popup>
            <p>Click <strong>Add Trip</strong> to save this location!</p>
            <button
              onClick={() => {
                console.log("Add Trip clicked");
                // Ensure location is passed again
                setSelectedLocation(localSelectedLocation); // THIS IS IMPORTANT
                setTripForm(true); // Show form
              }}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              Add Trip
            </button>

          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default TripsMap;
