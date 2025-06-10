import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const TripForm = ({ location, closeForm }) => {
    const { user } = useContext(AuthContext); // ✅ Get user_id from context

    const [formData, setFormData] = useState({
        title: "",
        country: "",
        city: "",
        start_date: "",
        end_date: "",
        description: "",
        notes: "",
        is_public: true, // ✅ Default to public
        lat: location?.lat,
        lng: location?.lng,
        user_id: user?.id, // ✅ Pass user_id
    });

    useEffect(() => {
        //console.log("TripForm is rendering with location:", location);
        // Ensure location and user_id are updated when form reopens
        setFormData((prevData) => ({
            ...prevData,
            lat: location?.lat,
            lng: location?.lng,
            user_id: user?.id,
        }));
    }, [location, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            ...formData,
            user_id: user.id,  // REQUIRED FIELD
        };
        //console.log("Submitting form data:", dataToSend);
        try {

            const response = await fetch("http://127.0.0.1:5000/trips/add_trip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                alert("Trip added successfully!");
                closeForm();
            } else {
                const errorData = await response.json();
                console.error("Error adding trip:", errorData);
                alert("Error adding trip: " + JSON.stringify(errorData));
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error: " + err.message);
        }
  };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-bold mb-4">Add a New Trip</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <input type="text" placeholder="Trip Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    <input type="text" placeholder="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required />
                    <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                    <input type="date" placeholder="Start Date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
                    <input type="date" placeholder="End Date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required />
                    <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    <textarea placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                    <label className="flex items-center">
                        <input type="checkbox" checked={formData.is_public} onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })} />
                        <span className="ml-2">Public Trip</span>
                    </label>
                    <button type="submit" className="mt-3 px-4 py-2 bg-blue-500 text-white rounded">Save Trip</button>
                    <button type="button" onClick={closeForm} className="mt-3 px-4 py-2 bg-red-500 text-white rounded">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default TripForm;
