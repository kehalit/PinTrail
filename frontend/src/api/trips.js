const BASE_URL = "http://127.0.0.1:5000/trips";

// Fetch all trips
export async function fetchAllTrips() {
    const response = await fetch(BASE_URL); 
    if (!response.ok) throw new Error("Failed to fetch trips");
    return response.json();
}

// Fetch trips by user ID
export async function fetchTripsByUserId(userId) {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch trips for user");
    return response.json();
}

// Fetch a single trip by ID
export async function fetchTripById(tripId) {
    const response = await fetch(`${BASE_URL}/${tripId}`);
    if (!response.ok) throw new Error("Trip not found");
    return response.json();
}

// Create a new trip
export async function createTrip(tripData) {
    const response = await fetch(`${BASE_URL}/add_trip`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
    });
    if (!response.ok) throw new Error("Failed to create trip");
    return response.json();
}

// Update an existing trip
export async function updateTrip(tripId, tripData) {
    const response = await fetch(`${BASE_URL}/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
    });
    if (!response.ok) throw new Error("Failed to update trip");
    return response.json();
}

// Delete a trip
export async function deleteTrip(tripId) {
    const response = await fetch(`${BASE_URL}/${tripId}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete trip");
    return response.json();
}
