import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { GALLERY, type GalleryPair } from "@/lib/gallery";
import { cn } from "@/lib/utils";

/**
 * Before/after pairs side by side. Tapping a pair opens a large view with an
 * Előtte/Utána switch — no dragging, so page scrolling on phones is never blocked.
 */
export function BeforeAfterGallery() {
  const [open, setOpen] = useState<GalleryPair | null>(null);
  const hasSamples = GALLERY.some((g) => g.sample);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        {GALLERY.map((pair) => (
          <button
            key={pair.id}
            type="button"
            onClick={() => setOpen(pair)}
            aria-label={`${pair.title} – nagyítás`}
            className="group block w-full min-w-0 rounded-2xl border border-border bg-card-gradient p-2 text-left shadow-card transition-transform active:scale-[0.99] md:hover:border-primary/40"
          >
            <div className="grid grid-cols-2 gap-2">
              <Shot src={pair.before} alt={pair.beforeAlt} label="Előtte" tone="accent" />
              <Shot src={pair.after} alt={pair.afterAlt} label="Utána" tone="primary" />
            </div>
            <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
              <p className="min-w-0 truncate font-semibold">{pair.title}</p>
              <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary">
                <Maximize2 className="size-3.5" /> Nagyítás
              </span>
            </div>
          </button>
        ))}
      </div>
      {hasSamples && (
        <p className="mt-3 text-xs text-muted-foreground">
          A jelenlegi képek szemléltető illusztrációk. A saját munkáink fotói hamarosan felkerülnek ide.
        </p>
      )}
      {open && <Viewer pair={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function Shot({ src, alt, label, tone }: { src: string; alt: string; label: string; tone: "accent" | "primary" }) {
  return (
    <figure className="relative overflow-hidden rounded-xl">
      <img src={src} alt={alt} width={1024} height={768} loading="lazy" className="aspect-[4/3] w-full object-cover" />
      <figcaption
        className={cn(
          "absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase",
          tone === "accent" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        {label}
      </figcaption>
    </figure>
  );
}

function Viewer({ pair, onClose }: { pair: GalleryPair; onClose: () => void }) {
  const [side, setSide] = useState<"before" | "after">("after");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={pair.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur animate-rise"
      onClick={onClose}
    >
      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate font-display text-xl font-bold uppercase">{pair.title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Bezárás"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-card">
          <img
            src={side === "before" ? pair.before : pair.after}
            alt={side === "before" ? pair.beforeAlt : pair.afterAlt}
            width={1024}
            height={768}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-surface p-1.5" role="group" aria-label="Összehasonlítás">
          {(["before", "after"] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={side === s}
              onClick={() => setSide(s)}
              className={cn(
                "h-12 rounded-xl text-sm font-bold uppercase transition-colors",
                side === s
                  ? s === "before"
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              {s === "before" ? "Előtte" : "Utána"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
