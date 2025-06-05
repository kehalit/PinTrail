// src/components/TripCard.jsx
import React, { useState } from "react";

const TripCard = ({ trip, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Copy only the fields your backend handles:
  const [formData, setFormData] = useState({
    title: trip.title || "",
    country: trip.country || "",
    city: trip.city || "",
    start_date: trip.start_date || "",
    end_date: trip.end_date || "",
    description: trip.description || "",
    notes: trip.notes || "",
    is_public: trip.is_public || false,
  });

  // Update form fields as the user types:
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Send PUT to /trips/:id
  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/trips/${trip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // or your auth header if using JWT
      });

      if (!res.ok) {
        // Log the response JSON to see any validation errors:
        const err = await res.json();
        console.error("PUT /trips error", err);
        return;
      }

      const updatedTrip = await res.json();
      onUpdate(updatedTrip); // Tell DashboardPage to replace this trip
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 bg-yellow-50 shadow">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full mb-2"
        />
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="border p-2 w-full mb-2"
        />
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="border p-2 w-full mb-2"
        />
        <input
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          name="end_date"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full mb-2"
        />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="border p-2 w-full mb-2"
        />
        <label className="flex items-center mb-2">
          <input
            name="is_public"
            type="checkbox"
            checked={formData.is_public}
            onChange={handleChange}
            className="mr-2"
          />
          Public
        </label>

        <div className="flex justify-between">
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-semibold">{trip.title}</h2>
      <p className="text-gray-600">
        {trip.city}, {trip.country}
      </p>
      <p className="text-sm text-gray-500">
        {trip.start_date} — {trip.end_date}
      </p>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(trip.id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TripCard;
