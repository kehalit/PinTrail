import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchTripById } from "../api/trips";
import { getActivitiesByTripId } from "../api/activities";

const TripDetailsPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    async function fetchTripDetails() {
      try {
        setLoading(true);
        const tripData = await fetchTripById(tripId);
        console.log("Fetched trip data:", tripData);
        const activitiesData = await getActivitiesByTripId(tripId);
        console.log("Fetched activities:", activitiesData);
        setTrip(tripData);
        setActivities(activitiesData);
      } catch (err) {
        console.error(err);
        setError("Failed to load trip details.");
      } finally {
        setLoading(false);
      }
    }
    fetchTripDetails();
  }, [tripId]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!trip) return <div className="p-6 text-center">Trip not found.</div>;

  const { city, country, description } = trip;

  // Fallback to the first activity with coordinates
  const firstActivityWithCoordinates = activities.find(
    (act) => act.lat && act.lng
  );

  // Set map center: use activity, or fallback to a default (trip location)
  const mapCenter = firstActivityWithCoordinates
    ? [firstActivityWithCoordinates.lat, firstActivityWithCoordinates.lng]
    : [trip.lat, trip.lng]; // Default to trip location

  return (

    <div className="max-w-6xl mx-auto p-30 flex flex-col md:flex-row gap-6">
     
      {/* Left: Trip Details + Activities */}
      <div className="md:w-1/3  bg-white rounded-lg shadow-md p-10 overflow-y-auto max-h-[80vh]">
        <h1 className="text-2xl font-bold mb-4">{city}, {country}</h1>
        <p className="mb-4 text-gray-700">{description}</p>
        <h2 className="text-xl font-semibold mb-2">Activities</h2>
        {activities.length === 0 ? (
          <p className="text-gray-500">No activities found for this trip.</p>
        ) : (
          <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
            {activities.map((activity) => (
              <li key={activity.id} className="border border-gray-200 rounded p-3">
                <h3 className="font-semibold">{activity.name}</h3>
                <p className="text-sm text-gray-600">{activity.location}</p>
                <p className="text-sm text-gray-600">{activity.type}</p>
                {activity.notes && <p className="text-sm text-gray-500 italic">Notes: {activity.notes}</p>}
                {activity.cost !== undefined && <p className="text-sm text-gray-600">Cost: ${activity.cost}</p>}
                {activity.rating !== undefined && <p className="text-sm text-yellow-500">Rating: {activity.rating}</p>}
              </li>
            ))}
          </ul>
        )}
        
      </div>

      {/* Right: Map */}
      <div className="md:w-2/3 h-[80vh] rounded-lg overflow-hidden shadow-md">
        {activities.length === 0 && (
          <div className="p-4 text-center text-gray-500">No activity locations to display on map.</div>
        )}
        <MapContainer center={mapCenter} zoom={10} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {firstActivityWithCoordinates && (
            <Marker position={mapCenter}>
              <Popup>First activity location</Popup>
            </Marker>
          )}
          {activities.map((act) =>
            act.lat && act.lng ? (
              <Marker key={act.id} position={[act.lat, act.lng]}>
                <Popup>{act.name}</Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default TripDetailsPage;
