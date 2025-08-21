import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./CourseDetail.css";

const CourseDetailPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // courseId from URL
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Fetch course details and check enrollment
  const fetchCourse = async () => {
    try {
      const res = await API.get(`courses/${id}/`);
      setCourse(res.data);

      // Check if user is enrolled
      if (user) {
        const enrollRes = await API.get(`my-enrollments/?student_id=${user.id}`);
        const enrolledCourse = enrollRes.data.find((e) => e.course === res.data.id);
        if (enrolledCourse) setIsEnrolled(true);
      }
    } catch (err) {
      console.error("Error fetching course", err);
    }
  };

  // Enroll student
  const handleEnroll = async () => {
    if (!user) return alert("Please login first");

    try {
      await API.post(`courses/${id}/enroll/`, { student_id: user.id });
      setIsEnrolled(true);
      alert("You are enrolled successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Enrollment failed!");
    }
  };

  // Navigate to lessons page
  const goToLessons = () => {
    navigate(`/courses/${id}/lessons`);
  };

  useEffect(() => {
    fetchCourse();
  }, [id, user]);

  if (!course) return <p className="loading">Loading...</p>;

  return (
    <div className="course-detail-container">
      <button className="back-btn" onClick={() => navigate("/courses")}>
        ← Back to Courses
      </button>

      <div className="course-card">
        <h1 className="course-title">{course.title}</h1>
        <p className="course-description">{course.description}</p>

        <div className="course-meta">
          <p><strong>Level:</strong> {course.level}</p>
          <p><strong>Duration:</strong> {course.duration}</p>
          <p><strong>Price:</strong> ${course.price}</p>
          <p><strong>Instructor:</strong> {course.instructor_name}</p>
          <p><strong>Students:</strong> {course.students_count}</p>
        </div>

        {!user?.is_instructor && !isEnrolled && (
          <button className="enroll-btn" onClick={handleEnroll}>
            Enroll Now
          </button>
        )}

        {!user?.is_instructor && isEnrolled && (
          <button className="go-lessons-btn" onClick={goToLessons}>
            ✅ Go to Lessons
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
