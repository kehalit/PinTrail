import React, { useState } from "react";
import TripsMap from "../components/TripsMap";
import Header from "../components/Header";
import TripForm from "../components/TripForm";

const Dashboard = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [tripFormOpen, setTripFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [refreshTrips, setRefreshTrips] = useState(false);

  return (
    <div>
      <Header popupOpen={popupOpen} />
      <TripsMap 
        setTripForm={setTripFormOpen} 
        setSelectedLocation={setSelectedLocation} 
        refreshTrips={refreshTrips} 
      />

      {tripFormOpen && selectedLocation ? (
        <TripForm 
          location={selectedLocation} 
          closeForm={() => setTripFormOpen(false)} 
          setRefreshTrips={setRefreshTrips} 
        />
      ) : null}
    </div>
  );
};

export default Dashboard;
