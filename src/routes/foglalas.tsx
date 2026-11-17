import { createFileRoute } from "@tanstack/react-router";
import { Clock, Phone } from "lucide-react";
import { PageHeader, Section } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { ALL_SERVICES, formatHuf } from "@/lib/services";
import { OPENING_HOURS } from "@/lib/schedule";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";
import { pageUrlTags } from "@/lib/site";

export const Route = createFileRoute("/foglalas")({
  head: () => {
    const url = pageUrlTags("/foglalas");
    const title = "Időpont fényszóró felújításra Pétfürdő, Várpalota – Fényszóró Doki";
    const description = `Időpont fényszóró gőzölésre és búra felújításra telefonon: ${PHONE_DISPLAY}. Pétfürdő, Várpalota mellett, minden nap 8:00–17:00.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...url.meta,
      ],
      links: url.links,
    };
  },
  component: BookingPage,
});

function BookingPage() {
  return (
    <main>
      <PageHeader eyebrow="Telefonon" title="Foglalás">
        Időpontot telefonon tudsz foglalni. Hívj minket, és együtt kiválasztjuk a neked megfelelő napot.
      </PageHeader>

      <div className="space-y-8 px-5 md:grid md:grid-cols-2 md:items-start md:gap-10 md:space-y-0 md:px-8">
        <div className="rounded-3xl border border-border bg-card-gradient p-6 text-center shadow-card animate-rise md:sticky md:top-24 md:p-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-beam shadow-glow">
            <Phone className="size-7 text-primary-foreground" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Hívj minket</p>
          <a href={PHONE_TEL} className="mt-1 block font-display text-4xl font-extrabold tracking-wide text-foreground">
            {PHONE_DISPLAY}
          </a>
          <Button asChild variant="beam" size="xl" className="mt-5 w-full beam-sweep">
            <a href={PHONE_TEL}>
              <Phone /> Hívás most
            </a>
          </Button>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4 text-primary" />
            {OPENING_HOURS.map((o) => (
              <span key={o.days}>
                {o.days}: <span className="font-semibold text-foreground">{o.hours}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-8">
        <Section title="Mit mondj a telefonban?">
          <ul className="space-y-2 text-sm">
            {["Melyik szolgáltatást kéred", "Milyen autóról van szó (márka, típus)", "Mikor lenne jó neked"].map((t, i) => (
              <li key={t} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Szolgáltatások">
          <ul className="space-y-2">
            {ALL_SERVICES.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                <span className="text-sm font-semibold">{s.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatHuf(s.price)}
                  {s.from ? "-tól" : ""}
                </span>
              </li>
            ))}
          </ul>
        </Section>
        </div>
      </div>
    </main>
  );
}
