import React, { useState } from "react";
import TripsMap from "../components/TripsMap";
import Header from "../components/Header";
import TripForm from "../components/TripForm";

const Dashboard = () => {
  const [tripFormOpen, setTripFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);


  //console.log("tripFormOpen:", tripFormOpen);
  //console.log("selectedLocation:", selectedLocation);
  return (
    <div>
      <Header />
      <TripsMap
        setTripForm={setTripFormOpen}
        setSelectedLocation={setSelectedLocation}
        selectedLocation={selectedLocation}
      />

      {tripFormOpen && selectedLocation && (
        <TripForm
          location={selectedLocation}
          closeForm={() => setTripFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
