import React from "react";
import "./HomePage.css"; 
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to EduLearn</h1>
          <p className="hero-description">
            Unlock your potential with our comprehensive online learning platform. 
            Master new skills with expert-led courses and interactive content.
          </p>

          {/* Button Only */}
          <div className="hero-buttons">
            <button
              className="get-started-btn"
              onClick={() => navigate("/courses")}
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3 className="feature-title">Rich Course Content</h3>
          <p className="feature-description">
            Access high-quality courses with videos, notes, and interactive materials 
            designed by industry experts.
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3 className="feature-title">Progress Tracking</h3>
          <p className="feature-description">
            Monitor your learning progress and achievements in real-time with 
            comprehensive analytics and insights.
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👨‍🏫</div>
          <h3 className="feature-title">Expert Instructors</h3>
          <p className="feature-description">
            Learn from industry professionals and experienced educators who bring 
            real-world knowledge to every lesson.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <h2 className="stats-title">Join Thousands of Learners</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">10K+</div>
            <div className="stat-label">Active Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">500+</div>
            <div className="stat-label">Courses</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">50+</div>
            <div className="stat-label">Expert Instructors</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">95%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
