import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AuthLayout from "@/common/layout/AuthLayout";
import {
  FACULTIES,
  STUDIES_TYPES,
  DEGREES,
  API_URL,
} from "../../../../../shared/constants";
import type {
  Faculty,
  StudiesType,
  Degree,
  UserRole,
} from "../../../../../shared/types";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  faculty: Faculty;
  role: UserRole;
  acceptTerms: boolean;
  degree: Degree;
  studiesType: StudiesType;
  studiesStartDate: string;
  academicTitle: string;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  faculty: string;
  role: string;
  acceptTerms: string;
  degree: string;
  studiesType: string;
  studiesStartDate: string;
  academicTitle: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    faculty: FACULTIES[0].value as Faculty,
    role: "" as UserRole,
    acceptTerms: false,
    degree: "" as Degree,
    studiesType: "" as StudiesType,
    studiesStartDate: "",
    academicTitle: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    faculty: "",
    acceptTerms: "",
    degree: "",
    studiesType: "",
    studiesStartDate: "",
    academicTitle: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      faculty: "",
      acceptTerms: "",
      degree: "",
      studiesType: "",
      studiesStartDate: "",
      academicTitle: "",
    };

    if (!formData.firstName) {
      newErrors.firstName = "Imię jest wymagane";
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = "Nazwisko jest wymagane";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email jest wymagany";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Podaj prawidłowy adres email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Hasło jest wymagane";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Hasło musi mieć co najmniej 8 znaków";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Potwierdzenie hasła jest wymagane";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Hasła muszą być identyczne";
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = "Typ użytkownika jest wymagany";
      isValid = false;
    }

    if (!formData.faculty) {
      newErrors.faculty = "Wydział jest wymagany";
      isValid = false;
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Musisz zaakceptować regulamin";
      isValid = false;
    }

    if (formData.role === "STUDENT") {
      if (!formData.degree) {
        newErrors.degree = "Wybierz stopień studiów";
        isValid = false;
      }
      if (!formData.studiesType) {
        newErrors.studiesType = "Wybierz typ studiów";
        isValid = false;
      }
      if (!formData.studiesStartDate) {
        newErrors.studiesStartDate = "Wybierz datę rozpoczęcia studiów";
        isValid = false;
      }
    }

    if (formData.role === "SUPERVISOR") {
      if (!formData.academicTitle) {
        newErrors.academicTitle = "Wybierz tytuł naukowy";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (validateForm()) {
      setIsLoading(true);
      try {
        const registerData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          faculty: formData.faculty,
          role: formData.role,
          studentData:
            formData.role === "STUDENT"
              ? {
                  degree: formData.degree,
                  studiesType: formData.studiesType,
                  studiesStartDate: formData.studiesStartDate,
                }
              : undefined,
          supervisorData:
            formData.role === "SUPERVISOR"
              ? {
                  academicTitle: formData.academicTitle,
                }
              : undefined,
        };

        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Błąd rejestracji");
        }

        navigate("/login", {
          state: {
            message:
              "Rejestracja zakończona sukcesem. Możesz się teraz zalogować.",
          },
        });
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : "Wystąpił błąd podczas rejestracji"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value === "student" ? "STUDENT" : "SUPERVISOR",
    }));

    if (errors.role) {
      setErrors((prev) => ({
        ...prev,
        role: "",
      }));
    }
  };

  const handleFacultyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      faculty: value as Faculty,
    }));

    if (errors.faculty) {
      setErrors((prev) => ({
        ...prev,
        faculty: "",
      }));
    }
  };

  const handleStudiesTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      studiesType: value as StudiesType,
    }));

    if (errors.studiesType) {
      setErrors((prev) => ({
        ...prev,
        studiesType: "",
      }));
    }
  };

  const handleDegreeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      degree: value as Degree,
    }));

    if (errors.degree) {
      setErrors((prev) => ({
        ...prev,
        degree: "",
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      acceptTerms: checked,
    }));

    if (errors.acceptTerms) {
      setErrors((prev) => ({
        ...prev,
        acceptTerms: "",
      }));
    }
  };

  return (
    <AuthLayout>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl my-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Back button */}
            <div className="mb-6">
              <Link
                to="/login"
                className="inline-flex items-center text-[var(--o-blue)] hover:underline"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M19 12H5M12 19l-7-7 7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ml-2">Wstecz</span>
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-center text-[var(--o-blue)] mb-4">
              Rejestracja w systemie
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Wypełnij poniższy formularz, aby utworzyć nowe konto
            </p>

            {serverError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dane osobowe section */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--o-blue)] mb-4">
                  Dane osobowe
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Imię
                    </label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={!!errors.firstName}
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nazwisko
                    </label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={!!errors.lastName}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Adres e-mail
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Dane konta section */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--o-blue)] mb-4">
                  Dane konta
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Hasło
                    </label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Powtórz hasło
                    </label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={!!errors.confirmPassword}
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Minimum 8 znaków, jedna wielka litera i jedna cyfra
                </p>

                <div className="mt-4">
                  <label
                    htmlFor="userType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Typ użytkownika
                  </label>
                  <Select
                    defaultValue={formData.role.toLowerCase()}
                    onValueChange={handleSelectChange}
                    placeholder="Wybierz typ konta"
                    error={!!errors.role}
                    disabled={isLoading}
                  >
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="supervisor">Promotor</SelectItem>
                  </Select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-500">{errors.role}</p>
                  )}
                </div>

                {formData.role === "STUDENT" && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label
                        htmlFor="degree"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Stopień studiów
                      </label>
                      <Select
                        defaultValue={formData.degree}
                        onValueChange={handleDegreeChange}
                        placeholder="Wybierz stopień studiów"
                        error={!!errors.degree}
                        disabled={isLoading}
                      >
                        {DEGREES.map((degree) => (
                          <SelectItem key={degree.value} value={degree.value}>
                            {degree.label}
                          </SelectItem>
                        ))}
                      </Select>
                      {errors.degree && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.degree}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="studiesType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tryb studiów
                      </label>
                      <Select
                        defaultValue={formData.studiesType}
                        onValueChange={handleStudiesTypeChange}
                        placeholder="Wybierz tryb studiów"
                        error={!!errors.studiesType}
                        disabled={isLoading}
                      >
                        {STUDIES_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </Select>
                      {errors.studiesType && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.studiesType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="studiesStartDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Data rozpoczęcia studiów
                      </label>
                      <Input
                        type="date"
                        id="studiesStartDate"
                        name="studiesStartDate"
                        value={formData.studiesStartDate}
                        onChange={handleChange}
                        error={!!errors.studiesStartDate}
                        disabled={isLoading}
                      />
                      {errors.studiesStartDate && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.studiesStartDate}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {formData.role === "SUPERVISOR" && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label
                        htmlFor="academicTitle"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tytuł:
                      </label>
                      <Input
                        type="text"
                        id="academicTitle"
                        name="academicTitle"
                        value={formData.academicTitle}
                        onChange={handleChange}
                        error={!!errors.academicTitle}
                        disabled={isLoading}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.academicTitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label
                    htmlFor="faculty"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Wydział
                  </label>
                  <Select
                    defaultValue={formData.faculty}
                    onValueChange={handleFacultyChange}
                    placeholder="Wybierz wydział"
                    error={!!errors.faculty}
                    disabled={isLoading}
                  >
                    {FACULTIES.map((faculty) => (
                      <SelectItem key={faculty.value} value={faculty.value}>
                        {faculty.label}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.faculty && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.faculty}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={handleCheckboxChange}
                    label="Akceptuję regulamin i politykę prywatności systemu"
                    error={!!errors.acceptTerms}
                    disabled={isLoading}
                  />
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.acceptTerms}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[var(--o-yellow)] hover:bg-[var(--o-yellow-dark)] text-black font-medium py-3 px-4 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Rejestracja..." : "Zarejestruj się"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Masz już konto?{" "}
                <Link
                  to="/login"
                  className="text-[var(--o-blue)] hover:underline font-medium"
                >
                  Zaloguj się
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
};

export default Register;
