import React, { useState, useEffect } from "react";
import TripsMap from "../components/TripsMap";
import TripForm from "../components/TripForm";
import LocationSearch from "../components/LocationSearch";

const Dashboard = () => {

  const [tripFormOpen, setTripFormOpen] = useState(false);
  const [refreshTrips, setRefreshTrips] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [mapZoom, setMapZoom] = useState(3);
  const [localClickedLocation, setLocalClickedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);



  return (
    <div className="pt-30">

      {/* Location Search Input */}
      <div className="relative z-[1000] max-w-md mx-auto mt-4">
        <LocationSearch
          setMapCenter={setMapCenter}
          setSearchedLocation={setSelectedLocation}
          setLocationName={setLocationName}
          setMapZoom={setMapZoom} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
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

      {/* Map */}
      <div className="relative z-0">
        <TripsMap
          setTripForm={setTripFormOpen}
          setSelectedLocation={setSelectedLocation}
          refreshTrips={refreshTrips}
          setRefreshTrips={setRefreshTrips}
          setEditingTrip={setEditingTrip}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          selectedLocation={selectedLocation}
          locationName={locationName}
          showSearchPin={selectedLocation !== null && locationName !== ""}
          localClickedLocation={localClickedLocation}
          setLocalClickedLocation={setLocalClickedLocation}
          showDeleteModal ={showDeleteModal}
          setShowDeleteModal ={setShowDeleteModal}

        />
      </div> 
    </div>
  );
};

export default Dashboard;