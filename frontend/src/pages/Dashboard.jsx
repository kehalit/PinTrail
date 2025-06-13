import React, { useState } from "react";
import TripsMap from "../components/TripsMap";
import TripForm from "../components/TripForm";
import LocationSearch from "../components/LocationSearch";

const Dashboard = () => {

  const [tripFormOpen, setTripFormOpen] = useState(false);
  const [refreshTrips, setRefreshTrips] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [mapCenter, setMapCenter] = useState([40, -1]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [mapZoom, setMapZoom] = useState(12);



  return (
    <div className="pt-30">

      {/* Location Search Input */}
      <div className="relative z-[1000] max-w-md mx-auto mt-4">
        <LocationSearch
          setMapCenter={setMapCenter}
          setSearchedLocation={setSelectedLocation}
          setLocationName={setLocationName}

        />
      </div>

      {/* Map */}
      <div className="relative z-0">
       <TripsMap
        setTripForm={setTripFormOpen}
        setSelectedLocation={setSelectedLocation}  
        refreshTrips={refreshTrips}
        setRefreshTrips={setRefreshTrips}
        setEditingTrip={setEditingTrip}
        mapCenter={mapCenter}
        selectedLocation={selectedLocation}
        locationName={locationName}

      />
      </div>

      {/* Trip Form */}
      {tripFormOpen && selectedLocation ? (
        <TripForm
          location={selectedLocation}
          closeForm={() => {
            setTripFormOpen(false);
            setEditingTrip(null);
          }}
          setRefreshTrips={setRefreshTrips}
          editingTrip={editingTrip}
        />
      ) : null}
    </div>
  );
};

export default Dashboard;
