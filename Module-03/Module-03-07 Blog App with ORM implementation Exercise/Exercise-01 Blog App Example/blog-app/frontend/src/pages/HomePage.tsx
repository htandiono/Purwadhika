import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../api/postApi";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        const response = await getPosts(currentSearch);
        setPosts(response.data);
      } catch (loadError) {
        setError("Unable to load posts");
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, [currentSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    setCurrentSearch("");
  };

  return (
    <section className="page-stack">
      <div className="page-title-row">
        <div>
          <h1>Latest Blog Posts</h1>
          <p className="muted">Read what the community is writing today.</p>
        </div>

        {isAuthenticated && (
          <Link className="button" to="/posts/new">
            Create Post
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Search posts by content..." 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" className="button">Search</button>
        {currentSearch && (
          <button type="button" onClick={handleClear} className="button secondary">Clear</button>
        )}
      </form>

      {error && <p className="alert error">{error}</p>}
      {isLoading && <p className="muted">Loading posts...</p>}

      {!isLoading && posts.length === 0 && (
        <div className="empty-state">
          <h2>No posts found</h2>
          <p>{currentSearch ? `No posts matching "${currentSearch}".` : "Be the first person to write a blog post."}</p>
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
