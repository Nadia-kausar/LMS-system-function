import { useEffect, useState } from 'react';
import API from '../../api/api';
import CourseCard from './CourseCard';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get('courses/')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="course-list">
      {courses.map(course => <CourseCard key={course.id} course={course} />)}
    </div>
  );
};

export default CourseList;
