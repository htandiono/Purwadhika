import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">
        <Sidebar />
      </div>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/45" onClick={() => setIsMobileNavOpen(false)} />
          <div className="relative h-full w-72 max-w-[85vw] bg-white shadow-soft">
            <Button
              aria-label="Close navigation"
              className="absolute right-3 top-3 z-10"
              icon={<X className="h-4 w-4" />}
              onClick={() => setIsMobileNavOpen(false)}
              size="icon"
              variant="ghost"
            />
            <Sidebar />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <Header onMenuClick={() => setIsMobileNavOpen(true)} />
        <main className="px-4 py-5 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
