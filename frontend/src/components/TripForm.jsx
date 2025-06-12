import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

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

  const [errors, setErrors] = useState({});

  // Pre-fill form if editing
  useEffect(() => {
    if (editingTrip) {
      setFormData({
        ...editingTrip,
        user_id: user?.id,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        lat: location?.lat,
        lng: location?.lng,
        user_id: user?.id,
      }));
    }
  }, [editingTrip, location, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingTrip
        ? `http://127.0.0.1:5000/trips/${editingTrip.id}`
        : "http://127.0.0.1:5000/trips/add_trip";

      const method = editingTrip ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingTrip ? "Trip updated successfully!" : "Trip added successfully!");
        setRefreshTrips((prev) => !prev);
        closeForm();
      } else {
        console.error("Error saving trip:", data);
        toast.error(data?.error || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">{editingTrip ? "Edit Trip" : "Add a New Trip"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
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
              className="w-full border p-2 rounded"
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
              className="w-full border p-2 rounded"
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
                className="w-full border p-2 rounded"
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
                className="w-full border p-2 rounded"
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

          <div className="flex justify-end space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {editingTrip ? "Update Trip" : "Save Trip"}
            </button>
            <button
              onClick={closeForm}
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded"
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
