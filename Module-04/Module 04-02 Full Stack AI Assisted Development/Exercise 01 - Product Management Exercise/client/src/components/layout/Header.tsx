import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const { logout, user } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          aria-label="Open navigation"
          className="lg:hidden"
          icon={<Menu className="h-4 w-4" />}
          onClick={onMenuClick}
          size="icon"
          variant="ghost"
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-normal text-blue-600">Dashboard</p>
          <h1 className="truncate text-base font-semibold text-slate-950">Product Management</h1>
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden min-w-0 text-right sm:block">
          <p className="truncate text-sm font-medium text-slate-950">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
        </div>
        <Button
          aria-label="Log out"
          icon={<LogOut className="h-4 w-4" />}
          onClick={logout}
          size="icon"
          title="Log out"
          variant="secondary"
        />
      </div>
    </header>
  );
}
