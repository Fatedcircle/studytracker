export default function ChapterEditor({
  chapter,
  chapterIndex,
  updateChapter,
  addLesson,
  removeLesson,
  removeChapter
}) {

  const handleChapterChange = (event) => {
    const { name, value } = event.target;
    updateChapter(chapterIndex, name, value);
  };

  const handleLessonChange = (event, lessonIndex) => {
    const { name, value } = event.target;
    updateChapter(chapterIndex, `lessons.${lessonIndex}.${name}`, value);
  };

  return (
    <div className="border border-gray-300 bg-white rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Chapter {chapterIndex + 1}</h3>

      <div className="space-y-1">
        <label htmlFor={`chapter-title-${chapterIndex}`} className="font-medium text-gray-700">Title *</label>
        <input
          id={`chapter-title-${chapterIndex}`}
          name="title"
          value={chapter.title}
          onChange={handleChapterChange}
          placeholder="E.g. Introduction to React"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mint focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor={`chapter-description-${chapterIndex}`} className="font-medium text-gray-700">Description</label>
        <textarea
          id={`chapter-description-${chapterIndex}`}
          name="description"
          value={chapter.description}
          onChange={handleChapterChange}
          rows={2}
          placeholder="What does this chapter cover?"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mint focus:outline-none"
        />
      </div>

      <h4 className="text-md font-semibold text-gray-700">📖 Lessons</h4>

      <div className="space-y-3">
        {chapter.lessons.map((lesson, lsIndex) => (
          <div key={lesson.id || lsIndex} className="bg-gray-50 p-4 rounded-lg border space-y-3">
            <div className="space-y-1">
              <label htmlFor={`lesson-title-${chapterIndex}-${lsIndex}`} className="font-medium text-gray-700">Lesson title *</label>
              <input
                id={`lesson-title-${chapterIndex}-${lsIndex}`}
                name="title"
                value={lesson.title}
                onChange={(e) => handleLessonChange(e, lsIndex)}
                placeholder="E.g. JSX Introduction"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mint focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor={`lesson-content-${chapterIndex}-${lsIndex}`} className="font-medium text-gray-700">Lesson content</label>
              <textarea
                id={`lesson-content-${chapterIndex}-${lsIndex}`}
                name="content"
                value={lesson.content}
                onChange={(e) => handleLessonChange(e, lsIndex)}
                rows={2}
                placeholder="Lesson content..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mint focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => removeLesson(chapterIndex, lsIndex)}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
            >
              🗑️ Remove lesson
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => addLesson(chapterIndex)}
          className="bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300 transition"
        >
          ➕ Add lesson
        </button>

        <button
          type="button"
          onClick={() => removeChapter(chapterIndex)}
          className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition"
        >
          🗑️ Remove chapter
        </button>
      </div>
    </div>
  );
}