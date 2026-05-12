import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../api/postApi";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export default function EditPostPage() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [form, setForm] = useState({
    content: "",
    imageUrl: "",
    isPublished: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPost() {
      if (!Number.isInteger(postId)) {
        setError("Invalid post ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getPostById(postId);
        setPost(response.data);
        setForm({
          content: response.data.content,
          imageUrl: response.data.imageUrl || "",
          isPublished: response.data.isPublished
        });
      } catch (loadError) {
        setError("Unable to load post");
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!post) {
      return;
    }

    setError("");

    try {
      setIsSubmitting(true);
      const response = await updatePost(post.id, form);
      navigate(`/posts/${response.data.id}`);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="muted">Loading post...</p>;
  }

  if (error && !post) {
    return <p className="alert error">{error}</p>;
  }

  if (!post) {
    return <p className="alert error">Post not found</p>;
  }

  if (currentUser?.id !== post.authorId) {
    return <p className="alert error">You can only edit your own blog posts.</p>;
  }

  return (
    <section className="form-page wide">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Edit Blog Post</h1>

        {error && <p className="alert error">{error}</p>}

        <label>
          Content
          <textarea
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            rows={8}
          />
        </label>

        <label>
          Image URL
          <input
            value={form.imageUrl}
            onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) => setForm({ ...form, isPublished: event.target.checked })}
          />
          Published
        </label>

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Post"}
        </button>
      </form>
    </section>
  );
}
