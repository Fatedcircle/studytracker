import { useState } from "react";
import { useProvidersAndCourses } from "../../hooks/useProvidersAndCourses";
import "./mainpage.css";
import CourseList from "../CourseList";

const MainPage = () => {

    const {
        providers,
        courses,
        activeUser,
        loading,
        error,
    } = useProvidersAndCourses();
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [isAsideOpen, setIsAsideOpen] = useState(false);


    const handleProviderSelect = (providerId) => {
        setSelectedProvider(providerId);
        if (window.innerWidth < 768) {
            setIsAsideOpen(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "2rem", fontSize: "1.5rem" }}>
                ⏳ Loading content...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "2rem", color: "red", fontSize: "1.3rem" }}>
                ❌ {error}
            </div>
        );
    }

    const filteredCourses = selectedProvider
        ? courses.filter((c) => c.provider_id === selectedProvider)
        : courses;

    const selectedProviderName =
        selectedProvider
            ? providers.find((p) => p.id === selectedProvider)?.name
            : null;

    const title = selectedProviderName
        ? `Courses from ${selectedProviderName}`
        : "All courses";

    return (
        <div className="mainpage">

            <button className="open-filter-button" onClick={() => setIsAsideOpen(true)}>
                Providers
            </button>

            <aside className={isAsideOpen ? 'is-open' : ''}>
                <button className="close-filter-button" onClick={() => setIsAsideOpen(false)}>
                    &times; close
                </button>

                <h3>Providers</h3>

                <section aria-label="Filter courses by provider">
                    <ul>
                        <li
                            onClick={() => handleProviderSelect(null)}
                            className={
                                selectedProvider === null
                                    ? "provider-item is-active"
                                    : "provider-item"
                            }
                        >
                            All providers
                        </li>

                        {providers.map((p) => (
                            <li
                                key={p.id}
                                onClick={() => handleProviderSelect(p.id)}
                                className={
                                    selectedProvider === p.id
                                        ? "provider-item is-active"
                                        : "provider-item"
                                }
                            >
                                {p.name}
                            </li>
                        ))}
                    </ul>

                </section>
            </aside>

            {isAsideOpen && <div className="overlay-backdrop" onClick={() => setIsAsideOpen(false)}></div>}

            <main role="main">
                <CourseList
                    courses={filteredCourses}
                    loading={loading}
                    error={error}
                    title={title}
                />
            </main>

        </div>

    );
};

export default MainPage;