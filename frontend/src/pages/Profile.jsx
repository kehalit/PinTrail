import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { fetchTripsByUserId } from "../api/trips";
import { getActivitiesByTripId } from "../api/activities";

import { FaSuitcaseRolling, FaTasks, FaHeart, FaRunning } from "react-icons/fa";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [activitiesByTrip, setActivitiesByTrip] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Derived values (must be before conditional returns)
  const totalTrips = trips.length;
  const totalActivities = Object.values(activitiesByTrip).reduce(
    (acc, activities) => acc + activities.length,
    0
  );

  const mostLikedTrip =
    trips.reduce((max, trip) => (trip.likes > (max?.likes || 0) ? trip : max), null) || {};

  const tripActivityCounts = trips.map((trip) => ({
    trip,
    count: activitiesByTrip[trip.id]?.length || 0,
  }));

  const mostActiveTripData =
    tripActivityCounts.reduce(
      (max, t) => (t.count > (max?.count || 0) ? t : max),
      null
    ) || {};
  const mostActiveTrip = mostActiveTripData.trip || {};

  // Fetch trips and activities
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const userTrips = await fetchTripsByUserId(user.id);
        setTrips(userTrips);

        const activitiesPromises = userTrips.map((trip) =>
          getActivitiesByTripId(trip.id)
        );
        const activitiesResults = await Promise.all(activitiesPromises);

        const activitiesMap = {};
        userTrips.forEach((trip, i) => {
          activitiesMap[trip.id] = activitiesResults[i];
        });
        setActivitiesByTrip(activitiesMap);
      } catch (err) {
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Conditional rendering (after all hooks)
  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-32 space-y-12">
      {/* User Info */}
      <section className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 flex flex-col sm:flex-row items-center gap-8">
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white text-5xl font-extrabold flex items-center justify-center select-none cursor-default">
          {user.username[0].toUpperCase()}
          {/* Placeholder for future avatar upload */}
          <div
            className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Upload Avatar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-4.553a2 2 0 10-2.828-2.828L12 7.172 8.636 3.808a2 2 0 00-2.828 2.828L10 10m-1 4v5m0 0h5m-5 0H6"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-4xl font-bold tracking-wide">{user.username}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
          <p className="mt-4 max-w-lg text-gray-700 dark:text-gray-300 italic select-text">
            “Adventurer, traveler and lifelong learner.”
          </p>
          <p className="mt-2 text-sm text-gray-400">
          Joined on: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
          </p>

        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Trips"
          value={totalTrips}
          icon={<FaSuitcaseRolling className="text-blue-600" />}
          color="text-blue-600"
          tooltip="Total number of trips you've created"
        />
        <StatCard
          title="Total Activities"
          value={totalActivities}
          icon={<FaTasks className="text-green-600" />}
          color="text-green-600"
          tooltip="Total activities across all your trips"
        />
        <StatCard
          title="Most Liked Trip"
          value={mostLikedTrip.title || "N/A"}
          subtitle={`${mostLikedTrip.likes || 0} likes`}
          icon={<FaHeart className="text-red-600" />}
          tooltip="Trip with the highest likes"
        />
        <StatCard
          title="Most Active Trip"
          value={mostActiveTrip.title || "N/A"}
          subtitle={`${mostActiveTripData.count || 0} activities`}
          icon={<FaRunning className="text-purple-600" />}
          tooltip="Trip with the most activities"
        />
      </section>

      {/* Recent Trips */}
      <section>
        <h3 className="text-2xl font-semibold mb-6">Recent Trips</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {trips.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400">
              No trips yet. Start by creating your first adventure!
            </p>
            <a
            href="/dashboard"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Add Trip
          </a>
          </div>
          ) : (
            trips
              .slice(-3)
              .reverse()
              .map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  title={`View details for ${trip.title}`}
                >
                  <h4 className="text-xl font-semibold mb-1">{trip.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Location: {trip.location}
                  </p>
                  <p className="text-sm text-gray-400">
                    Activities: {activitiesByTrip[trip.id]?.length || 0}
                  </p>
                  <p className="text-sm text-gray-400">Likes: {trip.likes}</p>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, color = "text-gray-900", tooltip }) => (
  <div
    className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 flex flex-col items-center justify-center cursor-default relative group"
    title={tooltip}
  >
    <div className={`text-5xl mb-3 select-none`}>{icon}</div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className={`text-3xl font-extrabold ${color} mt-1`}>{value}</p>
    {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap select-none">
      {tooltip}
    </span>
  </div>
);

const Loading = () => (
  <div className="p-10 text-center text-lg font-semibold text-gray-600 dark:text-gray-400">
    Loading profile data...
  </div>
);

const Error = ({ message }) => (
  <div className="p-10 text-center text-red-600 font-semibold">
    Error: {message}
  </div>
);

export default Profile;
