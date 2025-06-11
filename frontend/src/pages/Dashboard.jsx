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

  return (
    <div>
     
      <Header popupOpen={popupOpen} />
      <TripsMap
        setTripForm={setTripFormOpen}
        setSelectedLocation={setSelectedLocation}
        refreshTrips={refreshTrips}
        setRefreshTrips={setRefreshTrips}
        setEditingTrip={setEditingTrip}
      />

      {tripFormOpen && selectedLocation ? (
        <TripForm
          location={selectedLocation}
          closeForm={() => {
            setTripFormOpen(false);
            setEditingTrip(null); // Clear after closing
          }}
          setRefreshTrips={setRefreshTrips}
          editingTrip={editingTrip} // Pass trip for editing
        />
      ) : null}

    </div>
  );
};

export default Dashboard;
