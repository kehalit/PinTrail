import React, { useState } from "react";

import { toast } from "react-hot-toast";
import { createActivity } from "../api/activities";

const ActivityForm = ({ location, closeForm, tripId, refreshActivities }) => {

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "",
    notes: "",
    cost: "",
    rating: "",
    lat: location?.lat || 0,
    lng: location?.lng || 0,
    trip_id: tripId,
  });

  const [loading, setLoading] = useState(false);
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cost" || name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

  
    try {
      await createActivity(formData);
      toast.success("Activity added successfully!");
      refreshActivities();
      closeForm();
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error("Failed to add activity.");
    }
    finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-md backdrop-brightness-75 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Add New Activity</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Activity Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Location Name</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
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

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Cost ($)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium">Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Coordinates Preview */}
          <div className="text-sm text-gray-500">
            Selected Location: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
          </div>

          <div className="flex justify-end space-x-2">
            <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded">
              {loading ? "Adding..." : "Save Activity"}
            </button>
            <button
              type="button"
              onClick={closeForm}
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

export default ActivityForm;
