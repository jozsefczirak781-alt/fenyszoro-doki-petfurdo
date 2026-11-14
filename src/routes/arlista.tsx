import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { PRICE_LIST, formatHuf } from "@/lib/services";

export const Route = createFileRoute("/arlista")({
  head: () => ({
    meta: [
      { title: "Árlista – Fényszóró Doki Pétfürdő" },
      { name: "description", content: "Fényszóró búra felújítás gőzölős technológiával, kerámia védőbevonat és ózongenerátoros utastér-fertőtlenítés árai." },
      { property: "og:title", content: "Árlista – Fényszóró Doki Pétfürdő" },
      { property: "og:description", content: "Átlátható árak fényszóró-felújításra és javításra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PriceListPage,
});

function PriceListPage() {
  return (
    <main>
      <PageHeader eyebrow="Szolgáltatások" title="Árlista">
        A pontos árat a fényszóró állapota alapján, fotók segítségével mondjuk meg.
      </PageHeader>

      <div className="space-y-8 px-5">
        {PRICE_LIST.map((cat) => (
          <section key={cat.title}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">{cat.title}</h2>
            <ul className="space-y-3">
              {cat.items.map((item) => (
                <li
                  key={item.id}
                  className={
                    item.popular
                      ? "relative rounded-2xl border border-primary/40 bg-card-gradient p-4 shadow-glow"
                      : "relative rounded-2xl border border-border bg-card-gradient p-4 shadow-card"
                  }
                >
                  {item.popular && (
                    <span className="absolute -top-2.5 left-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
                      Legnépszerűbb
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold leading-snug">{item.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-2xl font-extrabold leading-none text-primary">
                        {formatHuf(item.price)}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {item.from ? "-tól / " : "/ "}
                        {item.unit}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="font-display text-xl font-bold uppercase">Nem biztos, mi kell?</p>
          <p className="mt-1 text-sm text-muted-foreground">Küldj fotót, és megmondjuk, melyik megoldás a jó az autódnak.</p>
          <div className="mt-4 flex gap-3">
            <Button asChild variant="beam" size="lg" className="flex-1">
              <Link to="/arajanlat">
                <Camera /> Árajánlat
              </Link>
            </Button>
            <Button asChild variant="surface" size="lg" className="flex-1">
              <a href={PHONE_TEL}>
                <Phone /> Hívás
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
