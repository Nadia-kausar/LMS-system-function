import React, { useState, useEffect, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CourseList = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("courses/")
       .then(res => setCourses(res.data))
       .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>All Courses</h2>
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <button onClick={() => navigate(`/courses/${course.id}`)}>View Details</button>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
