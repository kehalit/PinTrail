import React, { useState } from "react";

const AddTripForm = ({ latlng, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    country: "",
    start_date: "",
    end_date: "",
    description: "",
    notes:"",
    is_public: false,
    latitude: latlng?.lat || "",
    longitude: latlng?.lng || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-sm">
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full border p-1" />
      <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required className="w-full border p-1" />
      <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" required className="w-full border p-1" />
      <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full border p-1" />
      <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full border p-1" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-1" />
      <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="notes" className="w-full border p-1" />
      <label>
        <input type="checkbox" name="is_public" checked={formData.is_public} onChange={handleChange} /> Public
      </label>
      <div className="flex justify-between mt-2">
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Add Trip</button>
        <button type="button" onClick={onCancel} className="text-gray-600 underline">Cancel</button>
      </div>
    </form>
  );
};

export default AddTripForm;
