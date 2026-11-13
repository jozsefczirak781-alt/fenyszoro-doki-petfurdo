export type PriceItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: "pár" | "db" | "alkalom";
  from?: boolean;
  popular?: boolean;
};

export type PriceCategory = { title: string; items: PriceItem[] };

export const PRICE_LIST: PriceCategory[] = [
  {
    title: "Felújítás",
    items: [
      {
        id: "polirozas",
        name: "Fényszóró polírozás",
        description: "Sárgulás és mattság eltávolítása többlépcsős csiszolással és polírozással.",
        price: 14990,
        unit: "pár",
      },
      {
        id: "teljes-felujitas",
        name: "Teljes felújítás UV-védő lakkal",
        description: "Csiszolás, polírozás és tartós UV-álló lakkréteg – hosszú távon tiszta fény.",
        price: 24990,
        unit: "pár",
        popular: true,
      },
      {
        id: "keramia",
        name: "Kerámia bevonat",
        description: "Extra védőréteg a felújított fényszóróra, víz- és szennytaszító hatással.",
        price: 9990,
        unit: "pár",
      },
    ],
  },
  {
    title: "Javítás",
    items: [
      {
        id: "parasodas",
        name: "Párásodás megszüntetése",
        description: "Szellőzés és tömítés javítása, belső tér kiszárítása.",
        price: 12990,
        unit: "db",
        from: true,
      },
      {
        id: "belso-tisztitas",
        name: "Bontás és belső tisztítás",
        description: "A fényszóró szétszedése, reflektor és belső üveg tisztítása, újratömítés.",
        price: 29990,
        unit: "db",
        from: true,
      },
      {
        id: "uvegcsere",
        name: "Búra (üveg) csere",
        description: "Repedt vagy menthetetlen búra cseréje új, gyári méretű elemre.",
        price: 39990,
        unit: "db",
        from: true,
      },
    ],
  },
  {
    title: "Kiegészítők",
    items: [
      {
        id: "hatso-lampa",
        name: "Hátsó lámpa polírozás",
        description: "Fakult hátsó lámpák felfrissítése.",
        price: 9990,
        unit: "pár",
      },
      {
        id: "kodlampa",
        name: "Ködlámpa polírozás",
        description: "Ködlámpák tisztítása és polírozása.",
        price: 7990,
        unit: "pár",
      },
      {
        id: "beallitas",
        name: "Fényszóró beállítás",
        description: "Fénykép-beállítás műszeresen, a műszaki vizsga előírásai szerint.",
        price: 4990,
        unit: "alkalom",
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
