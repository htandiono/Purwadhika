import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Mail, PencilLine, Plus, UserRound, X } from "lucide-react";
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
        <div className="form-title">
          <span className="section-icon" aria-hidden="true">
            {editingUser ? <PencilLine size={18} /> : <Plus size={18} />}
          </span>
          <div>
            <p className="panel-kicker">{editingUser ? `Record #${editingUser.id}` : "New record"}</p>
            <h2>{editingUser ? "Edit user" : "Create user"}</h2>
          </div>
        </div>
        {editingUser ? (
          <button className="icon-button soft" type="button" onClick={onCancelEdit} title="Cancel edit" aria-label="Cancel edit">
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="name">Name</label>
        <div className={`input-shell ${errors.name ? "input-error" : ""}`}>
          <UserRound size={18} aria-hidden="true" />
          <input id="name" type="text" placeholder="Jane Doe" {...register("name")} />
        </div>
        {errors.name ? <small>{errors.name.message}</small> : null}
      </div>

      <div className="field-group">
        <label htmlFor="email">Email</label>
        <div className={`input-shell ${errors.email ? "input-error" : ""}`}>
          <Mail size={18} aria-hidden="true" />
          <input
            id="email"
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="jane@example.com"
            {...register("email")}
          />
        </div>
        {errors.email ? <small>{errors.email.message}</small> : null}
      </div>

      {serverError ? <div className="alert">{serverError}</div> : null}

      <button className="button primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          "Saving..."
        ) : (
          <>
            {editingUser ? <Check size={18} /> : <Plus size={18} />}
            {editingUser ? "Update user" : "Create user"}
          </>
        )}
      </button>
    </form>
  );
}
