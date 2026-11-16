import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, Camera, Clock, Phone, ReceiptText, ShieldCheck, Sparkles, Timer } from "lucide-react";
import heroImg from "@/assets/hero-headlight.jpg";
import ref1Before from "@/assets/ref-1-before.jpg";
import ref1After from "@/assets/ref-1-after.jpg";
import ref2Before from "@/assets/ref-2-before.jpg";
import ref2After from "@/assets/ref-2-after.jpg";
import { Button } from "@/components/ui/button";
import { OPENING_HOURS } from "@/lib/schedule";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fényszóró Doki Pétfürdő – Újra tiszta fényszórók" },
      {
        name: "description",
        content: "Sárgult, matt vagy párás fényszóró? Kérj árajánlatot egy fotóval, nézd meg az árlistát, és foglalj időpontot telefonon.",
      },
      { property: "og:title", content: "Fényszóró Doki Pétfürdő – Újra tiszta fényszórók" },
      {
        property: "og:description",
        content: "Fényszóró-felújítás: árajánlat fotó alapján, átlátható árak, időpontfoglalás telefonon.",
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
  { icon: CalendarCheck, title: "Gyere be", text: "Hívj minket időpontért – a legtöbb munka pár óra alatt kész." },
];

function Index() {
  return (
    <main>
      <section className="relative h-[78vh] min-h-[520px] overflow-hidden md:grid md:h-auto md:min-h-0 md:grid-cols-2 md:items-center md:gap-12 md:overflow-visible md:px-8 md:pt-14">
        <div className="absolute inset-0 md:relative md:order-2 md:aspect-[4/5] md:overflow-hidden md:rounded-3xl md:border md:border-border md:shadow-card lg:aspect-[5/6]">
          <img
            src={heroImg}
            alt="Felújított, tisztán világító autó fényszóró"
            width={1024}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-fade md:hidden" />
        </div>
        <div className="absolute inset-x-0 top-0 px-5 pt-6 md:hidden">
          <span className="block font-display text-[2rem] font-extrabold uppercase leading-none tracking-wide">
            Fényszóró <span className="text-primary">Doki</span> Pétfürdő
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-6 animate-rise md:static md:order-1 md:p-0">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary md:text-sm">Fényszóró-felújítás</p>
          <h1 className="mt-2 text-[3.4rem] font-extrabold uppercase leading-[0.9] md:text-7xl lg:text-8xl">
            Újra <span className="text-beam">tiszta</span>
            <br />
            fény.
          </h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground md:mt-5 md:max-w-md md:text-base">
            Sárgult, matt vagy párás fényszóró? Küldj egy fotót, és megmondjuk, mennyiből lesz újra olyan, mint az új.
          </p>
          <div className="mt-5 flex gap-3 md:mt-8 md:max-w-md">
            <Button asChild variant="beam" size="xl" className="flex-1 beam-sweep">
              <Link to="/arajanlat">
                <Camera /> Árajánlatot kérek
              </Link>
            </Button>
            <Button asChild variant="surface" size="xl" aria-label="Időpontfoglalás telefonon">
              <a href={PHONE_TEL}>
                <Phone />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 px-5 pt-2 md:gap-5 md:px-8 md:pt-12">
        {QUICK.map(({ to, icon: Icon, title, text }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-border bg-card-gradient p-4 shadow-card transition-transform active:scale-[0.98] md:p-6 md:hover:border-primary/40"
          >
            <Icon className="size-6 text-primary" />
            <p className="mt-3 font-display text-xl font-bold uppercase md:text-2xl">{title}</p>
            <p className="text-xs text-muted-foreground md:text-sm">{text}</p>
          </Link>
        ))}
      </section>

      <div className="md:grid md:grid-cols-2 md:gap-10 md:px-8 md:pt-6">
        <section className="px-5 pt-10 md:px-0">
          <h2 className="text-2xl font-extrabold uppercase md:text-3xl">Előtte / utána</h2>
          <p className="mt-1 text-sm text-muted-foreground">Húzd a csúszkát, és nézd meg a különbséget!</p>
          <div className="mt-3">
            <BeforeAfterSlider
              before={ref1Before}
              after={ref1After}
              beforeAlt="Sárgult, matt fényszóró felújítás előtt"
              afterAlt="Kristálytiszta, felújított fényszóró"
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: Timer, label: "1–3 óra" },
              { icon: ShieldCheck, label: "Kerámia védelem" },
              { icon: Sparkles, label: "Gyári tisztaság" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl bg-secondary py-3">
                <Icon className="mx-auto size-5 text-primary" />
                <p className="mt-1 text-[11px] font-semibold md:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 pt-10 md:px-0">
          <h2 className="text-2xl font-extrabold uppercase md:text-3xl">Így működik</h2>
          <ol className="mt-4 space-y-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-border bg-surface p-4 md:p-5">
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
      </div>

      <section className="px-5 pt-10 md:px-8 md:pt-14">
        <h2 className="text-2xl font-extrabold uppercase md:text-3xl">Referencia munkák</h2>
        <p className="mt-1 text-sm text-muted-foreground">Így néztek ki az ügyfeleink fényszórói felújítás előtt és után.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 md:gap-6">
          <BeforeAfterSlider
            before={ref1Before}
            after={ref1After}
            beforeAlt="Matt, sárgult fényszóró felújítás előtt"
            afterAlt="Felújított, átlátszó fényszóró utána"
          />
          <BeforeAfterSlider
            before={ref2Before}
            after={ref2After}
            beforeAlt="Erősen oxidálódott fényszóró felújítás előtt"
            afterAlt="Gyári tisztaságú fényszóró felújítás után"
          />
        </div>
      </section>

      <section className="px-5 pt-10 md:px-8 md:pt-14">
        <div className="rounded-2xl border border-border bg-card-gradient p-5 shadow-card md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10 md:p-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              <h2 className="text-xl font-extrabold uppercase md:text-2xl">Nyitvatartás</h2>
            </div>
            <dl className="mt-3 divide-y divide-border text-sm md:text-base">
              {OPENING_HOURS.map((o) => (
                <div key={o.days} className="flex justify-between py-2.5">
                  <dt className="text-muted-foreground">{o.days}</dt>
                  <dd className="font-semibold">{o.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Button asChild variant="beam" size="lg" className="mt-4 w-full md:mt-0 md:w-auto">
            <a href={PHONE_TEL}>
              <Phone /> Időpontfoglalás: {PHONE_DISPLAY}
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
