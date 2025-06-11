export const PORT: number = 3000;
export const SERVER_URL = "http://127.0.0.1";

export const FACULTIES = [
  {
    value: "WEAIiIB",
    label: "Wydział Elektrotechniki, Automatyki i Inżynierii Biomedycznej",
  },
  {
    value: "WGGiIŚ",
    label: "Wydział Geodezji Górniczej i Inżynierii Środowiska",
  },
  { value: "WGiG", label: "Wydział Górnictwa i Geoinżynierii" },
  { value: "WIMiC", label: "Wydział Inżynierii Materiałowej i Ceramiki" },
  {
    value: "WIMiIP",
    label: "Wydział Inżynierii Metali i Informatyki Przemysłowej",
  },
  { value: "WIMiR", label: "Wydział Inżynierii Mechanicznej i Robotyki" },
  { value: "WMS", label: "Wydział Matematyki Stosowanej" },
  { value: "WO", label: "Wydział Odlewnictwa" },
  { value: "WFiIS", label: "Wydział Fizyki i Informatyki Stosowanej" },
  { value: "WWNiG", label: "Wydział Wiertnictwa, Nafty i Gazu" },
  { value: "WZ", label: "Wydział Zarządzania" },
  { value: "WEiP", label: "Wydział Energetyki i Paliw" },
  {
    value: "WIEiT",
    label: "Wydział Informatyki, Elektroniki i Telekomunikacji",
  },
  { value: "WH", label: "Wydział Humanistyczny" },
] as const;

export const FACULTIES_VALUES = FACULTIES.map((f) => f.value);

export const STUDIES_TYPES = [
  { value: "BACHELOR", label: "Licencjackie" },
  { value: "ENGINEERING", label: "Inżynierskie" },
  { value: "MASTER", label: "Magisterskie" },
  { value: "DOCTORATE", label: "Doktoranckie" },
  { value: "POST-GRADUATE", label: "Podyplomowe" },
  { value: "OTHER", label: "Inne" },
] as const;

export const STUDIES_TYPES_VALUES = STUDIES_TYPES.map((t) => t.value);

export const FIELDS_OF_STUDY: Record<
  string,
  { value: string; label: string }[]
> = {
  WEAIiIB: [
    { value: "ET", label: "Elektrotechnika" },
    { value: "AiR", label: "Automatyka i Robotyka" },
    { value: "IB", label: "Inżynieria Biomedyczna" },
  ],
  WIEiT: [
    { value: "INFA", label: "Informatyka" },
    { value: "ELE", label: "Elektronika" },
    { value: "TEL", label: "Telekomunikacja" },
  ],
  WGGiIŚ: [
    { value: "GiK", label: "Geodezja i Kartografia" },
    { value: "IiMŚ", label: "Inżynieria i Monitoring Środowiska" },
  ],
  WIMiIP: [
    { value: "IM", label: "Inżynieria Metali" },
    { value: "IP", label: "Informatyka Przemysłowa" },
  ],
  WIMiR: [
    { value: "MiBM", label: "Mechanika i Budowa Maszyn" },
    { value: "RiA", label: "Robotyka i Automatyka" },
  ],
  WFiIS: [
    { value: "FT", label: "Fizyka Techniczna" },
    { value: "IS", label: "Informatyka Stosowana" },
  ],
  WH: [
    { value: "SOC", label: "Socjologia" },
    { value: "KUL", label: "Kulturoznawstwo" },
    { value: "IS", label: "Informatyka Społeczna" },
  ],
} as const;

export const THESIS_STATUS = {
  FREE: "FREE",
  TAKEN: "TAKEN",
  COMPLETED: "COMPLETED",
} as const;

export const DEGREES = [
  { value: "BACHELOR", label: "I stopnia (inżynierskie/licencjackie)" },
  { value: "MASTER", label: "II stopnia (magisterskie)" },
  { value: "DOCTORAL", label: "III stopnia (doktoranckie)" },
  { value: "POSTGRADUATE", label: "Podyplomowe" },
] as const;

export const DEGREES_VALUES = DEGREES.map((d) => d.value);
