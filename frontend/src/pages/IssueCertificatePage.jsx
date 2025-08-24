// src/pages/IssueCertificatePage.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const IssueCertificatePage = () => {
  const { currentUser } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (currentUser?.is_instructor) {
      // Fetch instructor courses with enrolled students
      axios
        .get("http://localhost:8000/api/my-courses-with-enrollments/", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        })
        .then((res) => setCourses(res.data))
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  const handleIssueCertificate = (courseId, studentId) => {
    axios
      .post(
        `http://localhost:8000/api/courses/${courseId}/students/${studentId}/certificate/`,
        {},
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      )
      .then((res) => {
        alert(`✅ Certificate issued to ${res.data.student_name} for ${res.data.course_name}`);
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Failed to issue certificate");
      });
  };

  if (!currentUser?.is_instructor) {
    return <h2 className="text-center mt-5">❌ Access Denied: Only instructors can issue certificates.</h2>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-2xl font-bold mb-4">📜 Issue Certificates (Instructor Home)</h1>
      {courses.length === 0 ? (
        <p>No courses found with enrolled students.</p>
      ) : (
        courses.map((course) => (
          <div key={course.id} className="mb-6 border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">📘 {course.title}</h2>
            {course.students.length === 0 ? (
              <p>No students enrolled.</p>
            ) : (
              <ul>
                {course.students.map((student) => (
                  <li key={student.id} className="flex justify-between items-center mb-2">
                    <span>{student.username}</span>
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => handleIssueCertificate(course.id, student.id)}
                    >
                      Issue Certificate
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default IssueCertificatePage;
