import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { AuthContext } from "../context/AuthContext";
import { Toaster, toast } from "react-hot-toast";

const TripsMap = ({
  setTripForm,
  setSelectedLocation,
  refreshTrips,
  setRefreshTrips,
  setEditingTrip,
  searchQuery, // RECEIVE SEARCH QUERY
}) => {
  const [trips, setTrips] = useState([]);
  const { user } = useContext(AuthContext);
  const [localSelectedLocation, setLocalSelectedLocation] = useState(null);

  useEffect(() => {
    if (!user) return;

    fetch(`http://127.0.0.1:5000/trips/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((error) => console.error("Error fetching trips:", error));
  }, [user, refreshTrips]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
        setLocalSelectedLocation(newLocation);
        setSelectedLocation(newLocation);
        setTripForm(true);
      },
    });
    return null;
  };

  const handleDelete = async (tripId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/trips/delete_trip/${tripId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Trip deleted successfully");
        setRefreshTrips((prev) => !prev);
      } else {
        toast.error("Error deleting trip");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleEdit = (trip) => {
    setSelectedLocation({ lat: trip.lat, lng: trip.lng });
    setEditingTrip(trip);
    setTripForm(true);
  };

  //  FILTER TRIPS BASED ON SEARCH
  
  const filteredTrips = trips.filter((trip) =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      
      <MapContainer center={[40, -1]} zoom={3} style={{ height: "100vh", width: "100vw" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" noWrap={true} />
        <MapClickHandler />

        {/* USE FILTERED TRIPS */}
        {filteredTrips.map((trip) =>
          trip.lat && trip.lng ? (
            <Marker key={trip.id} position={[trip.lat, trip.lng]}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-blue-600">{trip.title}</h3>
                  <p>{trip.city}, {trip.country}</p>
                  <p>{trip.description}</p>
                  <p><strong>Start:</strong> {trip.start_date} | <strong>End:</strong> {trip.end_date}</p>

                  <div className="flex justify-center space-x-2 mt-2">
                    <button
                      onClick={() => handleEdit(trip)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(trip.id);
                      }}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
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
                  setSelectedLocation(localSelectedLocation);
                  setTripForm(true);
                }}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                Add Trip
              </button>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default TripsMap;
