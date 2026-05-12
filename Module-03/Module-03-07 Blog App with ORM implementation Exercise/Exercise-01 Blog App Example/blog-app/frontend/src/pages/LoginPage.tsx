import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
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
      const response = await loginRequest(form);
      login(response.data.token, response.data.user);

      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname || "/");
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Login</h1>

        {error && <p className="alert error">{error}</p>}

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
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="form-note">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  );
}
