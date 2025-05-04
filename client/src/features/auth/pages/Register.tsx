import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AuthLayout from "@/common/layout/AuthLayout"

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    acceptTerms: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "",
      acceptTerms: "",
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

    if (!formData.userType) {
      newErrors.userType = "Typ użytkownika jest wymagany";
      isValid = false;
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Musisz zaakceptować regulamin";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Tutaj będzie logika rejestracji z backendem
      console.log("Rejestracja:", formData);
      // Na razie przekierowanie do strony logowania
      navigate("/login");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Czyść błąd podczas pisania
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
      userType: value
    }));
    
    if (errors.userType) {
      setErrors((prev) => ({
        ...prev,
        userType: "",
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      acceptTerms: checked
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
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl my-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Back button */}
            <div className="mb-6">
              <Link to="/login" className="inline-flex items-center text-[var(--o-blue)] hover:underline">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dane osobowe section */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--o-blue)] mb-4">Dane osobowe</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Imię
                    </label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={!!errors.firstName}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nazwisko
                    </label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={!!errors.lastName}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adres e-mail
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Dane konta section */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--o-blue)] mb-4">Dane konta</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Hasło
                    </label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Powtórz hasło
                    </label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Minimum 8 znaków, jedna wielka litera i jedna cyfra
                </p>

                <div className="mt-4">
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                    Typ użytkownika
                  </label>
                  <Select 
                    defaultValue={formData.userType} 
                    onValueChange={handleSelectChange}
                    placeholder="Wybierz typ konta"
                    error={!!errors.userType}
                  >
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="supervisor">Promotor</SelectItem>
                  </Select>
                  {errors.userType && (
                    <p className="mt-1 text-sm text-red-500">{errors.userType}</p>
                  )}
                </div>

                <div className="mt-6">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={handleCheckboxChange}
                    label="Akceptuję regulamin i politykę prywatności systemu"
                    error={!!errors.acceptTerms}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[var(--o-yellow)] hover:bg-[var(--o-yellow-dark)] text-black font-medium py-3 px-4 rounded"
              >
                Zarejestruj się
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