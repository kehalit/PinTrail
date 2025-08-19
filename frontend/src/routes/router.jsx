import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import SearchPage from "../pages/SearchPage";
import TripDetailsPage from "../pages/TripDetailsPage";
import Profile from '../pages/Profile';

const Router = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/trips/:tripId" element={<TripDetailsPage/>}/>
      <Route path="/users/:id" element={<Profile />} />
    
      {!user && <Route path="/login" element={<LoginPage />} />}
      {!user && <Route path="/register" element={<RegisterPage />} />}

      {user && (
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      )}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
