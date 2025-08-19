import React, { useState, useEffect } from "react";
import API from "../api/api";

const InstructorDashboard = ({ instructorId }) => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "Beginner",
    price: 0,
    duration: "4 weeks",
    instructor: instructorId || "",
  });
  const [editingCourseId, setEditingCourseId] = useState(null);

  // Fetch all courses on load
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(res.data); // Show all courses
    } catch (err) {
      console.error("Error fetching courses:", err);
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
      setFormData({
        title: "",
        description: "",
        level: "Beginner",
        price: 0,
        duration: "4 weeks",
        instructor: instructorId || "",
      });
      setEditingCourseId(null);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add/update course");
    }
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title,
      description: course.description,
      level: course.level,
      price: course.price,
      duration: course.duration,
      instructor: course.instructor?.id || "",
    });
    setEditingCourseId(course.id);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`courses/${courseId}/`);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete course");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Instructor Dashboard</h1>

      {/* Add/Edit Course Form */}
      <form
        onSubmit={handleSubmit}
        style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "30px" }}
      >
        <h2>{editingCourseId ? "Edit Course" : "Add New Course"}</h2>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          name="level"
          placeholder="Level"
          value={formData.level}
          onChange={handleChange}
          style={{ width: "48%", marginRight: "4%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          style={{ width: "48%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        {/* Instructor ID Input */}
        <input
          name="instructor"
          type="number"
          placeholder="Instructor ID"
          value={formData.instructor}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          {editingCourseId ? "Update" : "Add"} Course
        </button>
      </form>

      {/* Courses List */}
      <h2>All Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        courses.map((course) => (
          <div
            key={course.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>
              Level: {course.level} | Price: ${course.price} | Duration: {course.duration} | Instructor ID: {course.instructor?.id}
            </p>

            {/* Edit/Delete Buttons */}
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => handleEdit(course)} style={{ marginRight: "10px" }}>
                Edit
              </button>
              <button onClick={() => handleDelete(course.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default InstructorDashboard;
