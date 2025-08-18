import { useEffect, useState } from 'react';
import API from '../../api/api';

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    API.get('my-enrollments/')
      .then(res => setEnrollments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>My Enrollments</h2>
      {enrollments.map(e => (
        <div key={e.id}>
          <p>Course: {e.course.title}</p>
          <p>Enrolled at: {new Date(e.enrolled_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default MyEnrollments;
