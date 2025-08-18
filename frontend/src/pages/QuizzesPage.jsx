import QuizList from '../components/Quiz/QuizList';
import QuizDetail from '../components/Quiz/QuizDetail';
import { useParams } from 'react-router-dom';

const QuizzesPage = () => {
  const { id, courseId } = useParams();
  return (
    <div className="page">
      {id ? <QuizDetail /> : <QuizList />}
    </div>
  );
};

export default QuizzesPage;
