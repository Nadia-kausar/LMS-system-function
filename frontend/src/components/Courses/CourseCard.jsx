import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course, user, onDelete }) => {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p>Level: {course.level}</p>
      <p>Price: ${course.price}</p>
      <p>Instructor: {course.instructor_name}</p>
      <p>Students: {course.students_count}</p>

      <Link to={`/courses/${course.id}`}>View Details</Link>

      {user?.is_instructor && user?.id === course.instructor && (
        <div className="instructor-controls">
          <button onClick={() => onDelete(course.id)}>Delete</button>
          <Link to={`/instructor/edit-course/${course.id}`}>Edit</Link>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
