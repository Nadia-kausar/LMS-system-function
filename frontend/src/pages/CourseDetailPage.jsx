import CourseDetail from '../components/Courses/CourseDetail';
import './CourseDetailPage.css'; // import CSS file

const CourseDetailPage = () => {
  return (
    <div className="course-detail-page">
      <h1 className="course-detail-title">Course Detail</h1>
      <CourseDetail />
    </div>
  );
};

export default CourseDetailPage;
