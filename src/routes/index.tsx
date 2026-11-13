import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Camera, Clock, ReceiptText, ShieldCheck, Sparkles, Timer } from "lucide-react";
import heroImg from "@/assets/hero-headlight.jpg";
import beforeAfterImg from "@/assets/before-after.jpg";
import { Button } from "@/components/ui/button";
import { OPENING_HOURS } from "@/lib/schedule";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fényszóró Doki Pétfürdő – Újra tiszta fényszórók" },
      {
        name: "description",
        content: "Sárgult, matt vagy párás fényszóró? Kérj árajánlatot egy fotóval, nézd meg az árlistát, és foglalj időpontot.",
      },
      { property: "og:title", content: "Fényszóró Doki Pétfürdő – Újra tiszta fényszórók" },
      {
        property: "og:description",
        content: "Fényszóró-felújítás: árajánlat fotó alapján, átlátható árak, online időpontfoglalás.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const QUICK = [
  { to: "/arajanlat", icon: Camera, title: "Árajánlat", text: "Fotózd le, mi árazzuk" },
  { to: "/arlista", icon: ReceiptText, title: "Árlista", text: "Átlátható árak" },
] as const;

const STEPS = [
  { icon: Camera, title: "Fotózd le", text: "Küldj 1–6 képet a fényszóróról az appban." },
  { icon: Sparkles, title: "Megkapod az ajánlatot", text: "Átnézzük a képeket, és visszahívunk az árral." },
  { icon: CalendarCheck, title: "Gyere be", text: "Foglalj időpontot – a legtöbb munka pár óra alatt kész." },
];

function Index() {
  return (
    <main>
      <section className="relative h-[78vh] min-h-[520px] overflow-hidden">
        <img
          src={heroImg}
          alt="Felújított, tisztán világító autó fényszóró"
          width={1024}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-fade" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5">
          <span className="font-display text-xl font-extrabold uppercase tracking-wider">
            Fényszóró <span className="text-primary">Doki</span> Pétfürdő
          </span>
          <span className="rounded-full border border-border bg-background/50 px-3 py-1 text-[11px] font-semibold backdrop-blur">
            Fényszóró-műhely
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-6 animate-rise">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Fényszóró-felújítás</p>
          <h1 className="mt-2 text-[3.4rem] font-extrabold uppercase leading-[0.9]">
            Újra <span className="text-beam">tiszta</span>
            <br />
            fény.
          </h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Sárgult, matt vagy párás fényszóró? Küldj egy fotót, és megmondjuk, mennyiből lesz újra olyan, mint az új.
          </p>
          <div className="mt-5 flex gap-3">
            <Button asChild variant="beam" size="xl" className="flex-1 beam-sweep">
              <Link to="/arajanlat">
                <Camera /> Árajánlatot kérek
              </Link>
            </Button>
            <Button asChild variant="surface" size="xl" aria-label="Időpontfoglalás">
              <Link to="/foglalas">
                <CalendarCheck />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 px-5 pt-2">
        {QUICK.map(({ to, icon: Icon, title, text }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-border bg-card-gradient p-4 shadow-card transition-transform active:scale-[0.98]"
          >
            <Icon className="size-6 text-primary" />
            <p className="mt-3 font-display text-xl font-bold uppercase">{title}</p>
            <p className="text-xs text-muted-foreground">{text}</p>
          </Link>
        ))}
      </section>

      <section className="px-5 pt-10">
        <h2 className="text-2xl font-extrabold uppercase">Előtte / utána</h2>
        <div className="relative mt-3 overflow-hidden rounded-2xl border border-border shadow-card">
          <img
            src={beforeAfterImg}
            alt="Sárgult fényszóró felújítás előtt és kristálytiszta fényszóró utána"
            width={1280}
            height={800}
            loading="lazy"
            className="w-full"
          />
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase text-accent-foreground">
            Előtte
          </span>
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase text-primary-foreground">
            Utána
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: Timer, label: "1–3 óra" },
            { icon: ShieldCheck, label: "Kerámia védelem" },
            { icon: Sparkles, label: "Gyári tisztaság" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="rounded-xl bg-secondary py-3">
              <Icon className="mx-auto size-5 text-primary" />
              <p className="mt-1 text-[11px] font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pt-10">
        <h2 className="text-2xl font-extrabold uppercase">Így működik</h2>
        <ol className="mt-4 space-y-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-border bg-surface p-4">
              <div className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <Icon className="size-5 text-primary" />
                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {i + 1}
                </span>
              </div>
              <div>
                <p className="font-bold">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-5 pt-10">
        <div className="rounded-2xl border border-border bg-card-gradient p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            <h2 className="text-xl font-extrabold uppercase">Nyitvatartás</h2>
          </div>
          <dl className="mt-3 divide-y divide-border text-sm">
            {OPENING_HOURS.map((o) => (
              <div key={o.days} className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">{o.days}</dt>
                <dd className="font-semibold">{o.hours}</dd>
              </div>
            ))}
          </dl>
          <Button asChild variant="beam" size="lg" className="mt-4 w-full">
            <Link to="/foglalas">
              Időpontot foglalok <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
