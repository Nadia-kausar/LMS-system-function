import React, { useState, useEffect, useContext } from "react";
import API from "../../api/api";
import CourseCard from "./CourseCard";
import { AuthContext } from "../../context/AuthContext";

const CourseList = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      console.log("Courses fetched:", res.data); // Debug API response
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load courses", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`courses/${id}/`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete course");
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="course-list">
      <h2>All Courses</h2>
      {courses.length > 0 ? (
        courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            user={user}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default CourseList;
