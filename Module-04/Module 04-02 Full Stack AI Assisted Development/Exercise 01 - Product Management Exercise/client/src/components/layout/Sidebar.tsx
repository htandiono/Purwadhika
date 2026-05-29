import { NavLink } from "react-router-dom";
import { BarChart3, Boxes, LayoutDashboard, Package2, Settings, Users } from "lucide-react";
import { cn } from "../../utils/cn";

const secondaryItems = [
  { label: "Analytics", icon: BarChart3 },
  { label: "Suppliers", icon: Users },
  { label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-72 shrink-0 overflow-hidden border-r border-slate-200 bg-white">
      <div className="flex w-14 flex-col items-center gap-3 bg-blue-700 py-4 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
          <Package2 className="h-5 w-5" aria-hidden="true" />
        </div>
        {[LayoutDashboard, Boxes, BarChart3, Settings].map((Icon, index) => (
          <button
            aria-label={`Sidebar shortcut ${index + 1}`}
            className="flex h-9 w-9 items-center justify-center rounded-md text-blue-100 transition hover:bg-white/10 hover:text-white"
            key={index}
            type="button"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-slate-200 px-5 py-4">
        <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-950">Product Manager</p>
            <p className="truncate text-xs font-medium text-slate-500">Inventory analytics</p>
        </div>
      </div>

        <div className="px-4 py-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-normal text-blue-700">Catalog</p>
            <p className="mt-1 text-sm text-slate-600">Products, stock, pricing, and status.</p>
          </div>
        </div>

        <nav className="space-y-1 px-3">
        <NavLink
          className={({ isActive }) =>
            cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold transition",
                isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            )
          }
          to="/products"
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Product overview
        </NavLink>
      </nav>

        <div className="mt-6 border-t border-slate-100 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-normal text-slate-400">Workspace</p>
          <div className="mt-3 space-y-2">
            {secondaryItems.map((item) => (
              <div className="flex items-center gap-3 text-sm text-slate-500" key={item.label}>
                <item.icon className="h-4 w-4 text-blue-500" aria-hidden="true" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
