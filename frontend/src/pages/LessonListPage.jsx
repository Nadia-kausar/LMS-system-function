// src/pages/LessonListPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";

const LessonListPage = () => {
  const { id } = useParams(); // course id
  const { user } = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    video_url: "",
  });

  // Check enrollment & fetch lessons
  const fetchLessons = async () => {
    try {
      if (!user) return;

      // Check if student is enrolled
      if (!user.is_instructor) {
        const enrollRes = await API.get(`my-enrollments/?student_id=${user.id}`);
        const enrolledCourse = enrollRes.data.find((e) => e.course === parseInt(id));
        if (!enrolledCourse) {
          setIsEnrolled(false);
          setLessons([]);
          setLoading(false);
          return;
        } else {
          setIsEnrolled(true);
        }
      }

      // Fetch lessons
      const res = await API.get(`courses/${id}/lessons/`);
      setLessons(res.data);
    } catch (err) {
      console.error("Error fetching lessons", err);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [id, user]);

  // Add lesson (Instructor only)
  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`courses/${id}/lessons/`, newLesson);
      setLessons([...lessons, res.data]);
      setNewLesson({ title: "", content: "", video_url: "" });
    } catch (err) {
      alert("Failed to add lesson");
      console.error(err);
    }
  };

  if (loading) return <p>Loading lessons...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lessons</h2>

      {!user ? (
        <p>Please login to see lessons.</p>
      ) : !user.is_instructor && !isEnrolled ? (
        <p>⚠ You are not enrolled in this course yet. Please enroll first.</p>
      ) : lessons.length === 0 ? (
        <p>No lessons available yet.</p>
      ) : (
        <ul>
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link to={`/lessons/${lesson.id}`}>{lesson.title}</Link>
            </li>
          ))}
        </ul>
      )}

      {/* Add lesson form for instructor */}
      {user?.is_instructor && (
        <form onSubmit={handleAddLesson} style={{ marginTop: "20px" }}>
          <h3>Add Lesson</h3>
          <input
            type="text"
            placeholder="Title"
            value={newLesson.title}
            onChange={(e) =>
              setNewLesson({ ...newLesson, title: e.target.value })
            }
            required
          /><br />
          <textarea
            placeholder="Content"
            value={newLesson.content}
            onChange={(e) =>
              setNewLesson({ ...newLesson, content: e.target.value })
            }
            required
          /><br />
          <input
            type="url"
            placeholder="Video URL (optional)"
            value={newLesson.video_url}
            onChange={(e) =>
              setNewLesson({ ...newLesson, video_url: e.target.value })
            }
          /><br />
          <button type="submit">Add Lesson</button>
        </form>
      )}
    </div>
  );
};

export default LessonListPage;
