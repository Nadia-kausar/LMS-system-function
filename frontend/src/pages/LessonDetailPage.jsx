import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";

const LessonDetailPage = () => {
  const { id } = useParams(); // lesson id
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", video_url: "" });

  // Fetch lesson
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await API.get(`lessons/${id}/`);
        setLesson(res.data);
        setForm({
          title: res.data.title,
          content: res.data.content,
          video_url: res.data.video_url || ""
        });
      } catch (err) {
        console.error("Error fetching lesson", err);
      }
    };
    fetchLesson();
  }, [id]);

  // Update lesson (instructor)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`lessons/${id}/`, form);
      setLesson(res.data);
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update lesson");
    }
  };

  // Delete lesson (instructor)
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await API.delete(`lessons/${id}/`);
      navigate(-1); // back to lessons list
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete lesson");
    }
  };

  if (!lesson) return <p>Loading lesson...</p>;

  return (
    <div style={{ padding: "20px" }}>
      {!editing ? (
        <>
          <h2>{lesson.title}</h2>
          <p>{lesson.content}</p>
          {lesson.video_url && (
            <div>
              <h4>Video:</h4>
              <a href={lesson.video_url} target="_blank" rel="noopener noreferrer">
                ▶ Watch Video
              </a>
            </div>
          )}
          {user?.is_instructor && (
            <div style={{ marginTop: "20px" }}>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>
                Delete
              </button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          /><br /><br />
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          /><br /><br />
          <input
            type="url"
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
          /><br /><br />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default LessonDetailPage;
