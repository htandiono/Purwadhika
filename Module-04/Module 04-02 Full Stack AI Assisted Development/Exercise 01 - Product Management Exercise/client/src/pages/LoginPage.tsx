import { FormEvent, useState } from "react";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/products";

  if (!isLoading && isAuthenticated) {
    return <Navigate replace to="/products" />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to log in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-950">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">Access your product workspace.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error ? <Alert variant="error">{error}</Alert> : null}
          <Input
            autoComplete="email"
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
          <Input
            autoComplete="current-password"
            label="Password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
          <Button className="w-full" icon={<LogIn className="h-4 w-4" />} isLoading={isSubmitting} type="submit">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          No account?{" "}
          <Link className="font-medium text-blue-700 hover:text-blue-800" to="/register">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
