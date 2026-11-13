import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Section, SuccessPanel } from "@/components/app/PageHeader";
import { Field, inputClass } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { ALL_SERVICES, formatHuf } from "@/lib/services";
import { isBookableDate, slotsForDate } from "@/lib/schedule";
import { createBooking } from "@/lib/workshop.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/foglalas")({
  head: () => ({
    meta: [
      { title: "Időpontfoglalás – Tisztafény" },
      { name: "description", content: "Foglalj időpontot fényszóró-felújításra pár koppintással." },
      { property: "og:title", content: "Időpontfoglalás – Tisztafény" },
      { property: "og:description", content: "Válassz szolgáltatást, napot és időpontot – online, pár koppintással." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookingPage,
});

const toKey = (d: Date) => format(d, "yyyy-MM-dd");

function BookingPage() {
  const book = useServerFn(createBooking);
  const queryClient = useQueryClient();
  const [service, setService] = useState<string>("teljes-felujitas");
  const [day, setDay] = useState<Date | undefined>();
  const [time, setTime] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ date: Date; time: string; service: string } | null>(null);

  const dateKey = day ? toKey(day) : undefined;
  const booked = useQuery({
    queryKey: ["booked-times", dateKey],
    enabled: !!dateKey,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_booked_times", { _date: dateKey! });
      if (error) throw error;
      return (data ?? []) as string[];
    },
  });

  const slots = dateKey ? slotsForDate(dateKey) : [];
  const taken = new Set(booked.data ?? []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dateKey || !time) return toast.error("Válassz napot és időpontot.");
    const f = new FormData(e.currentTarget);
    setSending(true);
    try {
      const res = await book({
        data: {
          service,
          date: dateKey,
          time,
          name: String(f.get("name") ?? ""),
          phone: String(f.get("phone") ?? ""),
          email: String(f.get("email") ?? ""),
          car: String(f.get("car") ?? ""),
          note: String(f.get("note") ?? "") || undefined,
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        setTime(undefined);
        queryClient.invalidateQueries({ queryKey: ["booked-times", dateKey] });
        return;
      }
      setDone({ date: day!, time, service: ALL_SERVICES.find((s) => s.id === service)!.name });
      window.scrollTo({ top: 0 });
    } catch (err) {
      console.error(err);
      toast.error("Nem sikerült a foglalás. Ellenőrizd az adatokat, és próbáld újra.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <main>
        <SuccessPanel
          title="Lefoglalva!"
          action={
            <Button asChild variant="beam" size="lg" className="w-full">
              <Link to="/">Vissza a főoldalra</Link>
            </Button>
          }
        >
          <p className="font-display text-2xl font-bold uppercase text-foreground">
            {format(done.date, "MMMM d., EEEE", { locale: hu })} · {done.time}
          </p>
          <p className="mt-1">{done.service}</p>
          <p className="mt-3">Várunk szeretettel! Ha közbejön valami, hívj minket.</p>
        </SuccessPanel>
      </main>
    );
  }

  return (
    <main>
      <PageHeader eyebrow="Online" title="Foglalás">
        Válaszd ki a szolgáltatást, a napot és az időpontot. Holnaptól 60 napra előre foglalhatsz.
      </PageHeader>

      <form onSubmit={onSubmit} className="space-y-8 px-5">
        <Section title="Szolgáltatás" step={1}>
          <div className="space-y-2">
            {ALL_SERVICES.map((s) => (
              <label
                key={s.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-all",
                  service === s.id ? "border-primary bg-primary/10" : "border-border bg-surface",
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    checked={service === s.id}
                    onChange={() => setService(s.id)}
                    className="size-4 accent-primary"
                  />
                  <span className="text-sm font-semibold">{s.name}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatHuf(s.price)}
                  {s.from ? "-tól" : ""}
                </span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Nap" step={2}>
          <div className="rounded-2xl border border-border bg-surface p-2">
            <Calendar
              mode="single"
              locale={hu}
              weekStartsOn={1}
              selected={day}
              onSelect={(d) => {
                setDay(d);
                setTime(undefined);
              }}
              disabled={(d) => !isBookableDate(toKey(d))}
              className="w-full bg-transparent [--cell-size:2.6rem]"
              classNames={{ root: "w-full" }}
            />
          </div>
        </Section>

        <Section title="Időpont" step={3}>
          {!day ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              Először válassz napot.
            </p>
          ) : booked.isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((s) => {
                const isTaken = taken.has(s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isTaken}
                    aria-pressed={time === s}
                    onClick={() => setTime(s)}
                    className={cn(
                      "rounded-xl border py-3 text-sm font-bold transition-all",
                      isTaken && "border-border bg-transparent text-muted-foreground line-through opacity-50",
                      !isTaken && time === s && "border-primary bg-primary text-primary-foreground shadow-glow",
                      !isTaken && time !== s && "border-border bg-surface",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </Section>

        <Section title="Adataid" step={4}>
          <Field id="name" label="Név">
            <Input id="name" name="name" required minLength={2} autoComplete="name" className={inputClass} />
          </Field>
          <Field id="phone" label="Telefonszám">
            <Input id="phone" name="phone" type="tel" required minLength={6} autoComplete="tel" placeholder="+36 30 123 4567" className={inputClass} />
          </Field>
          <Field id="email" label="E-mail" optional>
            <Input id="email" name="email" type="email" autoComplete="email" className={inputClass} />
          </Field>
          <Field id="car" label="Autó márkája, típusa">
            <Input id="car" name="car" required minLength={2} placeholder="pl. Ford Focus, 2012" className={inputClass} />
          </Field>
          <Field id="note" label="Megjegyzés" optional>
            <Textarea id="note" name="note" rows={2} maxLength={1000} className="rounded-xl bg-surface text-base" />
          </Field>
        </Section>

        <Button type="submit" variant="beam" size="xl" className="w-full" disabled={sending || !time}>
          {sending ? <Loader2 className="animate-spin" /> : <CalendarCheck />}
          {sending ? "Foglalás…" : time && day ? `Foglalás: ${format(day, "MMM d.", { locale: hu })} ${time}` : "Válassz időpontot"}
        </Button>
      </form>
    </main>
  );
}
