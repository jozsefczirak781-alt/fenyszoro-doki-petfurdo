import { useCallback, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

/**
 * Draggable before/after comparison slider.
 * The "after" image is the base layer; the "before" image is clipped from the left.
 * Works with touch, mouse and keyboard (arrow keys).
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const stopDragging = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 4));
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Előtte–utána összehasonlító csúszka"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onKeyDown={onKeyDown}
      className="relative aspect-[4/3] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-border shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* After (base layer) */}
      <img src={after} alt={afterAlt} width={1024} height={768} loading="lazy" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {/* Before (clipped layer) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt={beforeAlt} width={1024} height={768} loading="lazy" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      </div>

      {/* Divider line + handle */}
      <div className="absolute inset-y-0 w-0.5 bg-primary shadow-glow" style={{ left: `${pos}%` }} />
      <div
        className="absolute top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-beam text-primary-foreground shadow-glow"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight className="size-5" strokeWidth={2.5} />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase text-accent-foreground">
        Előtte
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase text-primary-foreground">
        Utána
      </span>
    </div>
  );
}
