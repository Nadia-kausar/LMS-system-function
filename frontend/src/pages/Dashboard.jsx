// src/pages/InstructorDashboard.jsx
import React, { useState, useEffect } from "react";
import API from "../api/api";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "Beginner",
    price: 0,
    duration: "4 weeks",
    instructor: 1, // Replace with current instructor ID if dynamic
  });
  const [editingCourseId, setEditingCourseId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourseId) {
        await API.put(`courses/${editingCourseId}/`, formData);
      } else {
        await API.post("courses/", formData);
      }
      fetchCourses();
      setFormData({
        title: "",
        description: "",
        level: "Beginner",
        price: 0,
        duration: "4 weeks",
        instructor: 1,
      });
      setEditingCourseId(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add/edit course");
    }
  };

  const handleEdit = (course) => {
    setFormData({ ...course, instructor: course.instructor });
    setEditingCourseId(course.id);
  };

  const handleDelete = async (course) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`courses/${course.id}/`, {
        data: { instructor: course.instructor },
      });
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete course");
    }
  };

  return (
    <div>
      <h1>Instructor Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          name="level"
          placeholder="Level"
          value={formData.level}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
        />
        <input
          name="instructor"
          type="number"
          value={formData.instructor}
          onChange={handleChange}
        />
        <button type="submit">{editingCourseId ? "Update" : "Add"} Course</button>
      </form>

      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        courses.map((course) => (
          <div key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button onClick={() => handleEdit(course)}>Edit</button>
            <button onClick={() => handleDelete(course)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default InstructorDashboard;
