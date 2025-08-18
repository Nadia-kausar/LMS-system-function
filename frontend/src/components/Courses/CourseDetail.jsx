import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/api';
import { EnrollmentContext } from '../../context/EnrollmentContext';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const { setEnrollments } = useContext(EnrollmentContext);

  useEffect(() => {
    API.get(`courses/${id}/`)
      .then(res => setCourse(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const enroll = async () => {
    try {
      const res = await API.post(`courses/${id}/enroll/`);
      setEnrollments(prev => [...prev, res.data]);
      alert('Enrolled successfully');
    } catch (err) {
      alert('Enrollment failed');
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="course-detail">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>Level: {course.level}</p>
      <p>Price: ${course.price}</p>
      <button onClick={enroll}>Enroll Now</button>
    </div>
  );
};

export default CourseDetail;
