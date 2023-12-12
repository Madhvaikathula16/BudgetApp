import React, { useEffect } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import styles from "./stylesfolder/dashboard.module.css";
import Business from "./Business";
import Personal from "./Personal";

import CustomerService from "./CustomerService";
import Home from "./Home";
import Login from "./Login";
import Profile from "./Profile";

import Register from "./Register";

import { useSelector } from "react-redux";

export default function Dashboard() {
  // Redux state and other logic
  const checkUser = useSelector((state) => state.auth);
  const getUser = checkUser.user;
  console.log("CHECK USER FROM DASHBOARD", checkUser);

  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = getUser;

    if (!isAuthenticated) {
      // Redirect to the specified path if the user is not authenticated
      return <Navigate to="/login" replace />;
    }

    // Render children if the user is authenticated
    return children;
  };

  return (
    <div className={styles["dashboardContainer"]}>
      <nav className={styles["navbar"]}>
        <div className={styles["leftNavbar"]}>
          <Link to="/home">DashBoard</Link>
          <Link to="/personal">Allocated Budget</Link>
          <Link to="/business">Budget Spent</Link>
        </div>
        <div className={styles["rightNavbar"]}>
          <Link to="/customer-service">Customer Service</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>

      {/* Content Area for Routing */}
      <div className={styles["content"]}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/personal"
            element={
              <ProtectedRoute>
                <Personal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/business"
            element={
              <ProtectedRoute>
                <Business />
              </ProtectedRoute>
            }
          />

          <Route path="/customer-service" element={<CustomerService />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </div>
  );
}
