import api from '../utils/api';


// get user photos 
export const getUserPhotos = async (tripId) => {
  try {
    const response = await api.get(`/photos/trip/${tripId}`);
    return response.data; // should be an array of photo objects
  } catch (error) {
    console.error("Error fetching photos for trip:", error);
    return [];
  }
};

// Upload photo file(s) associated with a trip

export const uploadPhotos = async (tripId, photos) => {
  try {
    const uploadPromises = photos.map(async (photo) => {
      const formData = new FormData();
      formData.append('file', photo);
      formData.append('caption', `Photo for trip ${tripId}`);

      const response = await api.post(`/photos/upload/${tripId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    });

    const results = await Promise.allSettled(uploadPromises);

    const failedUploads = results.filter(r => r.status === 'rejected');
    if (failedUploads.length > 0) {
      console.error(`${failedUploads.length} photo(s) failed to upload`);
    }
    // Return all successful uploads
    return results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

  } catch (error) {
    console.error("Error uploading photos:", error);
    throw error;
  }
};



// Get all photos
export async function fetchAllPhotos() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch photos");
  return response.json();
}

// Get photos by trip ID
export async function fetchPhotosByTripId(tripId) {
  const response = await fetch(`${BASE_URL}/trip/${tripId}`);
  if (!response.ok) throw new Error("Failed to fetch photos for this trip");
  return response.json();
}

// Get a single photo by ID
export async function fetchPhotoById(photoId) {
  const response = await fetch(`${BASE_URL}/${photoId}`);
  if (!response.ok) throw new Error("Failed to fetch photo");
  return response.json();
}

// Create a new photo
export async function createPhoto(photoData) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(photoData),
  });
  if (!response.ok) throw new Error("Failed to create photo");
  return response.json();
}

// Update an existing photo
export async function updatePhoto(photoId, updates) {
  const response = await fetch(`${BASE_URL}/${photoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update photo");
  return response.json();
}

// Delete a photo
export async function deletePhoto(photoId) {
  const response = await fetch(`${BASE_URL}/${photoId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete photo");
  return response.json();
}
