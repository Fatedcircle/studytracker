import { useState } from "react";
import { useForm } from "react-hook-form";

const RegisterPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [serverMessage, setServerMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerMessage(null);

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setServerMessage({ type: "success", text: `✅ User ${result.name} registered!` });
        reset();
      } else {
        setServerMessage({ type: "error", text: result.error || "Something did go wrong." });
      }
    } catch (error) {
      setServerMessage({ type: "error", text: "Server error with registering." });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h1>📝 Register</h1>
      <p>Make a new account to start.</p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            {...register("name", { required: "Name is required." })}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.2rem" }}
            placeholder="Bijv. Jan Jansen"
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "E-mail is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please provide a valid email.",
              },
            })}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.2rem" }}
            placeholder="Bijv. jan@example.com"
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {serverMessage && (
          <p style={{ color: serverMessage.type === "error" ? "red" : "green" }}>
            {serverMessage.text}
          </p>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;
