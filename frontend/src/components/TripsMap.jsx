import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { fetchTripsByUserId, deleteTrip } from "../api/trips"; 

const TripsMap = ({
  setTripForm,
  refreshTrips,
  setRefreshTrips,
  setEditingTrip,
  mapCenter,
  selectedLocation,
  setSelectedLocation,
  locationName,
  mapZoom,
  showSearchPin,
  setSearchQuery,
  localClickedLocation,
  setLocalClickedLocation,
}) => {
  const [trips, setTrips] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    const loadTrips = async () => {
      try {
        const data = await fetchTripsByUserId(user.id);
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast.error("Failed to fetch trips.");
      }
    };

    loadTrips();
  }, [user, refreshTrips]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng, name: "Custom Location" };
        setLocalClickedLocation(newLocation);
        setSelectedLocation(newLocation);
        setTripForm(true);
      },
    });
    return null;
  };

  const ChangeMapView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
  };

  const handleDelete = async (tripId) => {
    try {
      await deleteTrip(tripId);
      toast.success("Trip deleted successfully");
      setRefreshTrips((prev) => !prev);
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Error deleting trip");
    }
  };

  const handleEdit = (trip) => {
    setSelectedLocation({ lat: trip.lat, lng: trip.lng, name: trip.title });
    setEditingTrip(trip);
    setTripForm(true);
  };

  return (
    <div>
      <MapContainer center={[40, -1]} zoom={3} style={{ height: "100vh", width: "100vw" }}>
        <ChangeMapView center={mapCenter} zoom={mapZoom} />
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

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <p>{locationName || selectedLocation.name || "Selected Location"}</p>
              <button
                onClick={() => setTripForm(true)}
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
