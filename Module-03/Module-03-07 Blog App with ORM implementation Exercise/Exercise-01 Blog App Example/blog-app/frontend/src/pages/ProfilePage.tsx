import { FormEvent, useState } from "react";
import { updateUser } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export default function ProfilePage() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentUser) {
      return;
    }

    setMessage("");
    setError("");

    try {
      setIsSubmitting(true);
      const response = await updateUser(currentUser.id, form);
      updateCurrentUser(response.data);
      setMessage("Profile updated successfully");
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!currentUser) {
    return null;
  }

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Your Profile</h1>

        <div className="profile-summary">
          <p>
            <strong>User ID:</strong> {currentUser.id}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
              new Date(currentUser.createdAt)
            )}
          </p>
        </div>

        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}

        <label>
          Name
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
