import React, { useState, useEffect } from "react";
import API from "../api/api";

const InstructorEnrollmentsPage = ({ instructorId }) => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

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

  useEffect(() => {
    fetchEnrollments();
  }, [courses]);

  const fetchEnrollments = async () => {
    try {
      let allEnrollments = [];
      for (const course of courses) {
        const res = await API.get(`courses/${course.id}/`);
        const students = res.data.students.map(s => ({
          ...s,
          courseTitle: course.title,
        }));
        allEnrollments = [...allEnrollments, ...students];
      }
      setEnrollments(allEnrollments);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1>Student Enrollments</h1>
      {enrollments.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        enrollments.map((e, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <p><strong>Course:</strong> {e.courseTitle}</p>
            <p><strong>Student:</strong> {e.username} ({e.email})</p>
          </div>
        ))
      )}
    </div>
  );
};

export default InstructorEnrollmentsPage;