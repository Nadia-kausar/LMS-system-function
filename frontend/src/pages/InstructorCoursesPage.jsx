import React, { useState, useEffect } from "react";
import API from "../api/api";

const InstructorCoursesPage = ({ instructorId }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      const myCourses = res.data.filter(c => c.instructor.id === instructorId);
      setCourses(myCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1>My Courses</h1>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        courses.map(course => (
          <div key={course.id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "15px", borderRadius: "5px" }}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Level: {course.level} | Price: ${course.price} | Duration: {course.duration}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default InstructorCoursesPage;
