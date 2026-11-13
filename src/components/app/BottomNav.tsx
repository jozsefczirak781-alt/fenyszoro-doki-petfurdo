import { Link } from "@tanstack/react-router";
import { CalendarCheck, Camera, Home, ReceiptText } from "lucide-react";

const TABS = [
  { to: "/", label: "Főoldal", icon: Home, exact: true },
  { to: "/arajanlat", label: "Árajánlat", icon: Camera, exact: false },
  { to: "/arlista", label: "Árlista", icon: ReceiptText, exact: false },
  { to: "/foglalas", label: "Foglalás", icon: CalendarCheck, exact: false },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Fő navigáció"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-surface/85 pb-safe backdrop-blur-xl"
    >
      <ul className="grid grid-cols-4">
        {TABS.map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="group flex flex-col items-center gap-1 pt-2.5 pb-1 text-[11px] font-semibold text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <span className="relative flex h-8 w-14 items-center justify-center rounded-full transition-all group-data-[status=active]:bg-primary/15">
                <Icon className="size-5" strokeWidth={2.2} />
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
