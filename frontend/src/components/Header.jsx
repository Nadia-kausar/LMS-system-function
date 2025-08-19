import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link
            to={
              user
                ? user.is_instructor
                  ? "/instructor-home"
                  : "/student-home"
                : "/login"
            }
          >
            LearningApp
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`nav ${isOpen ? "open" : ""}`}>
          {/* Instructor Links */}
          {user && user.is_instructor && (
            <>
              <Link to="/instructor-home">Dashboard</Link>
              <Link to="/instructor-courses">Courses</Link>
              <Link to="/instructor-enrollments">Enrollments</Link>
            </>
          )}

          {/* Student Links */}
          {user && !user.is_instructor && (
            <>
              <Link to="/student-home">Home</Link>
              <Link to="/courses">Courses</Link>
              <Link to="/my-enrollments">My Enrollments</Link>
              <Link to="/certificates">Certificates</Link>
            </>
          )}

          {/* Public Links */}
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {/* Logout Button */}
          {user && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>

        {/* Mobile Menu */}
        <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </div>
      </div>
    </header>
  );
};

export default Header;
