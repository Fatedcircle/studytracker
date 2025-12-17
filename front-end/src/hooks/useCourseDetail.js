import { useEffect, useState } from "react";

export function useCourseDetail(id) {
    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [lessons, setLessons] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API = "http://localhost:3000";

    useEffect(() => {
        let timeoutId;

        async function load() {
            setLoading(true);
            setError(null);

            const start = Date.now();

            try {
                const res = await fetch(`${API}/courses/${id}`);
                if (!res.ok) throw new Error("Could not fetch the course");
                const courseData = await res.json();
                setCourse(courseData);

                const chapterRes = await fetch(`${API}/courses/${id}/chapters`);
                if (!chapterRes.ok) throw new Error("Could not fetch chapters");
                const chaptersData = await chapterRes.json();
                setChapters(chaptersData);

                // --- Lessons ---
                const lessonsObj = {};
                for (const ch of chaptersData) {
                    const lRes = await fetch(`${API}/chapters/${ch.id}/lessons`);
                    if (!lRes.ok) throw new Error("Could not fetch lessons");
                    lessonsObj[ch.id] = await lRes.json();
                }
                setLessons(lessonsObj);

            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
                return;
            }

            const elapsed = Date.now() - start;
            timeoutId = setTimeout(
                () => setLoading(false),
                Math.max(0, 500 - elapsed)
            );
        }

        load();
        return () => clearTimeout(timeoutId);
    }, [id]);

    return {
        course,
        chapters,
        lessons,
        loading,
        error,
    };
}
