import { useEffect, useState } from "react";

export function useProvidersAndCourses() {
    const [providers, setProviders] = useState([]);
    const [courses, setCourses] = useState([]);
    const [activeUser, setActiveUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let timeoutId;

        async function load() {
            setLoading(true);
            setError(null);

            const start = Date.now();

            try {
                const [providersRes, coursesRes, userRes] = await Promise.all([
                    fetch("http://localhost:3000/providers"),
                    fetch("http://localhost:3000/courses"),
                    fetch("http://localhost:3000/users/1"),
                ]);

                if (!providersRes.ok || !coursesRes.ok) {
                    throw new Error("Failed to fetch resources");
                }

                const [providersData, coursesData, user] = await Promise.all([providersRes.json(), coursesRes.json(), userRes.json()]);

                setProviders(providersData);
                setCourses(coursesData);
                setActiveUser(user);
            } catch (err) {
                console.error(err);
                setError("Failed to load data");
            } finally {
                const elapsed = Date.now() - start;
                timeoutId = setTimeout(() => setLoading(false), Math.max(0, 500 - elapsed));
            }
        }

        load();
        return () => clearTimeout(timeoutId);
    }, []);

    return {
        providers,
        courses,
        activeUser,
        loading,
        error,
    };
}
