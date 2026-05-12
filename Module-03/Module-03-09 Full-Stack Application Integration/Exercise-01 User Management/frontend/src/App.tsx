import axios from "axios";
import { AlertCircle, Database, RefreshCw, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { createUser, deleteUser, getUsers, updateUser, type User } from "./api/users";
import { UserForm } from "./components/UserForm";
import { UserList } from "./components/UserList";
import type { UserFormData } from "./validations/user.validation";
import "./styles.css";

const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Request failed. Please try again.";
  }

  return "Something went wrong. Please try again.";
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");

  const loadUsers = async () => {
    setPageError("");
    setIsLoading(true);

    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setPageError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleSubmit = async (data: UserFormData) => {
    setFormError("");
    setIsSubmitting(true);

    try {
      if (editingUser) {
        await updateUser(editingUser.id, data);
      } else {
        await createUser(data);
      }

      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setPageError("");

    try {
      await deleteUser(id);

      if (editingUser?.id === id) {
        setEditingUser(null);
      }

      await loadUsers();
    } catch (error) {
      setPageError(getApiErrorMessage(error));
    }
  };

  return (
    <main className="app-shell">
      <section className="content">
        <header className="topbar">
          <div className="brand-block">
            <div className="brand-mark" aria-hidden="true">
              <UsersRound size={28} strokeWidth={2.2} />
            </div>
            <div>
              <p className="eyebrow">Directory Console</p>
              <h1>User Management</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <span className={`status-pill ${pageError ? "status-warning" : "status-ready"}`}>
              <span aria-hidden="true" />
              {pageError ? "API attention" : "API ready"}
            </span>
            <button className="icon-button" type="button" onClick={loadUsers} title="Refresh users" aria-label="Refresh users">
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        {pageError ? (
          <div className="alert page-alert">
            <AlertCircle size={18} />
            <span>{pageError}</span>
          </div>
        ) : null}

        <div className="workspace">
          <UserForm
            editingUser={editingUser}
            isSubmitting={isSubmitting}
            serverError={formError}
            onCancelEdit={() => {
              setEditingUser(null);
              setFormError("");
            }}
            onSubmit={handleSubmit}
          />

          <section className="users-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Records</p>
                <h2>Users</h2>
              </div>
              <span className="count-pill">
                <Database size={15} />
                {users.length} total
              </span>
            </div>
            <UserList users={users} isLoading={isLoading} onEdit={setEditingUser} onDelete={handleDelete} />
          </section>
        </div>
      </section>
    </main>
  );
}

export default App;
