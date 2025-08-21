// src/pages/CoursesPage.jsx
import React from "react";
import CourseList from "../components/Courses/CourseList";
import "./CoursesPage.css";

const CoursesPage = () => {
  return (
    <div className="courses-page">
      <header className="courses-header">
        <h1>📚 Explore Our Courses</h1>
        <p>Find the perfect course to boost your skills and career growth.</p>
      </header>

      <CourseList />
    </div>
  );
};

export default CoursesPage;
