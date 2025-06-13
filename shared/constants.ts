export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
  { value: "WI", label: "Wydział Informatyki" },
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
  WGGiIŚ: [
    { value: "GiK", label: "Geodezja i Kartografia" },
    { value: "IŚ", label: "Inżynieria Środowiska" },
    { value: "IMŚ", label: "Inżynieria i Monitoring Środowiska" },
  ],
  WGiG: [
    { value: "GiG", label: "Górnictwo i Geoinżynieria" },
    { value: "IG", label: "Inżynieria Górnicza" },
  ],
  WIMiC: [
    { value: "IMat", label: "Inżynieria Materiałowa" },
    { value: "Cer", label: "Ceramika" },
  ],
  WIMiIP: [
    { value: "IM", label: "Inżynieria Metali" },
    { value: "IP", label: "Informatyka Przemysłowa" },
  ],
  WIMiR: [
    { value: "MiBM", label: "Mechanika i Budowa Maszyn" },
    { value: "AiR", label: "Automatyka i Robotyka" },
    { value: "RiA", label: "Robotyka i Automatyka" },
    { value: "EiT", label: "Energetyka i Technologie Energetyczne" },
  ],
  WMS: [
    { value: "MS", label: "Matematyka Stosowana" },
    { value: "AN", label: "Analiza Danych" },
  ],
  WO: [{ value: "Odl", label: "Inżynieria Odlewnictwa" }],
  WFiIS: [
    { value: "FT", label: "Fizyka Techniczna" },
    { value: "ISF", label: "Informatyka Stosowana" },
    { value: "AI", label: "Analityka i Informatyka Przemysłowa" },
  ],
  WWNiG: [
    { value: "WiG", label: "Wiertnictwo i Geoinżynieria" },
    { value: "Nafta", label: "Inżynieria Naftowa i Gazownicza" },
  ],
  WEiP: [
    { value: "En", label: "Energetyka" },
    { value: "PiG", label: "Paliwa i Gospodarka Energetyczna" },
  ],
  WIEiT: [
    { value: "INF", label: "Informatyka" },
    { value: "EL", label: "Elektronika" },
    { value: "TEL", label: "Telekomunikacja" },
    { value: "EiT", label: "Elektronika i Telekomunikacja" },
    { value: "INFOTRON", label: "Informatyka i Systemy Inteligentne" },
  ],
  WZ: [
    { value: "ZM", label: "Zarządzanie" },
    { value: "IMiIS", label: "Informatyka i Metody Ilościowe w Zarządzaniu" },
  ],
  WH: [
    { value: "SOC", label: "Socjologia" },
    { value: "KUL", label: "Kulturoznawstwo" },
    { value: "ISpo", label: "Informatyka Społeczna" },
    { value: "FTZ", label: "Filozofia i Technologie Zrównoważonego Rozwoju" },
  ],
  WI: [
    {
      value: "Inf",
      label: "Informatyka",
    },
  ],
};

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
