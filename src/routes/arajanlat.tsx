import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Section, SuccessPanel } from "@/components/app/PageHeader";
import { Field, inputClass } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PROBLEM_OPTIONS } from "@/lib/services";
import { shrinkImage } from "@/lib/image";
import { submitQuote } from "@/lib/workshop.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/arajanlat")({
  head: () => ({
    meta: [
      { title: "Árajánlat fotó alapján – Tisztafény" },
      { name: "description", content: "Tölts fel fotót a fényszóródról, és rövid időn belül árajánlatot adunk a felújításra." },
      { property: "og:title", content: "Árajánlat fotó alapján – Tisztafény" },
      { property: "og:description", content: "Fotózd le a fényszórót, mi megmondjuk, mennyiből lesz újra tiszta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuotePage,
});

const MAX_PHOTOS = 6;
type Photo = { file: File; url: string };

function QuotePage() {
  const send = useServerFn(submitQuote);
  const fileInput = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), []); // eslint-disable-line react-hooks/exhaustive-deps

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    const room = MAX_PHOTOS - photos.length;
    if (incoming.length > room) toast.warning(`Legfeljebb ${MAX_PHOTOS} fotót tölthetsz fel.`);
    setPhotos((prev) => [...prev, ...incoming.slice(0, room).map((file) => ({ file, url: URL.createObjectURL(file) }))]);
    if (fileInput.current) fileInput.current.value = "";
  }

  function removePhoto(i: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  function toggleProblem(p: string) {
    setProblems((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (photos.length === 0) return toast.error("Tölts fel legalább egy fotót a fényszóróról.");
    if (problems.length === 0) return toast.error("Jelöld meg, mi a probléma a fényszóróval.");
    const form = new FormData(e.currentTarget);
    const fd = new FormData();
    for (const k of ["name", "phone", "email", "car", "message"]) fd.set(k, String(form.get(k) ?? ""));
    fd.set("problem", problems.join(", "));
    setSending(true);
    try {
      const shrunk = await Promise.all(photos.map((p) => shrinkImage(p.file)));
      shrunk.forEach((f) => fd.append("photos", f));
      const res = await send({ data: fd });
      if (!res.ok) return void toast.error(res.error);
      setDone(true);
      window.scrollTo({ top: 0 });
    } catch (err) {
      console.error(err);
      toast.error("Nem sikerült elküldeni. Ellenőrizd az adatokat, és próbáld újra.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <main>
        <SuccessPanel
          title="Megkaptuk!"
          action={
            <Button asChild variant="beam" size="lg" className="w-full">
              <Link to="/arlista">Addig nézd meg az árlistát</Link>
            </Button>
          }
        >
          Átnézzük a fotókat, és a megadott telefonszámon jelentkezünk az árajánlattal.
        </SuccessPanel>
      </main>
    );
  }

  return (
    <main>
      <PageHeader eyebrow="Ingyenes" title="Árajánlat">
        Fotózd le a fényszórót közelről és kicsit távolabbról, nappali fényben. A képek alapján megmondjuk az árat.
      </PageHeader>

      <form onSubmit={onSubmit} className="space-y-8 px-5">
        <Section title="Fotók" step={1}>
          <div className="grid grid-cols-3 gap-2.5">
            {photos.map((p, i) => (
              <div key={p.url} className="relative aspect-square overflow-hidden rounded-xl border border-border">
                <img src={p.url} alt={`Feltöltött fotó ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label={`${i + 1}. fotó törlése`}
                  className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-background/80 backdrop-blur"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary transition-colors active:bg-primary/10"
              >
                <ImagePlus className="size-7" />
                <span className="text-[11px] font-bold">Fotó hozzáadása</span>
              </button>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            aria-label="Fotók kiválasztása"
            onChange={(e) => addFiles(e.target.files)}
          />
          <p className="text-xs text-muted-foreground">
            {photos.length}/{MAX_PHOTOS} fotó · készíthetsz újat, vagy választhatsz a galériából
          </p>
        </Section>

        <Section title="Mi a probléma?" step={2}>
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
                    "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-foreground",
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <Field id="car" label="Autó márkája, típusa, évjárata">
            <Input id="car" name="car" required minLength={2} placeholder="pl. Opel Astra H, 2008" className={inputClass} />
          </Field>
          <Field id="message" label="Megjegyzés" optional>
            <Textarea id="message" name="message" rows={3} maxLength={1500} placeholder="Bármi, amit tudnunk érdemes…" className="rounded-xl bg-surface text-base" />
          </Field>
        </Section>

        <Section title="Elérhetőség" step={3}>
          <Field id="name" label="Név">
            <Input id="name" name="name" required minLength={2} autoComplete="name" className={inputClass} />
          </Field>
          <Field id="phone" label="Telefonszám">
            <Input id="phone" name="phone" type="tel" required minLength={6} autoComplete="tel" placeholder="+36 30 123 4567" className={inputClass} />
          </Field>
          <Field id="email" label="E-mail" optional>
            <Input id="email" name="email" type="email" autoComplete="email" className={inputClass} />
          </Field>
        </Section>

        <Button type="submit" variant="beam" size="xl" className="w-full" disabled={sending}>
          {sending ? <Loader2 className="animate-spin" /> : <Send />}
          {sending ? "Küldés…" : "Árajánlatot kérek"}
        </Button>
      </form>
    </main>
  );
}
