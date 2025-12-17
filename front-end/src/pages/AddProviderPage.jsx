import { useState } from "react";
import { useForm } from "react-hook-form";

const AddProviderPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:3000/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Cannot add provider");

      setMessage({ type: "success", text: `✅ Provider "${result.name}" added!` });
      reset();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex justify-center">
      <main className="p-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4">🏷️ Add a new provider</h1>
        <p className="mb-6 text-gray-600">Add a new provider of education (e.g. Udemy or Coursera).</p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 border border-gray-300 bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="Bijv. Udemy"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              id="website"
              {...register("website")}
              placeholder="https://udemy.com"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-mint text-white font-semibold border-none rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {loading ? "Saving..." : "Add provider"}
          </button>

          {message && (
            <p
              className={`font-bold p-3 rounded-md ${message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
                }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </main>
    </div>
  );
};

export default AddProviderPage;