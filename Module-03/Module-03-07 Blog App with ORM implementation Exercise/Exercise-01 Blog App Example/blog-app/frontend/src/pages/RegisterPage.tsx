import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      await register(form);
      navigate("/login");
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>

        {error && <p className="alert error">{error}</p>}

        <label>
          Name
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Your name"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Your password"
          />
        </label>

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Register"}
        </button>

        <p className="form-note">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}
