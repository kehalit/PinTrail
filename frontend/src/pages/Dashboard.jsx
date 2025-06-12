import React, { useState } from "react";
import TripsMap from "../components/TripsMap";
import Header from "../components/Header";
import TripForm from "../components/TripForm";

const Dashboard = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [tripFormOpen, setTripFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [refreshTrips, setRefreshTrips] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // SEARCH QUERY STATE

  return (
    <div>
      <Header popupOpen={popupOpen} />

      {/* Search Input */}
      <div className="flex justify-center mt-4">
        <input
          type="text"
          placeholder="Search by title, city, or country"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-1/2 rounded"
        />
      </div>

      <TripsMap
        setTripForm={setTripFormOpen}
        setSelectedLocation={setSelectedLocation}
        refreshTrips={refreshTrips}
        setRefreshTrips={setRefreshTrips}
        setEditingTrip={setEditingTrip}
        searchQuery={searchQuery} // PASSING SEARCH QUERY
      />

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
