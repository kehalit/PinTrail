import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import TripCard from "../components/TripCard";
import AddTripForm from "../components/AddTripForm";


const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);


  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/trips/user/${user.id}`, {
          credentials: "include"  // send cookies with request
        });

        if (!res.ok) {
          throw new Error("Failed to fetch trips");
        }

        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTrips();
    }
  }, [user]);

  return (
    <div className="pt-50 px-10">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.username} 👋</h1>

      {/* Add Trip Button (Placeholder) */}
      <div className="mb-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add New Trip"}
        </button>
        {showForm && (
          <AddTripForm
            userId={user.id}
            onTripAdded={(newTrip) => {
              setTrips((prevTrips) => [...prevTrips, newTrip]);
              setShowForm(false);
            }}
          />
        )}
      </div>


      {loading ? (
        <p>Loading your trips...</p>
      ) : trips.length === 0 ? (
        <p>No trips found. Start by adding one!</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={(id) => setTrips((prev) => prev.filter((t) => t.id !== id))}
              onUpdate={(updatedTrip) =>
                setTrips((prev) =>
                  prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
                )
              }
            />
          ))}

        </div>
      )}
    </div>
  );
};

export default DashboardPage;
