import { useState } from "react";
import { useUser } from "../context/UserContext";
import { toggleLessonProgress } from "../api/progress";


const ProfilePage = () => {
    const { user } = useUser();
    const [openCourseId, setOpenCourseId] = useState(null);

    if (!user) {
        return (
            <div style={{ padding: "2rem" }}>
                <p>Log in to look at your profile.</p>
            </div>
        );
    }

    const toggleCourse = (courseId) => {
        setOpenCourseId(openCourseId === courseId ? null : courseId);
    };

    const getProgressColor = (progress) => {
        if (progress < 40) return "linear-gradient(90deg, #f87171, #f44336)";
        if (progress < 80) return "linear-gradient(90deg, #ffb74d, #ff9800)";
        return "linear-gradient(90deg, #4caf50, #81c784)";
    };

    const handleLessonToggle = async (course, chapter, lesson) => {
    const newValue = lesson.completed ? 0 : 1;

    try {
        await toggleLessonProgress({
            user_id: user.id,
            course_id: course.id,
            chapter_id: chapter.id,
            lesson_id: lesson.id,
            completed: newValue,
        });

        const updatedUser = { ...user };

        const courseIndex = updatedUser.courses.findIndex(c => c.id === course.id);
        const updatedCourse = { ...updatedUser.courses[courseIndex] };

        const chapterIndex = updatedCourse.chapters.findIndex(ch => ch.id === chapter.id);
        const updatedChapter = { ...updatedCourse.chapters[chapterIndex] };

        const lessonIndex = updatedChapter.lessons.findIndex(ls => ls.id === lesson.id);
        const updatedLessons = [...updatedChapter.lessons];
        updatedLessons[lessonIndex] = {
            ...updatedLessons[lessonIndex],
            completed: newValue,
        };

        updatedChapter.lessons = updatedLessons;
        updatedCourse.chapters[chapterIndex] = updatedChapter;
        updatedUser.courses[courseIndex] = updatedCourse;

        setUser(updatedUser);

    } catch (err) {
        console.error("❌ Error with toggling progress:", err);
    }
};


    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "2rem",
                padding: "2rem",
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >

            <aside
                style={{
                    background: "#A78BFA",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                    height: "fit-content",
                    color: "#fff",
                }}
            >
                <h2>👤 Profile</h2>
                <p>
                    <strong>Name:</strong> {user.name}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>

                <div
                    style={{
                        marginTop: "1.5rem",
                        padding: "1rem",
                        background: "#336073",
                        borderRadius: "6px",
                        boxShadow: "inset 0 0 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <h3>📝 Over mij</h3>
                    <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                        {user.bio && user.bio.trim().length > 0
                            ? user.bio
                            : "This user has not written anything about him/herself."}
                    </p>
                </div>
            </aside>

            <section
                style={{
                    background: "#A78BFA",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                    color: "#fff",
                }}
            >
                <h2>📚 Courses of {user.name}</h2>

                {user.courses && user.courses.length > 0 ? (
                    user.courses.map((course) => {
                        const totalChapters = course.chapters.length;
                        const totalLessons = course.chapters.reduce(
                            (acc, ch) => acc + ch.lessons.length,
                            0
                        );

                        return (
                            <div
                                key={course.id}
                                style={{
                                    borderBottom: "1px solid rgba(255,255,255,0.3)",
                                    marginBottom: "1rem",
                                    paddingBottom: "1rem",
                                }}
                            >
                                <div
                                    onClick={() => toggleCourse(course.id)}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        background: "rgba(0,0,0,0.1)",
                                        padding: "0.8rem 1rem",
                                        borderRadius: "6px",
                                        transition: "background 0.2s ease",
                                    }}
                                >
                                    <div>
                                        <h3 style={{ margin: 0 }}>
                                            {course.title}{" "}
                                            <span style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>
                                                ({course.provider?.name})
                                            </span>
                                        </h3>
                                        <p style={{ margin: "0.3rem 0 0 0", fontSize: "0.9rem" }}>
                                            Chapters: <strong>{totalChapters}</strong> | Lessons:{" "}
                                            <strong>{totalLessons}</strong>
                                        </p>
                                    </div>
                                    <span style={{ fontSize: "1.2rem" }}>
                                        {openCourseId === course.id ? "▲" : "▼"}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        background: "rgba(255,255,255,0.2)",
                                        height: "14px",
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        margin: "0.8rem 0",
                                        position: "relative",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${course.progress}%`,
                                            height: "100%",
                                            background: getProgressColor(course.progress),
                                            transition: "width 0.5s ease-in-out",
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            fontSize: "0.75rem",
                                            color: "#fff",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {course.progress}%
                                    </span>
                                </div>

                                <div
                                    style={{
                                        maxHeight: openCourseId === course.id ? "1000px" : "0px",
                                        overflow: "hidden",
                                        transition: "max-height 0.5s ease",
                                    }}
                                >
                                    <div style={{ marginTop: "0.5rem" }}>
                                        {course.chapters.map((chapter) => {
                                            const completedLessons = chapter.lessons.filter(
                                                (l) => l.completed === 1
                                            ).length;
                                            const totalLessons = chapter.lessons.length;
                                            const progress =
                                                totalLessons > 0
                                                    ? Math.round(
                                                        (completedLessons / totalLessons) * 100
                                                    )
                                                    : 0;

                                            return (
                                                <div
                                                    key={chapter.id}
                                                    style={{
                                                        marginBottom: "1rem",
                                                        paddingLeft: "1rem",
                                                        borderLeft: "3px solid rgba(255,255,255,0.3)",
                                                    }}
                                                >
                                                    <h4 style={{ margin: "0.3rem 0" }}>
                                                        📘 {chapter.title}
                                                    </h4>
                                                    <p style={{ margin: "0.2rem 0 0.5rem 0" }}>
                                                        Les(sen):{" "}
                                                        <strong>
                                                            {completedLessons}/{totalLessons}
                                                        </strong>{" "}
                                                        voltooid ({progress}%)
                                                    </p>

                                                    <div
                                                        style={{
                                                            background: "rgba(255,255,255,0.2)",
                                                            height: "10px",
                                                            borderRadius: "6px",
                                                            overflow: "hidden",
                                                            marginBottom: "0.8rem",
                                                            width: "90%",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: `${progress}%`,
                                                                height: "100%",
                                                                background: getProgressColor(progress),
                                                                transition: "width 0.4s ease",
                                                            }}
                                                        />
                                                    </div>

                                                    <ul style={{ marginLeft: "1rem" }}>
                                                        {chapter.lessons.map((lesson) => (
                                                            <li
                                                                key={lesson.id}
                                                                style={{
                                                                    listStyle: "none",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "0.5rem",
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={lesson.completed === 1}
                                                                    onChange={() => handleLessonToggle(course, chapter, lesson)}
                                                                />

                                                                <span
                                                                    style={{
                                                                        color: lesson.completed ? "#aef1b2" : "#e0e0e0",
                                                                        textDecoration: lesson.completed ? "line-through" : "none",
                                                                    }}
                                                                >
                                                                    {lesson.title}
                                                                </span>
                                                            </li>

                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No courses of this user.</p>
                )}
            </section>
        </div>
    );
};

export default ProfilePage;
