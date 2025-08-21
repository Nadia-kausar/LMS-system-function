import { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./MyEnrollments.css"; // Import CSS

const MyEnrollments = () => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    API.get(`my-enrollments/?student_id=${user.id}`)
      .then((res) => setEnrollments(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div className="enrollments-container">
      {enrollments.length > 0 ? (
        enrollments.map((e) => (
          <div key={e.id} className="enrollment-card">
            <h3 className="course-name">{e.title}</h3>
            <p><strong>Instructor:</strong> {e.instructor}</p>
            <p><strong>Price Paid:</strong> ${e.price}</p>
            <p><strong>Enrolled at:</strong> {new Date(e.enrolled_at).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p className="no-enrollments">No enrollments yet.</p>
      )}
    </div>
  );
};

export default MyEnrollments;
