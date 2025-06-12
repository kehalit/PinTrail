import React, { useEffect, useState } from "react";

const SearchPage = () => {
  const [trips, setTrips] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/trips")
      .then((res) => res.json())
      .then((data) => {
        // ✅ Only keep trips that are public
        const publicTrips = data.filter((trip) => trip.is_public === true);
        setTrips(publicTrips);
      })
      .catch((err) => console.error("Error fetching trips:", err));
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const lower = query.toLowerCase();
    return (
      trip.title.toLowerCase().includes(lower) ||
      trip.city.toLowerCase().includes(lower) ||
      trip.country.toLowerCase().includes(lower)
    );
  });

  return (
    <div className="pt-34 px-2 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-center">Explore Public Trips</h1>
      
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by title, city, or country"
          className="w-full max-w-md border px-4 py-2 rounded shadow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <div key={trip.id} className="border p-4 rounded shadow bg-white">
              <h2 className="text-xl font-semibold mb-2">{trip.title}</h2>
              <p className="mb-1">{trip.city}, {trip.country}</p>
              <p className="mb-2">{trip.description}</p>
              <p className="text-gray-600">
                <strong>{trip.start_date}</strong> → <strong>{trip.end_date}</strong>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No trips found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
