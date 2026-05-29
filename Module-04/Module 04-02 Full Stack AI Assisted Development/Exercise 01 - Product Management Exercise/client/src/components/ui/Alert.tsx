import { ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "../../utils/cn";

type AlertProps = {
  children: ReactNode;
  variant?: "error" | "success" | "info";
};

const styles = {
  error: "border-rose-200 bg-rose-50 text-rose-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-slate-200 bg-white text-slate-700"
};

export function Alert({ children, variant = "info" }: AlertProps) {
  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div className={cn("flex items-start gap-2 rounded-md border px-3 py-2 text-sm", styles[variant])}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
