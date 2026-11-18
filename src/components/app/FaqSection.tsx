import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";
import { ALL_SERVICES, formatHuf } from "@/lib/services";

const KERAMIA = ALL_SERVICES.find((s) => s.id === "keramia")!;

export const FAQ_ITEMS = [
  {
    question: "Mennyi ideig tart a fényszóró felújítás?",
    answer: "Egy pár fényszóró felújítása kb. 1,5–2 órát vesz igénybe. Addig nyugodtan elmehetsz, a végén tiszta, átlátszó búrával kapod vissza az autót.",
  },
  {
    question: "Hogyan működik a polikarbonát gőzölés?",
    answer: "Először lecsiszoljuk a sárgult, matt felületet, majd speciális gőzzel kezeljük a búrát. A gőz újra simává és átlátszóvá teszi a polikarbonát felszínét – olyan lesz, mint újkorában.",
  },
  {
    question: "Hogyan tudok időpontot foglalni?",
    answer: `Időpontot telefonon adunk, hogy biztosan jó időpontot találjunk. Hívj a ${PHONE_DISPLAY} számon, és egyeztetünk!`,
    phone: true,
  },
  {
    question: "Van házhozszállítás vagy kiszállás?",
    answer: "Igen. Pétfürdőn és környékén ingyenes a kiszállás. Távolabbi kiszállás üzemanyag árban.",
  },
  {
    question: "Miért érdemes kerámia bevonatot kérni?",
    answer: `A kerámia védőréteg megvédi a felújított búrát az újrasárgulástól és a karcoktól, így sokáig megőrzi a tiszta fényt. Ára: ${formatHuf(KERAMIA.price)} / ${KERAMIA.unit}.`,
  },
] as const;

export function FaqSection() {
  return (
    <section className="px-5 pt-10 md:px-8 md:pt-14" aria-labelledby="gyik">
      <h2 id="gyik" className="text-2xl font-extrabold uppercase md:text-3xl">Gyakori kérdések</h2>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">A leggyakrabban feltett kérdések rövid válaszokkal.</p>
      <Accordion type="single" collapsible className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem
            key={item.question}
            value={`faq-${i}`}
            className="rounded-2xl border border-border bg-surface px-4 md:px-5"
          >
            <AccordionTrigger className="py-4 text-left text-base font-bold hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {"phone" in item && item.phone ? (
                <p>
                  Időpontot telefonon adunk, hogy biztosan jó időpontot találjunk. Hívj a{" "}
                  <a href={PHONE_TEL} className="font-semibold text-primary underline underline-offset-2">
                    {PHONE_DISPLAY}
                  </a>{" "}
                  számon, és egyeztetünk!
                </p>
              ) : (
                <p>{item.answer}</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
