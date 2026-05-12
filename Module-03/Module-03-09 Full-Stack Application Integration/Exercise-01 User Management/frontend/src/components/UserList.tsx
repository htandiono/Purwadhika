import type { User } from "../api/users";

type UserListProps = {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
};

export function UserList({ users, isLoading, onEdit, onDelete }: UserListProps) {
  if (isLoading) {
    return <div className="state">Loading users...</div>;
  }

  if (users.length === 0) {
    return <div className="state">No users yet.</div>;
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <article className="user-row" key={user.id}>
          <div>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <div className="row-actions">
            <button className="button ghost" type="button" onClick={() => onEdit(user)}>
              Edit
            </button>
            <button className="button danger" type="button" onClick={() => onDelete(user.id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
