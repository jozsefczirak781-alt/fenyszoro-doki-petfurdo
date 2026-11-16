import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Camera, Check, ImagePlus, Loader2, Phone, ReceiptText, RotateCcw, Send, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Section, SuccessPanel } from "@/components/app/PageHeader";
import { Field, inputClass } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PROBLEM_OPTIONS } from "@/lib/services";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";
import { shrinkImage } from "@/lib/image";
import { submitQuote } from "@/lib/workshop.functions";
import { pageUrlTags } from "@/lib/site";
import { cn } from "@/lib/utils";

const TITLE = "Fényszóró felújítás árajánlat fotó alapján – Fényszóró Doki Pétfürdő";
const DESCRIPTION =
  "Kérj ingyenes árajánlatot fényszóró búra felújításra: tölts fel egy fotót, add meg az autó típusát és a telefonszámod. Pétfürdő, Várpalota.";

export const Route = createFileRoute("/arajanlat")({
  head: () => {
    const url = pageUrlTags("/arajanlat");
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...url.meta,
      ],
      links: url.links,
    };
  },
  component: QuotePage,
});

const MAX_PHOTOS = 6;
const PHONE_RE = /^[+0-9 ()/-]{6,30}$/;
const CAR_BRANDS = [
  "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Kia", "Mazda", "Mercedes-Benz",
  "Mitsubishi", "Nissan", "Opel", "Peugeot", "Renault", "Seat", "Škoda", "Suzuki", "Toyota", "Volkswagen", "Volvo",
];

type Photo = { file: File; url: string };
type Errors = Partial<Record<"photos" | "car" | "phone" | "name", string>>;
type Sent = { car: string; phone: string; photos: number };

function QuotePage() {
  const send = useServerFn(submitQuote);
  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const photosRef = useRef<Photo[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "shrinking" | "sending">("idle");
  const [sent, setSent] = useState<Sent | null>(null);

  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  function addFiles(list: FileList | null, input: HTMLInputElement | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    const room = MAX_PHOTOS - photos.length;
    if (incoming.length > room) toast.warning(`Legfeljebb ${MAX_PHOTOS} fotót tölthetsz fel.`);
    const added = incoming.slice(0, room).map((file) => ({ file, url: URL.createObjectURL(file) }));
    if (added.length) {
      setPhotos((prev) => [...prev, ...added]);
      setErrors((e) => ({ ...e, photos: undefined }));
    }
    if (input) input.value = "";
  }

  function removePhoto(i: number) {
    setPhotos((prev) => {
      const removed = prev[i];
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  function toggleProblem(p: string) {
    setProblems((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function validate(form: FormData): Errors {
    const e: Errors = {};
    if (photos.length === 0) e.photos = "Tölts fel legalább egy fotót a fényszóróról.";
    if (String(form.get("car") ?? "").trim().length < 2) e.car = "Add meg az autó márkáját és típusát.";
    const phone = String(form.get("phone") ?? "").trim();
    if (!PHONE_RE.test(phone) || phone.replace(/\D/g, "").length < 6) e.phone = "Add meg a telefonszámod, pl. 06 30 123 4567.";
    if (String(form.get("name") ?? "").trim().length < 2) e.name = "Add meg a neved.";
    return e;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const found = validate(form);
    setErrors(found);
    const first = (["photos", "car", "phone", "name"] as const).find((k) => found[k]);
    if (first) {
      document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error(found[first]);
      return;
    }

    const fd = new FormData();
    for (const k of ["name", "phone", "email", "car", "message"]) fd.set(k, String(form.get(k) ?? "").trim());
    fd.set("problem", problems.length ? problems.join(", ") : "Nincs megjelölve");
    try {
      setStatus("shrinking");
      const shrunk = await Promise.all(photos.map((p) => shrinkImage(p.file)));
      shrunk.forEach((f) => fd.append("photos", f));
      setStatus("sending");
      const res = await send({ data: fd });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setSent({ car: String(fd.get("car")), phone: String(fd.get("phone")), photos: shrunk.length });
      window.scrollTo({ top: 0 });
    } catch (err) {
      console.error(err);
      toast.error("Nem sikerült elküldeni. Ellenőrizd az internetkapcsolatot, és próbáld újra.");
    } finally {
      setStatus("idle");
    }
  }

  function startOver() {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setProblems([]);
    setErrors({});
    setSent(null);
    window.scrollTo({ top: 0 });
  }

  if (sent) {
    return (
      <main>
        <SuccessPanel
          title="Megkaptuk!"
          action={
            <div className="grid gap-2.5">
              <Button asChild variant="beam" size="xl" className="w-full">
                <a href={PHONE_TEL}>
                  <Phone /> Sürgős? Hívj: {PHONE_DISPLAY}
                </a>
              </Button>
              <div className="grid grid-cols-2 gap-2.5">
                <Button variant="surface" size="lg" className="h-12 rounded-xl" onClick={startOver}>
                  <RotateCcw /> Új kérés
                </Button>
                <Button asChild variant="surface" size="lg" className="h-12 rounded-xl">
                  <Link to="/arlista">
                    <ReceiptText /> Árlista
                  </Link>
                </Button>
              </div>
            </div>
          }
        >
          <p>Az ajánlatkérésed sikeresen beérkezett. Átnézzük a fotókat, és a megadott telefonszámon jelentkezünk az árajánlattal.</p>
          <dl className="mt-4 space-y-1.5 rounded-2xl border border-border bg-surface p-4 text-left text-sm">
            <div className="flex justify-between gap-3">
              <dt>Autó</dt>
              <dd className="min-w-0 break-words text-right font-semibold text-foreground">{sent.car}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Telefonszám</dt>
              <dd className="font-semibold text-foreground">{sent.phone}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Fotók</dt>
              <dd className="font-semibold text-foreground">{sent.photos} db</dd>
            </div>
          </dl>
        </SuccessPanel>
      </main>
    );
  }

  const busy = status !== "idle";

  return (
    <main>
      <PageHeader eyebrow="Ingyenes" title="Árajánlat">
        Csak 3 dolog kell: egy fotó a fényszóróról, az autó típusa és a telefonszámod. A képek alapján megmondjuk az árat.
      </PageHeader>

      <form onSubmit={onSubmit} noValidate className="space-y-8 px-5 md:grid md:grid-cols-2 md:items-start md:gap-10 md:space-y-0 md:px-8">
        <div className="space-y-8">
          <div id="field-photos">
            <Section title="Fotók" step={1}>
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  type="button"
                  variant="beam"
                  size="xl"
                  className="w-full px-3"
                  disabled={photos.length >= MAX_PHOTOS}
                  onClick={() => cameraInput.current?.click()}
                >
                  <Camera /> Fotó készítése
                </Button>
                <Button
                  type="button"
                  variant="surface"
                  size="xl"
                  className="w-full px-3"
                  disabled={photos.length >= MAX_PHOTOS}
                  onClick={() => galleryInput.current?.click()}
                >
                  <ImagePlus /> Galériából
                </Button>
              </div>
              <input
                ref={cameraInput}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                aria-label="Fotó készítése kamerával"
                onChange={(e) => addFiles(e.target.files, e.target)}
              />
              <input
                ref={galleryInput}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                aria-label="Fotók kiválasztása a galériából"
                onChange={(e) => addFiles(e.target.files, e.target)}
              />
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2.5">
                  {photos.map((p, i) => (
                    <div key={p.url} className="relative aspect-square overflow-hidden rounded-xl border border-border">
                      <img src={p.url} alt={`Feltöltött fotó ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        aria-label={`${i + 1}. fotó törlése`}
                        className="absolute right-1 top-1 flex size-9 items-center justify-center rounded-full bg-background/80 backdrop-blur"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.photos ? (
                <p className="text-sm font-semibold text-destructive">{errors.photos}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {photos.length}/{MAX_PHOTOS} fotó · Tipp: nappali fényben, egy közeli és egy távolabbi kép.
                </p>
              )}
            </Section>
          </div>

          <Section title="Autó" step={2}>
            <div id="field-car">
              <Field id="car" label="Autó márkája és típusa">
                <Input
                  id="car"
                  name="car"
                  list="car-brands"
                  autoComplete="off"
                  autoCapitalize="words"
                  maxLength={120}
                  placeholder="pl. Opel Astra H, 2008"
                  aria-invalid={!!errors.car}
                  onInput={() => errors.car && setErrors((e) => ({ ...e, car: undefined }))}
                  className={cn(inputClass, errors.car && "border-destructive")}
                />
                <datalist id="car-brands">
                  {CAR_BRANDS.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </Field>
              {errors.car && <p className="mt-1.5 text-sm font-semibold text-destructive">{errors.car}</p>}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Mi a probléma? <span className="font-normal opacity-70">(nem kötelező)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {PROBLEM_OPTIONS.map((p) => {
                  const active = problems.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleProblem(p)}
                      className={cn(
                        "flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-all",
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-foreground",
                      )}
                    >
                      {active && <Check className="size-4" />}
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
            <Field id="message" label="Megjegyzés" optional>
              <Textarea id="message" name="message" rows={3} maxLength={1500} placeholder="Bármi, amit tudnunk érdemes…" className="rounded-xl bg-surface text-base" />
            </Field>
          </Section>
        </div>

        <div className="space-y-6 md:sticky md:top-24 md:rounded-3xl md:border md:border-border md:bg-card-gradient md:p-6 md:shadow-card">
          <Section title="Elérhetőség" step={3}>
            <div id="field-phone">
              <Field id="phone" label="Telefonszám">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={30}
                  placeholder="06 30 123 4567"
                  aria-invalid={!!errors.phone}
                  onInput={() => errors.phone && setErrors((e) => ({ ...e, phone: undefined }))}
                  className={cn(inputClass, errors.phone && "border-destructive")}
                />
              </Field>
              {errors.phone && <p className="mt-1.5 text-sm font-semibold text-destructive">{errors.phone}</p>}
            </div>
            <div id="field-name">
              <Field id="name" label="Név">
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  autoCapitalize="words"
                  maxLength={100}
                  aria-invalid={!!errors.name}
                  onInput={() => errors.name && setErrors((e) => ({ ...e, name: undefined }))}
                  className={cn(inputClass, errors.name && "border-destructive")}
                />
              </Field>
              {errors.name && <p className="mt-1.5 text-sm font-semibold text-destructive">{errors.name}</p>}
            </div>
            <Field id="email" label="E-mail" optional>
              <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={200} className={inputClass} />
            </Field>
          </Section>

          <Button type="submit" variant="beam" size="xl" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <Send />}
            {status === "shrinking" ? "Fotók előkészítése…" : status === "sending" ? "Küldés…" : "Árajánlatot kérek"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Inkább telefonálnál?{" "}
            <a href={PHONE_TEL} className="font-semibold text-primary underline-offset-4 hover:underline">
              {PHONE_DISPLAY}
            </a>
          </p>
        </div>
      </form>
    </main>
  );
}
