
const BASE_URL = "http://127.0.0.1:5000/activities";

// Get all activities
export async function fetchActivities() {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch activities");
    return response.json();
}

// Get  activities activities by trip ID
export async function getActivitiesByTripId(tripId) {
    const response = await fetch(`${BASE_URL}/trip/${tripId}`);
    if (!response.ok) throw new Error("Failed to fetch activities for this trip");
    return response.json();
}


// Get a single activity by ID
export async function fetchActivityById(activityId) {
    const response = await fetch(`${BASE_URL}/${activityId}`);
    if (!response.ok) throw new Error("Failed to fetch activity");
    return response.json();
}

// Create a new activity
export async function createActivity(activityData) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
    });
    if (!response.ok) throw new Error("Failed to create activity");
    return response.json();
}

// Update an existing activity
export async function updateActivity(activityId, updates) {
    const response = await fetch(`${BASE_URL}/${activityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update activity");
    return response.json();
}

// Delete an activity
export async function deleteActivity(activityId) {
    const response = await fetch(`${BASE_URL}/${activityId}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete activity");
    return response.json();
}


