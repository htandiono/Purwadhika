import type { Comment } from "../types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
}

interface CommentListProps {
  comments: Comment[];
  currentUserId?: number;
  onDelete: (commentId: number) => void;
}

export default function CommentList({
  comments,
  currentUserId,
  onDelete
}: CommentListProps) {
  if (comments.length === 0) {
    return <p className="muted">No comments yet.</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <article className="comment" key={comment.id}>
          <div className="comment-header">
            <strong>{comment.author.name}</strong>
            <span>{formatDate(comment.createdAt)}</span>
          </div>
          <p>{comment.content}</p>
          {currentUserId === comment.authorId && (
            <button
              className="button danger small"
              type="button"
              onClick={() => onDelete(comment.id)}
            >
              Delete
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
