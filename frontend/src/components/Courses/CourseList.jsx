// src/components/Courses/CourseList.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./CourseList.css";

const CourseList = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="courses-container">
      <div className="courses-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <button onClick={() => navigate(`/courses/${course.id}`)}>
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="no-courses">No courses available.</p>
        )}
      </div>
    </div>
  );
};

export default CourseList;
