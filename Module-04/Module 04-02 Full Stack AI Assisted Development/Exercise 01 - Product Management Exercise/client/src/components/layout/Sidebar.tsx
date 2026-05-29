import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package2 } from "lucide-react";
import { cn } from "../../utils/cn";

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
          <Package2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">Product Manager</p>
          <p className="truncate text-xs text-slate-500">Inventory operations</p>
        </div>
      </div>
      <nav className="space-y-1 p-3">
        <NavLink
          className={({ isActive }) =>
            cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition",
              isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            )
          }
          to="/products"
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          Products
        </NavLink>
      </nav>
    </aside>
  );
}
