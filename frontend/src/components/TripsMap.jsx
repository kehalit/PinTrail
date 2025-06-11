import React, { useContext, useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { AuthContext } from "../context/AuthContext";
import { Toaster, toast } from "react-hot-toast";

const TripsMap = ({ setTripForm, setSelectedLocation, refreshTrips, setRefreshTrips, setEditingTrip }) => {
  const [trips, setTrips] = useState([]);
  const { user } = useContext(AuthContext);
  const [localSelectedLocation, setLocalSelectedLocation] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const isDeleting = useRef(false); // Strict lock

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
        setEditingTrip(null); // Clear editing when adding new trip
        setTripForm(true);
      },
    });
    return null;
  };

  const handleDelete = async (e, tripId) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting.current) return; // Lock to prevent double clicks
    isDeleting.current = true;
    setDeletingId(tripId);

    try {
      const response = await fetch(`http://127.0.0.1:5000/trips/${tripId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Trip deleted successfully");
        // Delay refresh slightly to let popup fully close
        setTimeout(() => {
          setRefreshTrips(prev => !prev);
        }, 300);
      } else {
        toast.error("Error deleting trip");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setDeletingId(null);
      isDeleting.current = false;
    }
  };

  const handleEdit = (e, trip) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedLocation({ lat: trip.lat, lng: trip.lng });
    setEditingTrip(trip);
    setTripForm(true);
  };

  return (
    <div>
      
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

                  <div className="flex justify-center space-x-2 mt-2">
                    <button
                      onClick={(e) => handleEdit(e, trip)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, trip.id)}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                      disabled={deletingId === trip.id}
                    >
                      {deletingId === trip.id ? "Deleting..." : "Delete"}
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
                  setEditingTrip(null);
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
