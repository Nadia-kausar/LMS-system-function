import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();              // clear user from context + localStorage
    navigate("/login");    // send back to login page
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo redirects based on role */}
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

        {/* Navigation Links */}
        <nav className={`nav ${isOpen ? "open" : ""}`}>
          {/* Student Menu */}
          {user && !user.is_instructor && (
            <>
              <Link to="/student-home">Home</Link>
              <Link to="/courses">Courses</Link>
              <Link to="/my-enrollments">My Enrollments</Link>
              <Link to="/certificates">Certificates</Link>
            </>
          )}

          {/* Instructor Menu */}
          {user && user.is_instructor && (
            <>
              <Link to="/instructor-home">Dashboard</Link>
              <Link to="/courses">Courses List</Link>
              <Link to="/students-enrollments">Enrollments</Link>
              <Link to="/certificates">Certificates</Link>
            </>
          )}

          {/* Public Menu (not logged in) */}
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {/* Logout Button (works for both roles) */}
          {user && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </div>
      </div>
    </header>
  );
};

export default Header;
