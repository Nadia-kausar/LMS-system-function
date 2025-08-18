import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => (
  <div className="course-card">
    <h3>{course.title}</h3>
    <p>{course.description}</p>
    <p>Level: {course.level}</p>
    <p>Price: ${course.price}</p>
    <Link to={`/courses/${course.id}`}>View Details</Link>
  </div>
);

export default CourseCard;
