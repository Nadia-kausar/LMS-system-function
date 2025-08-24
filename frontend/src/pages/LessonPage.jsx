import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "./LessonPage.css";

const LessonPage = () => {
  const { user } = useContext(AuthContext);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch course and lessons
  const fetchData = async () => {
    try {
      const courseRes = await API.get(`courses/${courseId}/`);
      setCourse(courseRes.data);

      const lessonsRes = await API.get(`courses/${courseId}/lessons/`);
      setLessons(lessonsRes.data);

      if (lessonsRes.data.length > 0) {
        setSelectedLesson(lessonsRes.data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching course or lessons:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [courseId, user]);

  // Reload and play video whenever selectedLesson changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        console.warn("Autoplay prevented by browser. Click play manually.");
      });
    }
  }, [selectedLesson]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!course) return <p className="loading">Course not found</p>;

  // Handle video completion
  const handleVideoEnd = async () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);

    // If not last lesson → play next
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1]);
    } else {
      // ✅ Last lesson completed → generate certificate
      try {
        await API.post(`/courses/${courseId}/students/${user.id}/certificate/`);
        navigate("/my-certificates"); // student certificate page
      } catch (err) {
        console.error("Error generating certificate:", err);
      }
    }
  };

  return (
    <div className="lesson-page-container">
      <button className="back-btn" onClick={() => navigate(`/courses/${courseId}`)}>
        ← Back to Course
      </button>

      <h1 className="course-title">{course.title} - Lessons</h1>

      <div className="lesson-page-grid">
        {/* Lesson List Sidebar */}
        <div className="lesson-list-sidebar">
          {lessons.length === 0 && <p>No lessons available.</p>}
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`lesson-card ${selectedLesson?.id === lesson.id ? "active" : ""}`}
              onClick={() => setSelectedLesson(lesson)}
            >
              <h3>{lesson.title}</h3>
            </div>
          ))}
        </div>

        {/* Lesson Detail */}
        <div className="lesson-detail-content">
          {selectedLesson ? (
            <>
              <h2 className="lesson-title">{selectedLesson.title}</h2>
              <p className="lesson-description">{selectedLesson.content}</p>

              {/* Uploaded video */}
              {selectedLesson.video_file ? (
                <video
                  ref={videoRef}
                  controls
                  width="100%"
                  className="lesson-video"
                  onEnded={handleVideoEnd}
                  preload="auto"
                >
                  <source src={selectedLesson.video_file} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>No video available for this lesson.</p>
              )}
            </>
          ) : (
            <p>Select a lesson to view its content</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
