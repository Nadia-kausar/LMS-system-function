// src/components/Courses/CourseList.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

const CourseList = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // hook to navigate

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
    <div className="course-list">
      <h2>All Courses</h2>
      {courses.length > 0 ? (
        courses.map((course) => (
          <div key={course.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button onClick={() => navigate(`/courses/${course.id}`)}>View Details</button>
          </div>
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default CourseList;
