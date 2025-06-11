import MainLayout from "@/common/layout/MainLayout";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TagsInput } from "@/components/user/TagsInput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StudyType } from "../../types/thesis";
import { createThesis } from "../../lib/api";
import {
  FACULTIES as FACULTIES_DATA,
  FIELDS_OF_STUDY as FIELDS_DATA,
  DEGREES as DEGREES_DATA,
} from "../../../../shared/constants";

interface Faculty {
  value: string;
  label: string;
}

interface Field {
  value: string;
  label: string;
}

interface Degree {
  value: StudyType;
  label: string;
}

const FACULTIES = FACULTIES_DATA;
const FIELDS_OF_STUDY = FIELDS_DATA;
const DEGREES = DEGREES_DATA;

interface ThesisFormData {
  title: string;
  description: string;
  faculty: string;
  field: string;
  degree: StudyType;
  tags: string[];
  studentsLimit: number;
}

const AddThesis = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ThesisFormData>({
    title: "",
    description: "",
    faculty: "",
    field: "",
    degree: "MASTER",
    tags: [],
    studentsLimit: 1,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    faculty: "",
    field: "",
    degree: "",
    tags: "",
    studentsLimit: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: "",
      description: "",
      faculty: "",
      field: "",
      degree: "",
      tags: "",
      studentsLimit: "",
    };

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = "Tytuł musi zawierać co najmniej 3 znaki";
      isValid = false;
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "Opis musi zawierać co najmniej 10 znaków";
      isValid = false;
    }

    if (!formData.faculty) {
      newErrors.faculty = "Wydział jest wymagany";
      isValid = false;
    }

    if (
      !formData.field ||
      !FIELDS_OF_STUDY[formData.faculty]?.some(
        (field: Field) => field.value === formData.field
      )
    ) {
      newErrors.field = "Kierunek jest wymagany";
      isValid = false;
    }

    if (!formData.degree) {
      newErrors.degree = "Stopień studiów jest wymagany";
      isValid = false;
    }

    if (formData.studentsLimit < 1) {
      newErrors.studentsLimit = "Limit studentów musi być większy od 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (validateForm()) {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const thesis = await createThesis(formData, token);
        navigate("/thesis/" + thesis._id);
      } catch (error) {
        console.error("Błąd podczas dodawania pracy:", error);
        setServerError(
          error instanceof Error
            ? error.message
            : "Wystąpił nieznany błąd podczas dodawania pracy."
        );

        if (
          error instanceof Error &&
          (error.message.includes("Zaloguj się ponownie") ||
            error.message.includes("Brak uprawnień"))
        ) {
          navigate("/login");
        }
      }
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | string[] | number } }
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

            <div className="flex gap-3 flex-col xl:flex-row">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wydział*
                </label>
                <Select
                  value={formData.faculty}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "faculty", value } })
                  }
                  error={!!errors.faculty}
                  placeholder="Wybierz wydział"
                >
                  {FACULTIES.map((faculty: Faculty) => (
                    <SelectItem key={faculty.value} value={faculty.value}>
                      {faculty.label}
                    </SelectItem>
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
                  value={formData.field}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "field", value } })
                  }
                  error={!!errors.field}
                  placeholder="Wybierz kierunek"
                >
                  {FIELDS_OF_STUDY[formData.faculty]?.map((field: Field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.field && (
                  <p className="mt-1 text-sm text-red-500">{errors.field}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stopień*
                </label>
                <Select
                  value={formData.degree}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "degree", value } })
                  }
                  error={!!errors.degree}
                  placeholder="Wybierz stopień"
                >
                  {DEGREES.map((degree: Degree) => (
                    <SelectItem key={degree.value} value={degree.value}>
                      {degree.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.degree && (
                  <p className="mt-1 text-sm text-red-500">{errors.degree}</p>
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
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
                )}
              </div>

              <div className="flex-1">
                <label
                  htmlFor="studentsLimit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Liczba miejsc*
                </label>
                <Input
                  className="h-[58px]"
                  type="number"
                  min={1}
                  id="studentsLimit"
                  name="studentsLimit"
                  value={formData.studentsLimit}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "studentsLimit",
                        value: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  error={!!errors.studentsLimit}
                  placeholder="Wprowadź ilość miejsc"
                />
                {errors.studentsLimit && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.studentsLimit}
                  </p>
                )}
              </div>
            </div>

            {serverError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{serverError}</span>
              </div>
            )}

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
