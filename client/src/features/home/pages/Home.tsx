import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/common/layout/MainLayout";
import ThesisCard from "@/features/thesis/components/ThesisCard";
import { Thesis, ThesisStatus } from "@/types/thesis";
import { getTheses } from "@/lib/api";
import { Select, SelectItem } from "@/components/ui/select";
import { TagsInput } from "@/components/user/TagsInput";
import { Button } from "@/components/ui/button";
import {
  FIELDS_OF_STUDY,
  DEGREES,
  FACULTIES,
} from "../../../../../shared/constants";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterState {
  degree: string;
  faculty: string;
  field: string;
  status: string;
  tags: string[];
}

const STATUSES: { value: ThesisStatus; label: string }[] = [
  { value: "FREE", label: "Wolne" },
  { value: "TAKEN", label: "Zajęte" },
  { value: "PENDING_APPROVAL", label: "Oczekujące" },
  { value: "ARCHIVED", label: "Zarchiwizowane" },
];

const initialFilters: FilterState = {
  degree: "all",
  faculty: "all",
  field: "all",
  status: "all",
  tags: [],
};

const getActiveFilterCount = (filters: FilterState): number => {
  let count = 0;
  if (filters.degree && filters.degree !== "all") count++;
  if (filters.faculty && filters.faculty !== "all") count++;
  if (filters.field && filters.field !== "all") count++;
  if (filters.status && filters.status !== "all") count++;
  count += filters.tags.length;
  return count;
};

const Home = () => {
  const navigate = useNavigate();
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const fetchTheses = useCallback(
    async (currentFilters: FilterState) => {
      try {
        setIsFiltering(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const queryParams: Partial<FilterState> = {};
        if (currentFilters.degree && currentFilters.degree !== "all")
          queryParams.degree = currentFilters.degree;
        if (currentFilters.field && currentFilters.field !== "all")
          queryParams.field = currentFilters.field;
        if (currentFilters.status && currentFilters.status !== "all")
          queryParams.status = currentFilters.status;
        if (currentFilters.tags.length > 0)
          queryParams.tags = currentFilters.tags;

        const data = await getTheses(token, queryParams);
        setTheses(data);
        setError(null);
      } catch (error) {
        console.error("Błąd podczas pobierania prac:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Wystąpił błąd podczas pobierania prac dyplomowych"
        );
      } finally {
        setIsLoading(false);
        setIsFiltering(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    fetchTheses(filters);
  }, [fetchTheses, filters]);

  const handleFilterChange = (
    name: keyof FilterState,
    value: string | string[]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFacultyChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      faculty: value,
      field: "all", // Reset field when faculty changes
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== "all"
  );

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--o-blue)]">
            Dostępne prace dyplomowe
          </h1>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleResetFilters}
              disabled={isFiltering}
              className="flex items-center gap-2"
            >
              <span>Resetuj filtry</span>
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-[var(--o-blue)] text-white rounded-full">
                {activeFilterCount}
              </span>
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Filtr: Stopień */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stopień
              </label>
              <Select
                value={filters.degree}
                onValueChange={(value) => handleFilterChange("degree", value)}
                placeholder="Wybierz stopień"
                disabled={isFiltering}
              >
                <SelectItem value="all">Wszystkie</SelectItem>
                {DEGREES.map((degree) => (
                  <SelectItem key={degree.value} value={degree.value}>
                    {degree.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Filtr: Wydział */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wydział
              </label>
              <Select
                value={filters.faculty}
                onValueChange={handleFacultyChange}
                placeholder="Wybierz wydział"
                disabled={isFiltering}
              >
                <SelectItem value="all">Wszystkie</SelectItem>
                {FACULTIES.map((faculty) => (
                  <SelectItem key={faculty.value} value={faculty.value}>
                    {faculty.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Filtr: Kierunek */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kierunek
              </label>
              <Select
                value={filters.field}
                onValueChange={(value) => handleFilterChange("field", value)}
                placeholder="Wybierz kierunek"
                disabled={isFiltering || filters.faculty === "all"}
              >
                <SelectItem value="all">Wszystkie</SelectItem>
                {filters.faculty !== "all" &&
                  FIELDS_OF_STUDY[filters.faculty]?.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
              </Select>
            </div>

            {/* Filtr: Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
                placeholder="Wybierz status"
                disabled={isFiltering}
              >
                <SelectItem value="all">Wszystkie</SelectItem>
                {STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Filtr: Tagi */}
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagi
              </label>
              <div
                className={cn({
                  "pointer-events-none opacity-50": isFiltering,
                })}
              >
                <TagsInput
                  tags={filters.tags}
                  setTags={(tags) => handleFilterChange("tags", tags)}
                  placeholder="Dodaj tagi"
                  error={false}
                  className="h-[42px] py-0 px-3"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--o-blue)]" />
              <span className="ml-2">Ładowanie prac dyplomowych...</span>
            </div>
          ) : error ? (
            <div className="col-span-full">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            </div>
          ) : theses.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              Brak dostępnych prac dyplomowych spełniających kryteria
            </div>
          ) : (
            <>
              {isFiltering && (
                <div className="col-span-full flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--o-blue)]" />
                  <span className="ml-2">Aktualizowanie wyników...</span>
                </div>
              )}
              {theses.map((thesis) => (
                <ThesisCard key={thesis._id} thesis={thesis} />
              ))}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
