import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { createActivity, updateActivity } from "../api/activities";

const activityTypes = [
  "Adventure", "Cultural", "Leisure", "Nature", "Wildlife",
  "Sports", "Shopping", "Family", "Educational", "Nightlife", "Special Interest"
];


const ActivityForm = ({ location, closeForm, tripId, refreshActivities, existingActivity }) => {

  const [formData, setFormData] = useState({
    name: existingActivity ? existingActivity.name : "",
    location: existingActivity ? existingActivity.location : "",
    type: existingActivity ? existingActivity.type : "",
    notes: existingActivity ? existingActivity.notes : "",
    cost: existingActivity ? existingActivity.cost : null,
    rating: existingActivity ? existingActivity.rating : null,
    lat: existingActivity ? existingActivity.lat : location?.lat,
    lng: existingActivity ? existingActivity.lng : location?.lng,
    trip_id: existingActivity ? existingActivity.tripId : tripId
  });


  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["cost", "rating"].includes(name)
        ? value === "" ? null : Number(value)
        : value

    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (existingActivity) {

        await updateActivity(existingActivity.id, formData);
        toast.success("Activity updated successfully!");
      } else {

        await createActivity(formData);
        toast.success("Activity added successfully!");
      }
      await refreshActivities();
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
    <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-white/10 flex items-center justify-center z-[9999]
    ">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-lg font-bold mb-4">Add New Activity</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Activity Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"> Location Name</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Select an activity type</option>
              {activityTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="3"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cost ($)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating (0-10)</label>
              <input
                type="number"
                name="rating"
                min="0"
                max="10"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Coordinates Preview */}
          <div className="text-sm text-gray-500">
            {formData.lat && formData.lng
              ? `Selected Location: ${formData.lat.toFixed(4)}, ${formData.lng.toFixed(4)}`
              : 'No location selected'}
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