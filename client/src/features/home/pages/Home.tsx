import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/common/layout/MainLayout";
import ThesisCard from "@/features/thesis/components/ThesisCard";
import { Thesis } from "@/types/thesis";
import { getTheses } from "@/lib/api";

const Home = () => {
  const navigate = useNavigate();
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheses = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const data = await getTheses(token);
        setTheses(data);
      } catch (error) {
        console.error("Błąd podczas pobierania prac:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Wystąpił błąd podczas pobierania prac dyplomowych"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheses();
  }, [navigate]);

  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-[var(--o-blue)] mb-">
          Dostępne prace dyplomowe
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center">
              Ładowanie prac dyplomowych...
            </div>
          ) : error ? (
            <div className="col-span-full">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            </div>
          ) : theses.length === 0 ? (
            <div className="col-span-full text-center">
              Brak dostępnych prac dyplomowych
            </div>
          ) : (
            theses.map((thesis) => (
              <ThesisCard key={thesis._id} thesis={thesis} />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
