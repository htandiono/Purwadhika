import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-950">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">The page you requested does not exist.</p>
        <Link
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          to="/products"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
