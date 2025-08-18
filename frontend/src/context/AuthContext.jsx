import React, { createContext, useState } from "react";
import API from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user from localStorage on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Register
  const register = async (formData) => {
    try {
      const res = await API.post("register/", formData);
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // Login
  const login = async (formData) => {
    try {
      const res = await API.post("login/", formData);
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
