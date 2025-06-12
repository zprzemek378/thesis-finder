import React, { useEffect, useState } from "react";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import * as Separator from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import MainLayout from "@/common/layout/MainLayout";
import ThesisSidebar from "@/features/thesis/components/ThesisSidebar";
import StarButton from "@/components/ui/star-button";
import { Thesis } from "@/types/thesis";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getThesisById, createThesisRequest, createChat } from "@/lib/api";
import { getDegreeLabel } from "@/utils/degreeUtils";

const ThesisDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoinRequestLoading, setIsJoinRequestLoading] = useState(false);
  const [joinRequestError, setJoinRequestError] = useState<string | null>(null);
  const [joinRequestSuccess, setJoinRequestSuccess] = useState(false);

  // Calculate available spots
  const availableSlots = thesis
    ? thesis.studentsLimit - thesis.students.length
    : 0;

  useEffect(() => {
    const fetchThesis = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        if (!id) {
          setError("Nie znaleziono ID pracy dyplomowej");
          return;
        }

        const data = await getThesisById(id, token);
        setThesis(data);
      } catch (error) {
        console.error("Błąd podczas pobierania pracy:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Wystąpił błąd podczas pobierania pracy dyplomowej"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchThesis();
  }, [id, navigate]);

  const handleSendMessage = () => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") ?? "");
        const token = localStorage.getItem("accessToken");
        if (!token || !user || !thesis) {
          navigate("/login");
          return;
        }

        await createChat(
          {
            members: [user._id, thesis.supervisor._id],
            title: thesis.title,
          },
          token
        );

        navigate("/chats");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Wystąpił błąd podczas tworzenia czatu."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6 text-center">Ładowanie...</div>
      </MainLayout>
    );
  }

  if (error || !thesis) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error || "Nie znaleziono pracy dyplomowej"}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <ThesisSidebar thesis={thesis} />
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-[var(--o-blue)]">
                  {thesis.title}
                </h1>
                <StarButton initialState={true} />
              </div>

              <div className="mb-6">
                <p className="text-gray-600">{thesis.faculty}</p>
                <p className="text-gray-500">
                  Stopień: {getDegreeLabel(thesis.degree)}
                </p>
              </div>

              <Separator.Root className="h-px bg-gray-200 my-4" />

              <AspectRatio.Root ratio={16 / 9} className="mb-8">
                <div className="h-full overflow-auto">
                  <p className="text-gray-800 whitespace-pre-line">
                    {thesis.description}
                  </p>
                </div>
              </AspectRatio.Root>

              <Separator.Root className="h-px bg-gray-200 my-4" />

              <div className="flex flex-col space-y-4">
                {joinRequestError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {joinRequestError}
                  </div>
                )}
                {joinRequestSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    Prośba o dołączenie została wysłana pomyślnie!
                  </div>
                )}
                <div className="flex space-x-4">
                  {(() => {
                    const userData = localStorage.getItem("user");
                    const user = userData ? JSON.parse(userData) : null;
                    if (user?.role === "STUDENT") {
                      return (
                        <>
                          <Button
                            className="bg-[var(--o-yellow)] hover:bg-[var(--o-yellow-dark)] text-black"
                            onClick={async () => {
                              try {
                                setIsJoinRequestLoading(true);
                                setJoinRequestError(null);
                                const token =
                                  localStorage.getItem("accessToken");
                                if (!token) {
                                  navigate("/login");
                                  return;
                                }
                                await createThesisRequest(thesis, token);
                                setJoinRequestSuccess(true);
                              } catch (error) {
                                console.error(
                                  "Błąd podczas wysyłania prośby o dołączenie:",
                                  error
                                );
                                setJoinRequestError(
                                  error instanceof Error
                                    ? error.message
                                    : "Wystąpił błąd podczas wysyłania prośby o dołączenie."
                                );
                              } finally {
                                setIsJoinRequestLoading(false);
                              }
                            }}
                            disabled={
                              isJoinRequestLoading ||
                              joinRequestSuccess ||
                              thesis.students.some(
                                (student) => student._id === user?.student
                              ) ||
                              availableSlots === 0
                            }
                          >
                            {isJoinRequestLoading
                              ? "Wysyłanie..."
                              : joinRequestSuccess
                              ? "Wysłano prośbę"
                              : thesis.students.some(
                                  (student) => student._id === user?.student
                                )
                              ? "Już dołączono"
                              : availableSlots === 0
                              ? "Brak miejsc"
                              : "Dołącz"}
                          </Button>
                          <Button
                            onClick={handleSendMessage}
                            variant="outline"
                            className="border-[var(--o-blue)] text-[var(--o-blue)]"
                          >
                            Wyślij wiadomość
                          </Button>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ThesisDetails;
