import { useEffect, useState } from 'react';

const UserDashboard = ({ userId }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);

    const API_BASE = 'http://localhost:3000';

    const fetchProgress = async (courseId) => {
        try {
            setError(null);
            setSelectedCourse(courseId);
            const res = await fetch(`${API_BASE}/users/${userId}/courses/${courseId}/progress`);
            if (!res.ok) throw new Error('Could not fetch the user progress');
            const data = await res.json();
            setProgress(data);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="user-dashboard">
            <h1>User Dashboard</h1>
            {error && <p style={{ color: 'red' }}>Fout: {error}</p>}

            {!selectedCourse && (
                <ul>
                    {courses.map((course) => (
                        <li key={course.id} style={{ marginBottom: '1rem' }}>
                            <article>
                                <div>{course.title} – {course.description}</div>
                                {course.image_url && <img src={course.image_url} alt={course.title} />}
                                <br />
                                <button onClick={() => fetchProgress(course.id)}>Bekijk progress</button>
                            </article>
                        </li>
                    ))}
                </ul>
            )}

            {selectedCourse && progress && (
                <section>
                    <button
                        onClick={() => {
                            setSelectedCourse(null);
                            setProgress(null);
                        }}
                    >
                        ← Back
                    </button>

                    <h2>{progress.course_id} – Progress: {progress.course_progress}%</h2>

                    <h3>Chapters:</h3>

                    <dl>
                        {progress.chapters.map((chapter) => (
                            <div key={chapter.chapter_id} style={{ marginBottom: '0.5rem' }}>
                                <dt style={{ fontWeight: 'bold' }}>{chapter.chapter_title}</dt>
                                <dd style={{ marginLeft: '1rem' }}>
                                    {chapter.progress}% ({chapter.completed_lessons}/{chapter.total_lessons} lessons)
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}
        </main>
    );
};

export default UserDashboard;