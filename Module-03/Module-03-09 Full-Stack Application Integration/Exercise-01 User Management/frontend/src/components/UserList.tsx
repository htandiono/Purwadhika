import { Mail, PencilLine, Trash2, UserRound } from "lucide-react";
import type { User } from "../api/users";

type UserListProps = {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
};

export function UserList({ users, isLoading, onEdit, onDelete }: UserListProps) {
  if (isLoading) {
    return (
      <div className="state loading-state">
        <span aria-hidden="true" />
        Loading users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="state empty-state">
        <UserRound size={30} />
        <strong>No users yet.</strong>
      </div>
    );
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <article className="user-row" key={user.id}>
          <div className="user-meta">
            <div className="avatar" aria-hidden="true">
              {user.name.trim().charAt(0).toUpperCase() || "U"}
            </div>
            <div className="user-copy">
              <strong>{user.name}</strong>
              <span>
                <Mail size={14} aria-hidden="true" />
                {user.email}
              </span>
            </div>
          </div>
          <div className="row-actions">
            <button
              className="icon-button soft"
              type="button"
              onClick={() => onEdit(user)}
              title={`Edit ${user.name}`}
              aria-label={`Edit ${user.name}`}
            >
              <PencilLine size={17} />
            </button>
            <button
              className="icon-button danger"
              type="button"
              onClick={() => onDelete(user.id)}
              title={`Delete ${user.name}`}
              aria-label={`Delete ${user.name}`}
            >
              <Trash2 size={17} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
