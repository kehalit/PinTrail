import React, { useState } from "react";

const TripCard = ({ trip, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...trip });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/trips/${trip.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update");

      const updatedTrip = await res.json();
      onUpdate(updatedTrip);
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/trips/${trip.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      onDelete(trip.id);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 bg-yellow-50 shadow">
        <input name="title" value={form.title} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <input name="city" value={form.city} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <input name="country" value={form.country} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <div className="flex justify-between">
          <button onClick={handleUpdate} className="text-green-600 hover:underline">Save</button>
          <button onClick={() => setIsEditing(false)} className="text-gray-600 hover:underline">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-semibold">{trip.title}</h2>
      <p className="text-gray-600">{trip.city}, {trip.country}</p>
      <p className="text-sm text-gray-500">
        {trip.start_date} — {trip.end_date}
      </p>
      
      {trip.description && (
        <p className="mt-2 text-gray-700"><strong>Description:</strong> {trip.description}</p>
      )}
      {trip.notes && (
        <p className="mt-2 text-gray-700"><strong>Notes:</strong> {trip.notes}</p>
      )}
  
      <div className="mt-4 flex justify-between">
        <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:underline">Edit</button>
        <button onClick={handleDelete} className="text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  );
};

export default TripCard;
