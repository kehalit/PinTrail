import api from "../utils/api";

// Get all activities
export async function fetchActivities() {
    const response = await api.get("/activities");
    return response.data;
}

// Get activities by trip ID
export async function getActivitiesByTripId(tripId) {
    const response = await api.get(`activities/trip/${tripId}`);
    return response.data;
}

// Get a single activity by ID
export async function fetchActivityById(activityId) {
    const response = await api.get(`/activities/${activityId}`);
    return response.data;
}

// Create a new activity
export async function createActivity(activityData) {
    const response = await api.post("/activities", activityData);
    return response.data;
}

// Update an existing activity
export async function updateActivity(activityId, updates) {
    const response = await api.put(`/activities/${activityId}`, updates);
    return response.data;
}

// Delete an activity
export async function deleteActivity(activityId) {
    const response = await api.delete(`/activities/${activityId}`);
    return response.data;
}
