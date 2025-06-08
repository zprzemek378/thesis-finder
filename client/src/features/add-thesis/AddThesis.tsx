import MainLayout from "@/common/layout/MainLayout";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TagsInput } from "@/components/user/TagsInput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FACULTIES = [
  { name: "Wydział Górnictwa i Geoinżynierii", value: "WGiG" },
  {
    name: "Wydział Inżynierii Metali i Informatyki Przemysłowej",
    value: "WIMiIP",
  },
  { name: "Wydział Hutnictwa", value: "WH" },
  { name: "Wydział Inżynierii Mechanicznej i Robotyki", value: "WIMiR" },
  {
    name: "Wydział Elektrotechniki, Automatyki, Informatyki i Inżynierii Biomedycznej",
    value: "WEAIiIB",
  },
  {
    name: "Wydział Informatyki, Elektroniki i Telekomunikacji",
    value: "WIEiT",
  },
  { name: "Wydział Energetyki i Paliw", value: "WEiP" },
  { name: "Wydział Inżynierii Materiałowej i Ceramiki", value: "WIMiC" },
  { name: "Wydział Inżynierii Lądowej i Gospodarki Zasobami", value: "WILiGZ" },
  { name: "Wydział Geologii, Geofizyki i Ochrony Środowiska", value: "WGGiOŚ" },
  {
    name: "Wydział Geodezji Górniczej i Inżynierii Środowiska",
    value: "WGGiIŚ",
  },
  { name: "Wydział Matematyki Stosowanej", value: "WMS" },
  { name: "Wydział Fizyki i Informatyki Stosowanej", value: "WFIS" },
  { name: "Wydział Zarządzania", value: "WZ" },
  { name: "Wydział Humanistyczny", value: "WHuman" },
  { name: "Wydział Informatyki", value: "WI" },
];

const FIELDS_OF_STUDY: Record<string, { name: string; value: string }[]> = {
  WGiG: [
    { name: "Górnictwo i Geologia", value: "GiG" },
    { name: "Geoinżynieria", value: "GEO" },
  ],
  WIMiIP: [
    { name: "Inżynieria Metali", value: "IM" },
    { name: "Informatyka Przemysłowa", value: "IP" },
  ],
  WH: [{ name: "Hutnictwo", value: "HUT" }],
  WIMiR: [
    { name: "Mechanika i Budowa Maszyn", value: "MiBM" },
    { name: "Robotyka i Automatyka", value: "RiA" },
  ],
  WEAIiIB: [
    { name: "Elektrotechnika", value: "ET" },
    { name: "Automatyka i Robotyka", value: "AiR" },
    { name: "Inżynieria Biomedyczna", value: "IB" },
  ],
  WIEiT: [
    { name: "Informatyka", value: "INFA" },
    { name: "Elektronika", value: "ELE" },
    { name: "Telekomunikacja", value: "TEL" },
    { name: "Automatyka i Robotyka", value: "AiR" },
  ],
  WEiP: [
    { name: "Energetyka", value: "ENE" },
    { name: "Technologia Paliw", value: "TP" },
  ],
  WIMiC: [
    { name: "Inżynieria Materiałowa", value: "IMat" },
    { name: "Ceramika", value: "CER" },
  ],
  WILiGZ: [
    { name: "Inżynieria Lądowa", value: "IL" },
    { name: "Gospodarka Zasobami", value: "GZ" },
  ],
  WGGiOŚ: [
    { name: "Geologia", value: "GEO" },
    { name: "Geofizyka", value: "GF" },
    { name: "Ochrona Środowiska", value: "OŚ" },
  ],
  WGGiIŚ: [
    { name: "Geodezja i Kartografia", value: "GiK" },
    { name: "Inżynieria i Monitoring Środowiska", value: "IiMŚ" },
    { name: "Informatyka Geoprzestrzenna", value: "IG" },
  ],
  WMS: [{ name: "Matematyka Stosowana", value: "MS" }],
  WFIS: [
    { name: "Fizyka Techniczna", value: "FT" },
    { name: "Informatyka Stosowana", value: "IS" },
  ],
  WZ: [
    { name: "Zarządzanie", value: "ZAR" },
    { name: "Informatyka i Ekonometria", value: "IiE" },
    { name: "Zarządzanie i Inżynieria Produkcji", value: "ZiIP" },
  ],
  WHuman: [
    { name: "Socjologia", value: "SOC" },
    { name: "Kulturoznawstwo", value: "KUL" },
    { name: "Informatyka Społeczna", value: "IS" },
    { name: "Nowoczesne Technologie w Kryminalistyce", value: "NTwK" },
    { name: "Tworzenie Przestrzeni Wirtualnych i Gier", value: "TPWiG" },
  ],
  WI: [
    { name: "Informatyka", value: "INFA" },
    { name: "Data Science", value: "DS" },
  ],
};

const STUDY_TYPES = [
  { name: "Studia stacjonarne I stopnia (inżynierskie)", value: "stac_ing" },
  { name: "Studia stacjonarne II stopnia (magisterskie)", value: "stac_mag" },
  {
    name: "Studia niestacjonarne I stopnia (inżynierskie)",
    value: "niestac_ing",
  },
  {
    name: "Studia niestacjonarne II stopnia (magisterskie)",
    value: "niestac_mag",
  },
  { name: "Studia jednolite magisterskie", value: "jednolite" },
];

const AddThesis = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    faculty: "",
    field: "",
    type: "",
    tags: [],
    slots: 1,
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    faculty: "",
    field: "",
    type: "",
    tags: "",
    slots: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: "",
      description: "",
      faculty: "",
      field: "",
      type: "",
      tags: "",
      slots: "",
    };

    // Tytuł
    if (!formData.title) {
      newErrors.title = "Tytuł jest wymagany";
      isValid = false;
    } else if (formData.title.length < 3) {
      newErrors.title = "Tytuł musi zawierać co najmniej 3 znaki";
      isValid = false;
    }

    // Opis
    if (!formData.description) {
      newErrors.description = "Opis jest wymagany";
      isValid = false;
    } else if (formData.description.length < 10) {
      newErrors.description = "Opis musi zawierać co najmniej 10 znaków";
      isValid = false;
    }

    // Wydział
    if (!formData.faculty) {
      newErrors.faculty = "Wydział jest wymagany";
      isValid = false;
    }

    // Kierunek
    if (
      !formData.field ||
      !FIELDS_OF_STUDY[formData.faculty].some(
        (field) => field.value === formData.field
      )
    ) {
      newErrors.field = "Kierunek jest wymagany";
      isValid = false;
    }

    // Typ studiów
    if (!formData.type) {
      newErrors.type = "Typ studiów jest wymagany";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // TODO
      console.log("publishing:", formData);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | string[] } }
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <MainLayout>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 md:w-7xl">
          <h2 className="text-2xl font-bold text-center text-[var(--o-blue)] mb-8">
            Propozycja nowego tematu pracy dyplomowej
          </h2>

          <h3 className="text-xl font-bold text-[var(--o-blue)] mb-8">
            Podstawowe informacje
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tytuł*
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                placeholder="Wprowadź tytuł pracy dyplomowej"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Opis*
              </label>
              <Textarea
                className="h-54"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                placeholder="Wprowadź szczegółowy opis zawierający zakres pracy, cele, metodologię itp."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <h3 className="text-xl font-bold text-[var(--o-blue)] mb-8">
              Wymagania i kategorie
            </h3>

            <div className="flex gap-3 flex-col xl:flex-row">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wydział*
                </label>
                <Select
                  className="h-13"
                  value={formData.faculty}
                  onValueChange={(value) => {
                    handleChange({ target: { name: "faculty", value } });
                  }}
                  error={!!errors.faculty}
                  placeholder="Wybierz wydział"
                >
                  {FACULTIES.map((f) => (
                    <SelectItem value={f.value}>{f.name}</SelectItem>
                  ))}
                </Select>
                {errors.faculty && (
                  <p className="mt-1 text-sm text-red-500">{errors.faculty}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kierunek*
                </label>
                <Select
                  className="h-13"
                  value={formData.field}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "field", value } })
                  }
                  error={!!errors.field}
                  placeholder="Wybierz kierunek"
                >
                  {FIELDS_OF_STUDY[formData.faculty as string]?.map((f) => (
                    <SelectItem value={f.value}>{f.name}</SelectItem>
                  ))}
                </Select>
                {errors.field && (
                  <p className="mt-1 text-sm text-red-500">{errors.field}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Typ studiów*
                </label>
                <Select
                  className="h-13"
                  value={formData.type}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "type", value } })
                  }
                  error={!!errors.type}
                  placeholder="Wybierz wydział"
                >
                  {STUDY_TYPES.map((f) => (
                    <SelectItem value={f.value}>{f.name}</SelectItem>
                  ))}
                </Select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 flex-col xl:flex-row">
              <div className="flex-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Słowa kluczowe/tagi
                </label>
                <TagsInput
                  className="h-[58px]"
                  tags={formData.tags}
                  setTags={(value) =>
                    handleChange({ target: { name: "tags", value } })
                  }
                  placeholder="Wpisz tag i zatwierdź enterem lub przecinkiem"
                  error={!!errors.tags}
                />
                {errors.type && (
                  <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
                )}
              </div>

              <div className="flex-1">
                <label
                  htmlFor="slots"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Liczba miejsc*
                </label>
                <Input
                  className="h-[58px]"
                  type="number"
                  min={1}
                  id="slots"
                  name="slots"
                  value={formData.slots}
                  onChange={handleChange}
                  error={!!errors.slots}
                  placeholder="Wprowadź ilość miejsc"
                />
                {errors.slots && (
                  <p className="mt-1 text-sm text-red-500">{errors.slots}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--o-yellow)] hover:bg-[var(--o-yellow-dark)] text-black font-medium py-2 px-4 rounded"
            >
              Opublikuj
            </Button>
          </form>
        </div>
      </main>
    </MainLayout>
  );
};

export default AddThesis;
