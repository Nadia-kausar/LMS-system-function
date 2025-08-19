import { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

const MyEnrollments = () => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    API.get(`my-enrollments/?student_id=${user.id}`)
      .then(res => setEnrollments(res.data))
      .catch(err => console.error(err));
  }, [user]);

  return (
    <div>
      <h2>My Enrollments</h2>
      {enrollments.length > 0 ? enrollments.map(e => (
        <div key={e.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <p>Course: {e.title}</p>
          <p>Enrolled at: {new Date(e.enrolled_at).toLocaleDateString()}</p>
          <p>Price Paid: ${e.price}</p>
          <p>Instructor: {e.instructor}</p>
        </div>
      )) : <p>No enrollments yet.</p>}
    </div>
  );
};

export default MyEnrollments;
