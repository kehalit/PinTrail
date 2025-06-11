import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from 'react-hot-toast';

const TripForm = ({ location, closeForm, setRefreshTrips }) => {
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

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            lat: location?.lat,
            lng: location?.lng,
            user_id: user?.id,
        }));
    }, [location, user]);

    // Validate a single field and date validation

    const validateField = (name, value) => {
        let error = "";

        if (["title", "country", "city"].includes(name) && !value.trim()) {
            error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }

        if ((name === "start_date" || name === "end_date") && !value) {
            error = `${name.replace("_", " ").toUpperCase()} is required`;
        }

        if (name === "end_date" && formData.start_date && value < formData.start_date) {
            error = "End date cannot be before start date";
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));

        const error = validateField(name, fieldValue);

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));

        // Real-time cross-field check
        if (name === "start_date" && formData.end_date && value > formData.end_date) {
            setErrors((prev) => ({
                ...prev,
                end_date: "End date cannot be before start date",
            }));
        }

        if (name === "start_date" && formData.end_date && value <= formData.end_date) {
            setErrors((prev) => ({
                ...prev,
                end_date: "",
            }));
        }

        if (name === "end_date" && formData.start_date && formData.start_date <= value) {
            setErrors((prev) => ({
                ...prev,
                end_date: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        ["title", "country", "city", "start_date", "end_date"].forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });

        // Final end date check
        if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
            newErrors.end_date = "End date cannot be before start date";
        }

        return newErrors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.values(validationErrors).some((msg) => msg)) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/trips/add_trip", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });
          
            const data = await response.json();
          
            if (response.ok) {
              toast.success("Trip added successfully!");
              setRefreshTrips((prev) => !prev);
              closeForm();
            } else {
              console.error("Error adding trip:", data);
              toast.error(`Error adding trip: ${data?.error || "Unknown error"}`);
            }
          } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An unexpected error occurred.");
          }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-bold mb-4">Add a New Trip</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="title"
                            placeholder="Trip Title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                        {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                    </div>

                    <div>
                        <label className="block">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                        {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
                    </div>

                    <div>
                        <label className="block">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                        {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
                    </div>

                    <div>
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <textarea
                            name="notes"
                            placeholder="Notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <label className="block mt-2">
                        <input
                            type="checkbox"
                            name="is_public"
                            checked={formData.is_public}
                            onChange={handleChange}
                        />
                        <span className="ml-2">Public Trip</span>
                    </label>

                    <div className="flex justify-end space-x-2">
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save Trip</button>
                        <button onClick={closeForm} type="button" className="px-4 py-2 bg-red-500 text-white rounded">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TripForm;
