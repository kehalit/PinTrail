import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchTripById } from "../api/trips";
import { getActivitiesByTripId } from "../api/activities";
import LocationSearch from "../components/LocationSearch";
import MapController from "../components/MapController";
import ActivityForm from "../components/ActivityForm";


const TripDetailsPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mapCenter, setMapCenter] = useState([39.6953, 3.0176]);
  const [mapZoom, setMapZoom] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [locationName, setLocationName] = useState("");

  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityLocation, setActivityLocation] = useState(null);

  const [loadingActivities, setLoadingActivities] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);


  const activityRefs = useRef({});

  const refreshActivities = async () => {
    try {
      const activitiesData = await getActivitiesByTripId(tripId);
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error refreshing activities:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const activitiesData = await getActivitiesForTrip(tripId);
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };


  useEffect(() => {
    async function fetchTripDetails() {
      try {
        setLoading(true);
        const tripData = await fetchTripById(tripId);
        const activitiesData = await getActivitiesByTripId(tripId);

        setTrip(tripData);
        setActivities(activitiesData);

        // Set initial map center
        const firstActivityWithCoordinates = activitiesData.find(
          (act) => act.lat && act.lng
        );

        if (firstActivityWithCoordinates) {
          setMapCenter([firstActivityWithCoordinates.lat, firstActivityWithCoordinates.lng]);
        } else if (tripData.lat && tripData.lng) {
          setMapCenter([tripData.lat, tripData.lng]);
        }
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

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng, name: "Custom Location" };
        setActivityLocation(newLocation);
        setShowActivityForm(true);
      },
    });
    return null;
  };

  const handleActivitySelect = (activityId) => {
    setSelectedActivityId(activityId);
  
    const activityElement = activityRefs.current[activityId];
    if (activityElement) {
      activityElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-6">
      {/* Left: Trip Details + Activities */}
      <div className="md:w-1/3 bg-white rounded-lg shadow-md p-20 overflow-y-auto max-h-[80vh]">
        <h1 className="text-2xl font-bold mb-4">{city}, {country}</h1>
        <p className="mb-4 text-gray-700">{description}</p>

        <h2 className="text-xl font-semibold mb-2">Activities</h2>
        {activities.length === 0 ? (
          <p className="text-gray-500">No activities found for this trip.</p>
        ) : (
          <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
            {activities.map((activity) => (
              <li key={activity.id}
                ref={(el) => (activityRefs.current[activity.id] = el)}
                className={`border border-gray-200 rounded p-3 ${selectedActivityId === activity.id ? "bg-yellow-100" : ""
                  }`}>
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
      <div className="md:w-2/3 h-[80vh] rounded-lg overflow-hidden shadow-md relative">
        {/* Location Search on top of map */}
        <div className="absolute top-4 left-4 right-4 z-[1000]">
          <LocationSearch
            setMapCenter={setMapCenter}
            setSearchedLocation={setSearchedLocation}
            setLocationName={setLocationName}
            setMapZoom={setMapZoom}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        {searchedLocation && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={() => setShowActivityForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded shadow"
            >
              Add Activity Here
            </button>
          </div>
        )}


        {activities.length === 0 && (
          <div className="p-4 text-center text-gray-500">No activity locations to display on map.</div>
        )}

        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "80vh", width: "100%" }} >
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler />

          {activities.map((act) =>
            act.lat && act.lng ? (
              <Marker key={act.id} position={[act.lat, act.lng]}>
                <Popup>
                  <div className="text-center">
                    <h3
                      className="font-bold text-blue-600 cursor-pointer hover:underline"
                      onClick={() => handleActivitySelect(act.id)}
                    >
                      {act.name}
                    </h3>
                    <p>{act.location}, {act.type}</p>
                    <p>Rating: {act.rating}</p>

                    <div className="flex justify-center space-x-2 mt-2">
                      <button
                        onClick={() => handleEdit(trip)}
                        className="mt-2 px-3 py-2 bg-yellow-500 text-white rounded">
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(trip.id);
                        }}
                        className="mt-2 px-3 py-2 bg-red-500 text-white rounded">
                        Delete
                      </button>
                    </div>
                  </div>
                </Popup>

              </Marker>
            ) : null
          )}

          {searchedLocation && (
            <Marker position={[searchedLocation.lat, searchedLocation.lng]}>
              <Popup>
                <div>{locationName || "Selected Location"}</div>
                <button
                  onClick={() => {
                    setActivityLocation({ lat: searchedLocation.lat, lng: searchedLocation.lng });
                    setShowActivityForm(true);
                  }}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                >
                  add Activity
                </button>

              </Popup>
            </Marker>
          )}

        </MapContainer>

      </div>
      {/* Activity Form Modal */}
      {showActivityForm && (
        <ActivityForm
          location={activityLocation}
          closeForm={() => {
            setShowActivityForm(false);
            setActivityLocation(null);
          }}
          tripId={trip.id}
          refreshActivities={refreshActivities}
          loading={loading}

        />
      )}
    </div>
  );
};

export default TripDetailsPage;
