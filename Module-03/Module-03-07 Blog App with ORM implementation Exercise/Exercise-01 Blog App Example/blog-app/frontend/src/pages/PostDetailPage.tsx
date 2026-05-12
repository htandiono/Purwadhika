import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteComment as deleteCommentRequest } from "../api/commentApi";
import {
  createComment,
  deletePost,
  getPostById,
  likePost,
  unlikePost
} from "../api/postApi";
import CommentList from "../components/CommentList";
import { useAuth } from "../context/AuthContext";
import type { Comment, Post } from "../types";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
}

export default function PostDetailPage() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");

  const isAuthor = Boolean(currentUser && post && currentUser.id === post.authorId);
  const isLikedByCurrentUser = useMemo(() => {
    return Boolean(
      currentUser && post?.likes?.some((like) => like.userId === currentUser.id)
    );
  }, [currentUser, post]);

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
      } catch (loadError) {
        setError("Unable to load post");
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  async function handleLikeToggle() {
    if (!post) {
      return;
    }

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setError("");

    try {
      if (isLikedByCurrentUser) {
        const response = await unlikePost(post.id);
        setPost({
          ...post,
          likeCount: response.data.likeCount,
          likes: post.likes?.filter((like) => like.userId !== currentUser.id) || []
        });
        return;
      }

      const response = await likePost(post.id);
      setPost({
        ...post,
        likeCount: response.data.likeCount,
        likes: [...(post.likes || []), { userId: currentUser.id }]
      });
    } catch (likeError) {
      setError(getApiErrorMessage(likeError));
    }
  }

  async function handleAddComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!post) {
      return;
    }

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setCommentError("");

    try {
      const response = await createComment(post.id, { content: commentContent });
      setPost({
        ...post,
        comments: [...(post.comments || []), response.data],
        commentCount: post.commentCount + 1
      });
      setCommentContent("");
    } catch (submitError) {
      setCommentError(getApiErrorMessage(submitError));
    }
  }

  async function handleDeleteComment(commentId: number) {
    if (!post) {
      return;
    }

    try {
      await deleteCommentRequest(commentId);
      const nextComments = (post.comments || []).filter(
        (comment: Comment) => comment.id !== commentId
      );
      setPost({
        ...post,
        comments: nextComments,
        commentCount: Math.max(0, post.commentCount - 1)
      });
    } catch (deleteError) {
      setCommentError(getApiErrorMessage(deleteError));
    }
  }

  async function handleDeletePost() {
    if (!post || !window.confirm("Delete this blog post?")) {
      return;
    }

    try {
      await deletePost(post.id);
      navigate("/");
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError));
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

  return (
    <section className="page-stack">
      {error && <p className="alert error">{error}</p>}

      <article className="detail-post">
        {!post.isPublished && isAuthor && (
          <div className="alert warning" style={{ marginBottom: '1rem', padding: '0.5rem', background: '#fff3cd', color: '#856404', borderRadius: '4px' }}>
            <strong>Unpublished:</strong> This post is unpublished and not visible to the public.
          </div>
        )}

        <div className="post-meta">
          <Link to={`/users/${post.author.id}/posts`} className="author-link">
            {post.author.name}
          </Link>
          <span>{formatDate(post.createdAt)}</span>
        </div>

        <p className="post-content">{post.content}</p>

        {post.imageUrl && (
          <img className="detail-image" src={post.imageUrl} alt="Blog post visual" />
        )}

        <div className="detail-actions">
          <button className="button secondary" type="button" onClick={handleLikeToggle}>
            {isLikedByCurrentUser ? "Unlike" : "Like"} ({post.likeCount})
          </button>
          <span>{post.commentCount} comments</span>

          {isAuthor && (
            <>
              <Link className="button secondary" to={`/posts/${post.id}/edit`}>
                Edit
              </Link>
              <button className="button danger" type="button" onClick={handleDeletePost}>
                Delete
              </button>
            </>
          )}
        </div>
      </article>

      <section className="comments-section">
        <h2>Comments</h2>

        {isAuthenticated ? (
          <form className="comment-form" onSubmit={handleAddComment}>
            {commentError && <p className="alert error">{commentError}</p>}
            <textarea
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              placeholder="Write a comment"
              rows={4}
            />
            <button className="button" type="submit">
              Add Comment
            </button>
          </form>
        ) : (
          <p className="muted">
            <Link to="/login">Login</Link> to like posts or write comments.
          </p>
        )}

        <CommentList
          comments={post.comments || []}
          currentUserId={currentUser?.id}
          onDelete={handleDeleteComment}
        />
      </section>
    </section>
  );
}
