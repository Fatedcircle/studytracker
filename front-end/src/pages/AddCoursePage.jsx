import { useEffect, useState } from "react";
import ChapterEditor from "../components/ChapterEditor";

export default function AddCoursePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "/images/placeholder.png",
    provider_id: "",
    chapters: [
      { id: Date.now() + 1, title: "", description: "", lessons: [{ id: Date.now() + 2, title: "", content: "" }] },
    ],
  });

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/providers")
      .then((res) => res.json())
      .then(setProviders)
      .catch((err) => console.error("❌ Cannot fetch providers:", err));
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateNestedField = (chapterIndex, fieldName, value) => {
    setFormData(prev => {
      const newChapters = [...prev.chapters];
      if (!fieldName.includes('.')) {
        // Directe velden (title, description)
        newChapters[chapterIndex] = { ...newChapters[chapterIndex], [fieldName]: value };
      } else {
        // Geneste velden (lessons.index.title/content)
        const parts = fieldName.split('.');
        const lessonIndex = parseInt(parts[1]);
        const subFieldName = parts[2];
        const updatedLessons = [...newChapters[chapterIndex].lessons];
        updatedLessons[lessonIndex] = { ...updatedLessons[lessonIndex], [subFieldName]: value };
        newChapters[chapterIndex] = { ...newChapters[chapterIndex], lessons: updatedLessons };
      }
      return { ...prev, chapters: newChapters };
    });
  };

  const addLesson = (chapterIndex) => {
    setFormData(prev => {
      const newChapters = [...prev.chapters];
      newChapters[chapterIndex].lessons.push({ id: Date.now(), title: "", content: "" });
      return { ...prev, chapters: [...newChapters] };
    });
  };

  const removeLesson = (chapterIndex, lessonIndex) => {
    setFormData(prev => {
      const newChapters = [...prev.chapters];
      newChapters[chapterIndex].lessons.splice(lessonIndex, 1);
      return { ...prev, chapters: [...newChapters] };
    });
  };

  const addChapter = () => {
    const newChapter = { id: Date.now(), title: "", description: "", lessons: [{ id: Date.now() + 1, title: "", content: "" }] };
    setFormData(prev => ({ ...prev, chapters: [...prev.chapters, newChapter] }));
  };

  const removeChapter = (chapterIndex) => {
    setFormData(prev => {
      const newChapters = [...prev.chapters];
      newChapters.splice(chapterIndex, 1);
      return { ...prev, chapters: newChapters };
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const response = await fetch("http://localhost:3000/courses/full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Cannot make the course");

      setMsg({ type: "success", text: "✅ Course succesfully added!" });
      setFormData({
        title: "", description: "", image_url: "", provider_id: "",
        chapters: [{ id: Date.now(), title: "", description: "", lessons: [{ id: Date.now() + 1, title: "", content: "" }] }],
      });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex justify-center">
      <main className="w-full max-w-4xl mx-auto p-6 ">

        <h1 className="text-3xl font-bold text-gray-900 mb-6">📘 Add a new course</h1>

        <form onSubmit={onSubmit} className="border border-gray-300 bg-white rounded-xl p-6 shadow-sm space-y-4">

          <div>
            <label className="font-medium text-gray-700" htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="E.g. React Fundamentals"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mint focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-medium text-gray-700" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mint focus:outline-none"
            />
          </div>

          <input
            type="hidden"
            id="image_url"
            name="image_url"
            value={formData.image_url}
          />

          <div>
            <label className="font-medium text-gray-700">Course Image</label>

            <div className="mt-2">
              <img
                src={formData.image_url || "/images/placeholder.png"}
                alt="Course preview"
                className="w-full h-40 object-cover rounded-lg border shadow-sm bg-gray-100"
              />
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Using default image <strong>placeholder.png</strong>
            </p>
          </div>




          <div className="space-y-2">
            <label className="font-medium text-gray-700" htmlFor="provider_id">
              Provider <span className="text-red-600">*</span>
            </label>

            <select
              id="provider_id"
              name="provider_id"
              value={formData.provider_id}
              onChange={handleFormChange}
              required
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none transition
      ${formData.provider_id === ""
                  ? "border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-mint"}
    `}
            >
              <option value="">-- Choose provider --</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {formData.provider_id === "" && (
              <p className="text-sm text-red-600">A provider selection is required.</p>
            )}
          </div>
          <div>
            <a href="/new-provider" className="px-4 py-2 bg-yellow hover:bg-pastel text-gray-800 rounded-button transition-bg">
              ➕ Add new provider
            </a>
          </div>
          <hr />
          <h2 className="text-2xl font-semibold text-gray-900">📚 Chapters</h2>

          <div className="space-y-6">
            {formData.chapters.map((chapter, index) => (
              <ChapterEditor
                key={chapter.id}
                chapter={chapter}
                chapterIndex={index}
                updateChapter={updateNestedField}
                addLesson={addLesson}
                removeLesson={removeLesson}
                removeChapter={removeChapter}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addChapter}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ➕ Add new chapter
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-turquoise text-white py-3 rounded-lg font-medium hover:bg-mint transition"
          >
            {loading ? "Saving..." : "Save course"}
          </button>

          {msg && (
            <p
              className={`text-lg font-semibold ${msg.type === "error" ? "text-red-600" : "text-green-600"
                }`}
            >
              {msg.text}
            </p>
          )}
        </form>
      </main>
    </div >
  );
}