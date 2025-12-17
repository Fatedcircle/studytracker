export default function CourseList({ courses, onSelectCourse, title }) {
    return (
        <div>
            <h2>{title}</h2>
            <ul>
                {courses.map((c) => (
                    <li key={c.id} onClick={() => onSelectCourse(c.id)}>
                        {c.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
