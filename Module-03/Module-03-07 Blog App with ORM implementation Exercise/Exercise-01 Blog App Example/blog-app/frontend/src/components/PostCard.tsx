import { Link } from "react-router-dom";
import type { Post } from "../types";
import { useAuth } from "../context/AuthContext";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
}

function createPreview(content: string) {
  return content.length > 180 ? `${content.slice(0, 180)}...` : content;
}

export default function PostCard({ post }: { post: Post }) {
  const { currentUser } = useAuth();

  return (
    <article className="post-card">
      <div className="post-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Link to={`/users/${post.author.id}/posts`} className="author-link">
          {post.author.name}
        </Link>
        <span>{formatDate(post.createdAt)}</span>
        {!post.isPublished && currentUser?.id === post.authorId && (
          <span style={{ marginLeft: 'auto', background: '#ffd700', color: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            Unpublished
          </span>
        )}
      </div>

      <p className="post-preview">{createPreview(post.content)}</p>

      {post.imageUrl && (
        <img className="post-image" src={post.imageUrl} alt="Blog post visual" />
      )}

      <div className="post-footer">
        <span>{post.likeCount} likes</span>
        <span>{post.commentCount} comments</span>
        <Link className="button secondary small" to={`/posts/${post.id}`}>
          Read More
        </Link>
      </div>
    </article>
  );
}
