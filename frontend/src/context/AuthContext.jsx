import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on first load
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    } else {  
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    }
  }, []);


  const login = (userData, access_token) => {
  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData)); 
  localStorage.setItem('access_token', access_token); 
  };


  const logout = async() => {
    try{
         await api.post('/users/logout');
    }
    catch(error){
      console.error('Logout failed:', error);
    }
    finally{
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null)

    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
