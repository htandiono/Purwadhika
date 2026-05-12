import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserById, getUserPosts } from "../api/userApi";
import PostCard from "../components/PostCard";
import type { Post, User } from "../types";

export default function UserPostsPage() {
  const { id } = useParams();
  const userId = Number(id);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUserPosts() {
      if (!Number.isInteger(userId)) {
        setError("Invalid user ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [userResponse, postsResponse] = await Promise.all([
          getUserById(userId),
          getUserPosts(userId)
        ]);
        setUser(userResponse.data);
        setPosts(postsResponse.data);
      } catch (loadError) {
        setError("Unable to load user posts");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserPosts();
  }, [userId]);

  return (
    <section className="page-stack">
      <div className="page-title-row">
        <div>
          <h1>{user ? `${user.name}'s Posts` : "User Posts"}</h1>
          <p className="muted">{posts.length} blog posts</p>
        </div>
        <Link className="button secondary" to="/">
          Back Home
        </Link>
      </div>

      {error && <p className="alert error">{error}</p>}
      {isLoading && <p className="muted">Loading posts...</p>}

      {!isLoading && posts.length === 0 && (
        <div className="empty-state">
          <h2>No posts found</h2>
          <p>This user has not written any blog posts yet.</p>
        </div>
      )}

      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
