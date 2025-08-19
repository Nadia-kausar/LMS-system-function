import React, { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", level: "Beginner", price: 0, duration: "4 weeks" });

  const fetchCourses = async () => {
    try {
      const res = await API.get("courses/");
      setCourses(res.data.filter(c => c.instructor === user.id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user?.is_instructor) navigate("/courses");
    fetchCourses();
  }, [user, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("courses/", formData);
      setCourses([...courses, res.data]);
      setFormData({ title: "", description: "", level: "Beginner", price: 0, duration: "4 weeks" });
    } catch (err) {
      alert("Failed to add course");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course?")) {
      try {
        await API.delete(`courses/${id}/`);
        setCourses(courses.filter(c => c.id !== id));
      } catch (err) {
        alert("Failed to delete course");
      }
    }
  };

  return (
    <div className="instructor-dashboard">
      <h1>Instructor Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <h2>Add Course</h2>
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="level" placeholder="Level" value={formData.level} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
        <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} />
        <button type="submit">Add Course</button>
      </form>

      <h2>My Courses</h2>
      {courses.map(course => (
        <div key={course.id} className="course-card">
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <button onClick={() => handleDelete(course.id)}>Delete</button>
          <button onClick={() => navigate(`/instructor/edit-course/${course.id}`)}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default InstructorDashboard;
