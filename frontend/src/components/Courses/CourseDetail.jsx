import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

const CourseDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`courses/${id}/`);
        setCourse(res.data);
        if (user) setIsEnrolled(res.data.students?.includes(user.id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourse();
  }, [id, user]);

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

  if (!course) return <p>Loading...</p>;

  return (
    <div className="course-detail">
      <button onClick={() => navigate("/courses")}>← Back to Courses</button>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Level: {course.level}</p>
      <p>Price: ${course.price}</p>
      <p>Instructor: {course.instructor_name}</p>
      <p>Students: {course.students_count}</p>

      {!user?.is_instructor && !isEnrolled && (
        <button onClick={handleEnroll}>Enroll Now</button>
      )}
      {isEnrolled && <p>✅ Enrolled</p>}
    </div>
  );
};

export default CourseDetail;
