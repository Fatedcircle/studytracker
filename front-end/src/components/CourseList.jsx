import { useNavigate } from 'react-router';
import "./courselist.css";
const CourseList = ({ courses, loading, error, title }) => {

  const navigate = useNavigate();

  if (loading) {
    return <p style={{ padding: "1rem", fontSize: "1.2rem" }}>⏳ Laden...</p>;
  }

  if (error) {
    return <p style={{ color: "red", padding: "1rem" }}>❌ {error}</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>📚 {title}</h1>
      <ul className="course-grid">
        {courses.map((course) => (
          <li key={course.id}>
            <article
              className="course-card"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              {course.image_url && (
                <img src={course.image_url} alt={course.title} />
              )}

              <h3>{course.title}</h3>

              <p>{course.description.substring(0, 120)}...</p>

              <button>Details →</button>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
