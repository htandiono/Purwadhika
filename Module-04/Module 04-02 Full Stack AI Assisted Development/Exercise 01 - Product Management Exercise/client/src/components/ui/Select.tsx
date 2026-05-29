import { SelectHTMLAttributes, useId } from "react";
import { cn } from "../../utils/cn";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
};

export function Select({ className, error, id, label, options, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="block text-sm font-medium text-slate-700" htmlFor={selectId}>
          {label}
        </label>
      ) : null}
      <select
        className={cn(
          "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-100",
          className
        )}
        id={selectId}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
