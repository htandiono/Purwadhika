import { InputHTMLAttributes, useId } from "react";
import { cn } from "../../utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ className, error, id, label, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="block text-sm font-medium text-slate-700" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        className={cn(
          "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-100",
          className
        )}
        id={inputId}
        {...props}
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
