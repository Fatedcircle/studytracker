export async function toggleLessonProgress(data) {
    const res = await fetch("http://localhost:3000/api/progress/toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to toggle progress");

    return res.json();
}
