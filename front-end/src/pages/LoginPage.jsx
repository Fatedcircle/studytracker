import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverMessage, setServerMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email }) => {
    setLoading(true);
    setServerMessage(null);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.id);
        navigate("/profile");
      } else {
        setServerMessage({ type: "error", text: data.error || "Login failed" });
      }
    } catch (err) {
      setServerMessage({ type: "error", text: "Server error while loggin in" });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>🔑 Login</h1>
      <p>Fill in your email adress to login.</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="bijv. jan@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please put in a valid email",
              },
            })}
            style={{ width: "100%", padding: "0.5rem" }}
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
          {loading ? "Logging in..." : "Login"}
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

export default LoginPage;
