export default function CourseDetail({ courseId, onBack }) {
    return (
        <div>
            <h2>Course Detail {courseId}</h2>
            <button onClick={onBack}>Back</button>
        </div>
    );
}
