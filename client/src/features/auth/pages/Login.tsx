import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/common/layout/AuthLayout"

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Hasło musi mieć co najmniej 6 znaków";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Tutaj będzie logika logowania z backendem
      console.log("Logowanie:", formData);
      // Na razie przekierowanie do strony głównej
      navigate("/");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Czyść błąd podczas pisania
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <AuthLayout>
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Back button */}
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center text-[var(--o-blue)] hover:underline">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="ml-2">Wstecz</span>
              </Link>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-[var(--o-blue)] mb-8">
              Zaloguj się
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  placeholder="Wprowadź adres email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

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
                  placeholder="Wprowadź hasło"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[var(--o-yellow)] hover:bg-[var(--o-yellow-dark)] text-black font-medium py-2 px-4 rounded"
              >
                Zaloguj się
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Nie masz konta?{" "}
                <Link
                  to="/register"
                  className="text-[var(--o-blue)] hover:underline font-medium"
                >
                  Zarejestruj się
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <Link
                  to="/forgot-password"
                  className="text-[var(--o-blue)] hover:underline font-medium"
                >
                  Zapomniałem hasła
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
};

export default Login;