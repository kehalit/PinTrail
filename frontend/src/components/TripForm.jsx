import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { createTrip, updateTrip } from "../api/trips";

const TripForm = ({ location, closeForm, setRefreshTrips, editingTrip }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    country: "",
    city: "",
    start_date: "",
    end_date: "",
    description: "",
    notes: "",
    is_public: true,
    lat: location?.lat,
    lng: location?.lng,
    user_id: user?.id,
  });
  // State to hold selected photo files
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    if (editingTrip) {
      setFormData({
        ...editingTrip,
        user_id: user?.id,
      });
      setPhotos([]); // optionally clear photos or fetch existing ones separately
    } else {
      setFormData((prev) => ({
        ...prev,
        lat: location?.lat,
        lng: location?.lng,
        user_id: user?.id,
      }));
      setPhotos([]);
    }
  }, [editingTrip, location, user]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
  };
  const handlePhotoChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  // Helper: upload photos individually linked to tripId
  const uploadPhotos = async (tripId) => {
    const uploadPromises = photos.map(async (photo) => {
        const photoData = new FormData();
        photoData.append("file", photo);
        photoData.append("caption", `Photo for trip ${tripId}`)

        const response = await fetch(`http://127.0.0.1:5000/photos/upload/${tripId}`, {
            method:"POST",
            body: photoData
        });

        if (!response.ok){
            const err = await response.json();
            throw new Error(`Failed to upload ${photo.name}`);
        }
        return response.json();
    });

    const results = await Promise.allSettled(uploadPromises);
    const failedUploads = results.filter((result) => result.status == 'rejected');


  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare trip data without photos
      const tripPayload = {
        title: formData.title,
        country: formData.country,
        city: formData.city,
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description,
        notes: formData.notes,
        is_public: formData.is_public,
        lat: formData.lat,
        lng: formData.lng,
        user_id: formData.user_id,
      };
      let trip;
      if (editingTrip) {
        // Update trip without photos first
        trip = await updateTrip(editingTrip.id, tripPayload);
        toast.success("Trip updated successfully!");
      } else {
        // Create trip without photos first
        trip = await createTrip(tripPayload);
        toast.success("Trip added successfully!");
      }
      // Upload photos separately only if there are any
      if (photos.length > 0) {
        await uploadPhotos(trip.id);
        toast.success("Photos uploaded successfully!");
      }
      setRefreshTrips((prev) => !prev);
      closeForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-white/10 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-black dark:text-white">
        <h2 className="text-lg font-bold mb-4">{editingTrip ? "Edit Trip" : "Add a New Trip"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows="3"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
            />
            <label>Public Trip</label>
          </div>
          {/* Photo upload input */}
          <div>
            <label className="block text-sm font-medium mb-1">Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full text-sm text-gray-700"
            />
            {photos.length > 0 && (
              <div className="flex space-x-2 mt-2 overflow-x-auto">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {editingTrip ? "Update Trip" : "Save Trip"}
            </button>
            <button
              onClick={closeForm}
              type="button"
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TripForm;