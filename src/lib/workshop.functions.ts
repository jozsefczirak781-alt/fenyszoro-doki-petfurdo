import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isValidSlot } from "./schedule";
import { ALL_SERVICES } from "./services";

const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

const contactSchema = {
  name: z.string().trim().min(2, "Add meg a neved").max(100),
  phone: z
    .string()
    .trim()
    .min(6, "Add meg a telefonszámod")
    .max(30)
    .regex(/^[+0-9 ()/-]+$/, "Érvénytelen telefonszám"),
  email: z
    .string()
    .trim()
    .max(200)
    .email("Érvénytelen e-mail cím")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  car: z.string().trim().min(2, "Add meg az autó típusát").max(120),
};

const quoteFieldsSchema = z.object({
  ...contactSchema,
  problem: z.string().trim().min(1, "Válaszd ki a problémát").max(200),
  message: z.string().trim().max(1500).optional(),
});

export type SubmitResult = { ok: true } | { ok: false; error: string };

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Érvénytelen kérés");
    const str = (k: string) => {
      const v = data.get(k);
      return typeof v === "string" ? v : undefined;
    };
    const fields = quoteFieldsSchema.parse({
      name: str("name") ?? "",
      phone: str("phone") ?? "",
      email: str("email") ?? "",
      car: str("car") ?? "",
      problem: str("problem") ?? "",
      message: str("message") || undefined,
    });
    const photos = data
      .getAll("photos")
      .filter((f): f is File => typeof f === "object" && f !== null && "size" in f && f.size > 0);
    if (photos.length === 0) throw new Error("Tölts fel legalább egy fotót");
    if (photos.length > MAX_PHOTOS) throw new Error(`Legfeljebb ${MAX_PHOTOS} fotót tölthetsz fel`);
    for (const p of photos) {
      if (!p.type.startsWith("image/")) throw new Error("Csak képfájlt tölthetsz fel");
      if (p.size > MAX_PHOTO_BYTES) throw new Error("Egy fotó legfeljebb 10 MB lehet");
    }
    return { ...fields, photos };
  })
  .handler(async ({ data }): Promise<SubmitResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const id = crypto.randomUUID();
    const paths: string[] = [];

    for (const [i, photo] of data.photos.entries()) {
      const ext = (photo.type.split("/")[1] || "jpg").replace(/[^a-z0-9]/gi, "").slice(0, 5);
      const path = `${id}/${i + 1}.${ext}`;
      const { error } = await supabaseAdmin.storage
        .from("quote-photos")
        .upload(path, await photo.arrayBuffer(), { contentType: photo.type, upsert: false });
      if (error) {
        console.error("quote photo upload failed", error);
        return { ok: false, error: "A fotók feltöltése nem sikerült. Próbáld újra." };
      }
      paths.push(path);
    }

    const { error } = await supabaseAdmin.from("quote_requests").insert({
      id,
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      car: data.car,
      problem: data.problem,
      message: data.message ?? null,
      photo_paths: paths,
    });
    if (error) {
      console.error("quote insert failed", error);
      return { ok: false, error: "Az ajánlatkérés mentése nem sikerült. Próbáld újra." };
    }
    return { ok: true };
  });

const bookingSchema = z.object({
  ...contactSchema,
  service: z.string().refine((s) => ALL_SERVICES.some((x) => x.id === s), "Válassz szolgáltatást"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  note: z.string().trim().max(1000).optional(),
});

export type BookingInput = z.input<typeof bookingSchema>;

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: BookingInput) => bookingSchema.parse(data))
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (!isValidSlot(data.date, data.time)) {
      return { ok: false, error: "Erre az időpontra nem lehet foglalni. Válassz másikat." };
    }
    const service = ALL_SERVICES.find((s) => s.id === data.service)!;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("bookings").insert({
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      car: data.car,
      service: service.name,
      booking_date: data.date,
      booking_time: data.time,
      note: data.note || null,
    });
    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "Ezt az időpontot közben valaki lefoglalta. Válassz másikat." };
      }
      console.error("booking insert failed", error);
      return { ok: false, error: "A foglalás nem sikerült. Próbáld újra." };
    }
    return { ok: true };
  });
