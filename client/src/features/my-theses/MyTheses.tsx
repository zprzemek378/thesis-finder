import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/common/layout/MainLayout";
import ThesisCard from "@/features/thesis/components/ThesisCard";
import { Button } from "@/components/ui/button";
import { Thesis } from "@/types/thesis";
import { Request } from "@/types/request";
import {
  getSupervisorTheses,
  getSupervisorRequests,
  updateRequestStatus,
} from "@/lib/api";

const MyTheses = () => {
  const navigate = useNavigate();
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");

        if (!userData || !token) {
          navigate("/login");
          return;
        }

        const user = JSON.parse(userData);
        if (user.role !== "SUPERVISOR") {
          setError("Tylko promotorzy mają dostęp do tej strony.");
          return;
        }

        const [thesesData, requestsData] = await Promise.all([
          getSupervisorTheses(user.supervisor, token),
          getSupervisorRequests(user.supervisor, token),
        ]);

        console.log(requestsData);

        setTheses(thesesData);
        setRequests(requestsData);
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Wystąpił błąd podczas pobierania danych"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleRequestAction = async (
    requestId: string,
    thesisId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      await updateRequestStatus(requestId, thesisId, status, token);

      // Update local state to reflect the change
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status } : request
        )
      );
    } catch (error) {
      console.error("Błąd podczas aktualizacji statusu:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Wystąpił błąd podczas aktualizacji statusu"
      );
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6 text-center">Ładowanie...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-[var(--o-blue)] mb-6">
          Moje prace dyplomowe
        </h1>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Prace dyplomowe</h2>
            {theses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {theses.map((thesis) => (
                  <ThesisCard key={thesis._id} thesis={thesis} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Nie masz jeszcze żadnych prac dyplomowych
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Prośby o dołączenie</h2>

            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-lg shadow-md p-4 space-y-2"
              >
                <div>
                  <p className="font-medium">
                    {request.studentUser?.firstName &&
                    request.studentUser?.lastName
                      ? `${request.studentUser.firstName} ${request.studentUser.lastName}`
                      : "Nieznany student"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Wydział: {request.studentUser?.faculty || "Brak danych"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Typ studiów: {request.student?.studiesType || "Brak danych"}{" "}
                    | Stopień: {request.student?.degree || "Brak danych"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Rozpoczęcie studiów:{" "}
                    {request.student?.studiesStartDate
                      ? new Date(
                          request.student.studiesStartDate
                        ).toLocaleDateString()
                      : "Brak danych"}
                  </p>
                </div>

                {request.content && (
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {request.content}
                  </p>
                )}

                <p className="text-xs text-gray-400">
                  Utworzono: {new Date(request.createdAt).toLocaleString()}
                </p>

                {request.status === "PENDING" && (
                  <div className="flex space-x-2 pt-2">
                    <Button
                      onClick={() =>
                        handleRequestAction(
                          request._id,
                          request.thesisId,
                          "APPROVED"
                        )
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Zatwierdź
                    </Button>
                    <Button
                      onClick={() =>
                        handleRequestAction(
                          request._id,
                          request.thesisId,
                          "REJECTED"
                        )
                      }
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      Odrzuć
                    </Button>
                  </div>
                )}
                {request.status === "APPROVED" && (
                  <div className="text-green-600 font-medium text-center pt-2">
                    Zatwierdzona
                  </div>
                )}
                {request.status === "REJECTED" && (
                  <div className="text-red-600 font-medium text-center pt-2">
                    Odrzucona
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyTheses;
