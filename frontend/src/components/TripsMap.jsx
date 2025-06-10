import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { AuthContext } from "../context/AuthContext"; 

const TripsMap = () => {
  const [trips, setTrips] = useState([]);
  const {user} = useContext(AuthContext);


  useEffect(() => {
    fetch(`http://127.0.0.1:5000/trips/user/${user.id}`)  
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((error) => console.error("Error fetching trips:", error));
  }, []);

   return (
        <MapContainer center={[40, 1, -1]} zoom={3} style={{ height: "100vh", width: "100vw" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            noWrap= {true}/>
            {trips.map((trip) =>
                trip.lat && trip.lng ? (
                    <Marker key={trip.id} position={[trip.lat, trip.lng]}>
                        <Popup onOpen={() => setPopupOpen(true)} onClose={() => setPopupOpen(false)}>
                            <div className="text-center">
                                <h3 className="font-bold text-blue-600">{trip.title}</h3>
                                <p>{trip.city}, {trip.country}</p>
                                <p>{trip.description}</p>
                                <p><strong>Start:</strong> {trip.start_date} | <strong>End:</strong> {trip.end_date}</p>
                            </div>
                        </Popup>
                    </Marker>
                ) : null
            )}
        </MapContainer>
    );
};

export default TripsMap;