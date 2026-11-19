import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Check, Clock, MapPin, Phone, ReceiptText, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-headlight.jpg";
import { BeforeAfterGallery } from "@/components/app/BeforeAfterGallery";
import { FAQ_ITEMS, FaqSection } from "@/components/app/FaqSection";
import { Button } from "@/components/ui/button";
import { OPENING_HOURS } from "@/lib/schedule";
import { ADDRESS_DISPLAY, MAPS_URL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";

import { ALL_SERVICES, formatHuf } from "@/lib/services";
import { SITE_NAME, SITE_URL, pageUrlTags } from "@/lib/site";

const MAIN = ALL_SERVICES.find((s) => s.id === "bura-felujitas")!;
const EXTRAS = ALL_SERVICES.filter((s) => s.id !== MAIN.id);
const MAIN_PRICE = `${formatHuf(MAIN.price)} / ${MAIN.unit}`;

const TITLE = "Fényszóró felújítás Pétfürdő – polikarbonát gőzölés | Fényszóró Doki";
const DESCRIPTION = `Fényszóró búra felújítás polikarbonát gőzöléses technológiával Pétfürdőn, Várpalota mellett. ${MAIN_PRICE}. Árajánlat fotó alapján.`;
const OG_IMAGE = `${SITE_URL}/og-home.jpg`;

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: SITE_NAME,
  url: SITE_URL,
  image: OG_IMAGE,
  telephone: PHONE_TEL.replace("tel:", ""),
  description: DESCRIPTION,
  address: { "@type": "PostalAddress", addressLocality: "Pétfürdő", postalCode: "8105", addressCountry: "HU" },
  areaServed: [
    { "@type": "City", name: "Pétfürdő" },
    { "@type": "City", name: "Várpalota" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  makesOffer: ALL_SERVICES.map((s) => ({
    "@type": "Offer",
    price: s.price,
    priceCurrency: "HUF",
    itemOffered: { "@type": "Service", name: s.name },
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export const Route = createFileRoute("/")({
  head: () => {
    const url = pageUrlTags("/");
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_IMAGE },
        ...url.meta,
      ],
      links: url.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(localBusiness) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
      ],
    };
  },
  component: Index,
});

const STEPS = [
  { icon: Camera, title: "Fotózd le", text: "Küldj 1–6 képet a fényszóróról az ajánlatkérő oldalon." },
  { icon: Sparkles, title: "Megkapod az ajánlatot", text: "Átnézzük a képeket, és a megadott telefonszámon jelentkezünk az árral." },
  { icon: Phone, title: "Egyeztetünk időpontot", text: "Időpontot telefonon beszélünk meg, és jöhetsz az autóval." },
];

const PROCESS = [
  "A sárgult, matt felső réteg eltávolítása csiszolással",
  "Polikarbonát gőzölés: a búra felülete újra sima és átlátszó lesz",
  "Igény szerint kerámia védőbevonat a felújított búrára",
];

function Index() {
  return (
    <main>
      <section className="relative h-[80vh] min-h-[560px] overflow-hidden md:grid md:h-auto md:min-h-0 md:grid-cols-2 md:items-center md:gap-12 md:overflow-visible md:px-8 md:pt-14">
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
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary md:text-sm">Fényszóró felújítás · Pétfürdő</p>
          <h1 className="mt-2 text-[3.2rem] font-extrabold uppercase leading-[0.9] md:text-7xl lg:text-8xl">
            Újra <span className="text-beam">tiszta</span>
            <br />
            fény.
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground md:mt-5 md:max-w-md md:text-base">
            Fényszóró búra felújítás <strong className="text-foreground">polikarbonát gőzöléses technológiával</strong>.
          </p>
          <p className="mt-3 inline-flex items-baseline gap-2 rounded-xl border border-primary/40 bg-background/70 px-3.5 py-2 backdrop-blur md:mt-5">
            <span className="font-display text-3xl font-extrabold leading-none text-primary md:text-4xl">{formatHuf(MAIN.price)}</span>
            <span className="text-sm font-semibold text-muted-foreground">/ {MAIN.unit}</span>
          </p>
          <div className="mt-4 grid gap-2.5 md:mt-8 md:max-w-md">
            <Button asChild variant="beam" size="xl" className="w-full beam-sweep">
              <Link to="/arajanlat">
                <Camera /> Árajánlatot kérek fotóval
              </Link>
            </Button>
            <Button asChild variant="surface" size="xl" className="w-full">
              <a href={PHONE_TEL}>
                <Phone /> Hívás: {PHONE_DISPLAY}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-5 pt-8 md:px-8 md:pt-14" aria-labelledby="fo-szolgaltatas">
        <div className="relative rounded-3xl border border-primary/40 bg-card-gradient p-5 shadow-glow md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10 md:p-8">
          <span className="absolute -top-3 left-5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase text-accent-foreground">
            Fő szolgáltatás
          </span>
          <div className="min-w-0">
            <h2 id="fo-szolgaltatas" className="text-2xl font-extrabold uppercase leading-tight md:text-3xl">
              Fényszóró búra felújítás polikarbonát gőzöléssel
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              A mai autók fényszóróbúrája polikarbonátból készül, ami az évek alatt sárgul, mattul. Gőzöléses technológiával
              újra átlátszóvá tesszük, így a fényszóró ismét jól világít.
            </p>
            <ul className="mt-4 space-y-2">
              {PROCESS.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5 rounded-2xl border border-border bg-surface p-4 text-center md:mt-0 md:w-72 md:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Ár</p>
            <p className="mt-1 font-display text-5xl font-extrabold leading-none text-primary">{formatHuf(MAIN.price)}</p>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">/ {MAIN.unit}</p>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="beam" size="lg" className="h-12 w-full rounded-xl">
                <Link to="/arajanlat">
                  <Camera /> Ajánlatkérés
                </Link>
              </Button>
              <Button asChild variant="surface" size="lg" className="h-12 w-full rounded-xl">
                <a href={PHONE_TEL}>
                  <Phone /> Hívás most
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pt-10 md:px-8 md:pt-14" aria-labelledby="galeria">
        <h2 id="galeria" className="text-2xl font-extrabold uppercase md:text-3xl">Előtte – utána</h2>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">Koppints egy képpárra a nagyításhoz és az összehasonlításhoz.</p>
        <BeforeAfterGallery />
      </section>

      <div className="md:grid md:grid-cols-2 md:gap-10 md:px-8 md:pt-6">
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
                <div className="min-w-0">
                  <p className="font-bold">{title}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="px-5 pt-10 md:px-0">
          <h2 className="text-2xl font-extrabold uppercase md:text-3xl">Kiegészítők</h2>
          <ul className="mt-4 space-y-3">
            {EXTRAS.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-4 md:p-5">
                <div className="min-w-0">
                  <p className="font-bold leading-snug">{s.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                </div>
                <p className="shrink-0 text-right font-display text-xl font-extrabold leading-none text-primary">
                  {formatHuf(s.price)}
                  <span className="mt-1 block font-sans text-[11px] font-semibold text-muted-foreground">/ {s.unit}</span>
                </p>
              </li>
            ))}
          </ul>
          <Button asChild variant="surface" size="lg" className="mt-3 h-12 w-full rounded-xl">
            <Link to="/arlista">
              <ReceiptText /> Teljes árlista
            </Link>
          </Button>
        </section>
      </div>

      <FaqSection />

      <section className="px-5 pt-10 md:px-8 md:pt-14">
        <div className="rounded-2xl border border-border bg-card-gradient p-5 shadow-card md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10 md:p-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Clock className="size-5 shrink-0 text-primary" />
              <h2 className="text-xl font-extrabold uppercase md:text-2xl">Nyitvatartás</h2>
            </div>
            <dl className="mt-3 divide-y divide-border text-sm md:text-base">
              {OPENING_HOURS.map((o) => (
                <div key={o.days} className="flex justify-between gap-3 py-2.5">
                  <dt className="text-muted-foreground">{o.days}</dt>
                  <dd className="font-semibold">{o.hours}</dd>
                </div>
              ))}
            </dl>         <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
           <MapPin className="size-4 shrink-0 text-primary" /> {ADDRESS_DISPLAY}
         </p>
       </div>
       <div className="mt-4 flex flex-col gap-3 sm:flex-row md:mt-0">
         <Button asChild variant="outline" size="xl" className="w-full md:w-auto">
           <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
             <MapPin className="size-4" /> Útvonaltervezés
           </a>
         </Button>
         <Button asChild variant="beam" size="xl" className="w-full md:w-auto">
           <a href={PHONE_TEL}>
             <Phone /> Időpont: {PHONE_DISPLAY}
           </a>
         </Button>
       </div>
          
        </div>
      </section>
    </main>
  );
}
