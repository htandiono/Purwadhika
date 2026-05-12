import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/postApi";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    content: "",
    imageUrl: "",
    isPublished: true
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      const response = await createPost(form);
      navigate(`/posts/${response.data.id}`);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="form-page wide">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Create Blog Post</h1>

        {error && <p className="alert error">{error}</p>}

        <label>
          Content
          <textarea
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            placeholder="Write your blog post"
            rows={8}
          />
        </label>

        <label>
          Image URL
          <input
            value={form.imageUrl}
            onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) => setForm({ ...form, isPublished: event.target.checked })}
          />
          Publish immediately
        </label>

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : form.isPublished ? "Publish Post" : "Save Draft"}
        </button>
      </form>
    </section>
  );
}
