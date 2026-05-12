import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { userSchema, type UserFormData } from "../validations/user.validation";
import type { User } from "../api/users";

type UserFormProps = {
  editingUser: User | null;
  isSubmitting: boolean;
  serverError: string;
  onCancelEdit: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
};

export function UserForm({ editingUser, isSubmitting, serverError, onCancelEdit, onSubmit }: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  });

  useEffect(() => {
    reset({
      name: editingUser?.name ?? "",
      email: editingUser?.email ?? ""
    });
  }, [editingUser, reset]);

  const submitForm = async (data: UserFormData) => {
    await onSubmit(data);

    if (!editingUser) {
      reset({
        name: "",
        email: ""
      });
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit(submitForm)}>
      <div className="form-header">
        <div>
          <h2>{editingUser ? "Edit user" : "Create user"}</h2>
          <p>{editingUser ? `Updating #${editingUser.id}` : "Add a PostgreSQL-backed user."}</p>
        </div>
        {editingUser ? (
          <button className="button ghost" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        ) : null}
      </div>

      <label>
        <span>Name</span>
        <input type="text" placeholder="Jane Doe" {...register("name")} />
        {errors.name ? <small>{errors.name.message}</small> : null}
      </label>

      <label>
        <span>Email</span>
        <input type="text" inputMode="email" autoComplete="email" placeholder="jane@example.com" {...register("email")} />
        {errors.email ? <small>{errors.email.message}</small> : null}
      </label>

      {serverError ? <div className="alert">{serverError}</div> : null}

      <button className="button primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : editingUser ? "Update user" : "Create user"}
      </button>
    </form>
  );
}
