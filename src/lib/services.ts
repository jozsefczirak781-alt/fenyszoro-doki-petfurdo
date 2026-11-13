export type PriceItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: "pár" | "db" | "alkalom" | "autó";
  from?: boolean;
  popular?: boolean;
};

export type PriceCategory = { title: string; items: PriceItem[] };

export const PRICE_LIST: PriceCategory[] = [
  {
    title: "Szolgáltatások",
    items: [
      {
        id: "bura-felujitas",
        name: "Fényszóró búra felújítás gőzölős technológiával",
        description: "A matt, sárgult búra felújítása gőzölős technológiával – újra tiszta, átlátszó fényszóró.",
        price: 15000,
        unit: "pár",
        popular: true,
      },
      {
        id: "keramia",
        name: "Kerámia védőbevonat",
        description: "Tartós kerámia védőréteg a felújított fényszóróra.",
        price: 3000,
        unit: "pár",
      },
      {
        id: "ozon",
        name: "Ózongenerátoros utastér-fertőtlenítés",
        description: "Az autó utasterének fertőtlenítése és szagtalanítása ózongenerátorral.",
        price: 5000,
        unit: "autó",
      },
    ],
  },
];

export const ALL_SERVICES: PriceItem[] = PRICE_LIST.flatMap((c) => c.items);

export function formatHuf(value: number): string {
  return new Intl.NumberFormat("hu-HU").format(value) + " Ft";
}

export const PROBLEM_OPTIONS = [
  "Sárgult, matt",
  "Párás belül",
  "Karcos",
  "Repedt",
  "Gyenge fény",
  "Egyéb",
] as const;
