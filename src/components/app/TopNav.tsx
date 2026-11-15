import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";
import { TABS } from "./BottomNav";

/** Computer/tablet menu bar. Phones use the bottom tab bar instead. */
export function TopNav() {
  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-surface/85 backdrop-blur-xl md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-8">
        <Link to="/" className="shrink-0 font-display text-xl font-extrabold uppercase tracking-wider lg:text-2xl">
          Fényszóró <span className="text-primary">Doki</span> Pétfürdő
        </Link>
        <nav aria-label="Fő navigáció (asztali)">
          <ul className="flex items-center gap-1">
            {TABS.map(({ to, label, icon: Icon, exact }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact }}
                  className="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-primary/15 data-[status=active]:text-primary"
                >
                  <Icon className="size-4" strokeWidth={2.2} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Button asChild variant="beam" size="sm" className="hidden lg:inline-flex">
          <a href={PHONE_TEL}>
            <Phone /> {PHONE_DISPLAY}
          </a>
        </Button>
      </div>
    </header>
  );
}
