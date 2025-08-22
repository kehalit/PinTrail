import api from "../utils/api";

// Fetch all trips
export async function fetchAllTrips() {
  const response = await api.get("/trips");
  return response.data;
}

// Fetch trips by user ID
export async function fetchTripsByUserId(userId) {
   
    const response = await api.get(`/trips/user/${userId}`);
    
    if (!response.status === 200) throw new Error("Failed to fetch trips for user");
    return response.data;
}

// Fetch a single trip by ID
export async function fetchTripById(tripId) {
  const response = await api.get(`/trips/${tripId}`);
  return response.data;
}

// Create a new trip
export async function createTrip(tripData) {
  const response = await api.post("/trips/add_trip", tripData);
  return response.data;
}

// Update an existing trip
export async function updateTrip(tripId, tripData) {
  const response = await api.put(`/trips/${tripId}`, tripData);
  return response.data;
}

// Delete a trip
export async function deleteTrip(tripId) {
  const response = await api.delete(`/trips/${tripId}`);
  return response.data;
}
