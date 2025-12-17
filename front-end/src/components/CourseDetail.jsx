import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useCourseDetail } from "../hooks/useCourseDetail";

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const courseId = id;
    const [openChapterId, setOpenChapterId] = useState(null);
    const { course, chapters, lessons, loading, error } = useCourseDetail(courseId);

    if (loading)
        return (
            <p className="text-center text-body-base py-6 animate-pulse text-gray-600">
                ⏳ Loading...
            </p>
        );

    if (error)
        return (
            <p className="text-center text-red-600 text-body-base py-6">
                Error: {error}
            </p>
        );

    if (!course)
        return (
            <p className="text-center text-body-base py-6">No course found.</p>
        );

    const toggleChapter = (id) => {
        setOpenChapterId(openChapterId === id ? null : id);
    };

    return (
        <main className="w-full min-h-screen py-10">
            <div className="mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-7xl">

                <article className="lg:col-span-8">

                    <nav aria-label="Back navigation" className="mb-6">
                        <a
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-yellow hover:bg-pastel text-gray-800 rounded-button transition-bg"
                        >
                            ← Back to the overview
                        </a>
                    </nav>

                    <img
                        src={course.image_url}
                        alt={course.title}
                        className="
                            w-full 
                            max-w-3xl
                            max-h-[420px]
                            object-cover 
                            shadow-smooth
                            rounded-card
                            mx-auto
                            mb-6
                        "
                    />

                    <header>
                        <h1 className="text-heading-lg font-bold mb-4">{course.title}</h1>
                    </header>

                    <p className="text-body-lg text-gray-700 leading-relaxed mb-10">
                        {course.description}
                    </p>

                    <section aria-labelledby="chapters-title">
                        <h2 id="chapters-title" className="text-heading-sm font-semibold mb-4">
                            Chapters
                        </h2>

                        {chapters.length === 0 ? (
                            <p>No chapters found.</p>
                        ) : (
                            chapters.map((chapter) => (
                                <div key={chapter.id} className="mb-4 bg-white border border-gray-200 rounded-card shadow-sm overflow-hidden">

                                    <button
                                        className="w-full p-5 text-left bg-gray-50 hover:bg-gray-100 transition-bg flex justify-between items-center"
                                        onClick={() => toggleChapter(chapter.id)}
                                        aria-expanded={openChapterId === chapter.id}
                                    >
                                        <h3 className="text-body-lg font-semibold text-gray-800">
                                            {chapter.position ? `${chapter.position}. ` : ""}
                                            {chapter.title}
                                        </h3>
                                        <span className="text-gray-500">
                                            {openChapterId === chapter.id ? '−' : '+'}
                                        </span>
                                    </button>

                                    {openChapterId === chapter.id && (
                                        <ul className="p-5 space-y-3 bg-white">
                                            {lessons[chapter.id]?.length > 0 ? (
                                                lessons[chapter.id].map((lesson) => (
                                                    <li key={lesson.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                                                        <strong className="block text-body-base text-gray-700">{lesson.title}</strong>
                                                        {lesson.content && (
                                                            <p className="text-body-sm text-gray-500 mt-1">
                                                                {lesson.content}
                                                            </p>
                                                        )}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-gray-500 italic">No lessons in this chapter</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            ))
                        )}
                    </section>
                </article>
                <aside
                    className="
                        lg:col-span-4 lg:col-start-9
                        bg-yellow border border-yellow-darker rounded-card shadow-smooth h-fit p-5 
                    "
                    aria-label="Related courses"
                >
                    <h2 className="text-xl text-turquoise font-semibold mb-4">
                        Related Courses
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {[
                            { id: 101, title: "Advanced React", image_url: "https://picsum.photos/400/200" },
                            { id: 102, title: "React State Patterns", image_url: "https://picsum.photos/400/201" },
                            { id: 103, title: "JavaScript Deep Dive", image_url: "https://picsum.photos/400/202" },
                            { id: 104, title: "Frontend Architecture", image_url: "https://picsum.photos/400/203" },
                            { id: 105, title: "Intro to TypeScript", image_url: "https://picsum.photos/400/204" },
                        ]
                            .slice(0, 5)
                            .map((related) => (
                                <article
                                    key={related.id}
                                    className="
                                        bg-white border rounded-card shadow-sm 
                                        hover:shadow-smooth cursor-pointer
                                    "
                                >
                                    <img
                                        className="w-full h-24 object-cover rounded-t-card"
                                        src={related.image_url}
                                        alt={related.title}
                                    />
                                    <div className="p-3">
                                        <h3 className="font-semibold text-gray-800 text-sm mb-1">
                                            {related.title}
                                        </h3>
                                        <button className="text-xs text-turquoise hover:underline">
                                            View course →
                                        </button>
                                    </div>
                                </article>
                            ))}
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default CourseDetail;