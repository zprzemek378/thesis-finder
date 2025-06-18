import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getSupervisors, createChat } from "@/lib/api";

interface Supervisor {
  _id: string;
  academicTitle: string;
  faculty: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

const SupervisorsList = () => {
  const navigate = useNavigate();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }
        const data = await getSupervisors(token);
        console.log(data);
        setSupervisors(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Wystąpił błąd podczas pobierania promotorów"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, [navigate]);

  const handleCreateChat = async (supervisorId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user") || "");

      if (!token || !user) {
        navigate("/login");
        return;
      }

      await createChat(
        {
          members: [user._id, supervisorId],
          title: "Nowa konwersacja",
        },
        token
      );

      navigate("/chats");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Wystąpił błąd podczas tworzenia czatu"
      );
    }
  };

  if (loading) {
    return <div className="text-center py-4">Ładowanie promotorów...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Lista promotorów</h2>
      {supervisors.map((supervisor) => (
        <div
          key={supervisor._id}
          className="flex items-center justify-between border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div>
            <p className="font-medium">
              {supervisor.academicTitle} {supervisor.user.firstName}{" "}
              {supervisor.user.lastName}
            </p>
            <p className="text-sm text-gray-500">{supervisor.faculty}</p>
          </div>
          <Button
            onClick={() => handleCreateChat(supervisor.user._id)}
            className="bg-[var(--o-blue)] hover:bg-[var(--o-blue-dark)]"
          >
            Rozpocznij czat
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SupervisorsList;
