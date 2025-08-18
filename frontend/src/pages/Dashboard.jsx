import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);   // ✅ fixed: use `user` not `currentUser`
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const navigate = useNavigate();

  // 🔒 Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddCourse = async () => {
    try {
      await api.post(
        "/courses/",
        { title: courseTitle, description: courseDesc },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      setCourseTitle("");
      setCourseDesc("");
      fetchCourses();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await api.delete(`/courses/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      fetchCourses();
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return <h2>Loading Dashboard...</h2>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user.username} ({user.is_instructor ? "Instructor" : "Student"})</h1>

      {user.is_instructor && (
        <div className="add-course">
          <h2>Add Course</h2>
          <input
            placeholder="Title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
          <input
            placeholder="Description"
            value={courseDesc}
            onChange={(e) => setCourseDesc(e.target.value)}
          />
          <button onClick={handleAddCourse}>Add Course</button>
        </div>
      )}

      <div className="courses-list">
        <h2>Your Courses</h2>
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              {user.is_instructor && (
                <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
              )}
            </div>
          ))
        ) : (
          <p>No courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
