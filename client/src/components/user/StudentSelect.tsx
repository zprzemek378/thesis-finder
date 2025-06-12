import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "@/components/ui/select";
import { API_URL } from "../../../../shared/constants";
import { User } from "@/types/user";

interface StudentSelectProps {
  onSelect: (selectedStudentIds: string[]) => void;
  error?: boolean;
  selectedStudents?: string[];
  maxStudents: number;
}

const StudentSelect = ({
  onSelect,
  error,
  selectedStudents = [],
  maxStudents,
}: StudentSelectProps) => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await fetch(`${API_URL}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const users = await response.json();
        setStudents(users);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoadingError(
          error instanceof Error
            ? error.message
            : "Wystąpił błąd podczas pobierania listy studentów"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div>Ładowanie studentów...</div>;
  if (loadingError) return <div className="text-red-500">{loadingError}</div>;
  if (students.length === 0) return <div>Brak dostępnych studentów</div>;

  const handleSelect = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      // Remove student if already selected
      const newSelection = selectedStudents.filter((id) => id !== studentId);
      console.log("Removing student, new selection:", newSelection);
      onSelect(newSelection);
    } else if (selectedStudents.length < maxStudents) {
      // Add student if limit not reached
      const newSelection = [...selectedStudents, studentId];
      console.log("Adding student, new selection:", newSelection);
      onSelect(newSelection);
    }
  };

  return (
    <div className="space-y-2">
      {students
        .filter((student) => student.role === "STUDENT")
        .map((student) => (
          <div
            key={student._id}
            className={`flex items-center space-x-2 p-2 rounded border ${
              selectedStudents.includes(student.student?._id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            } ${
              selectedStudents.length >= maxStudents &&
              !selectedStudents.includes(student.student?._id)
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-50"
            }`}
            onClick={() => {
              if (!student.student?._id) return; // Guard against missing student ID
              if (
                !(
                  selectedStudents.length >= maxStudents &&
                  !selectedStudents.includes(student.student._id)
                )
              ) {
                handleSelect(student.student._id);
              }
            }}
          >
            <input
              type="checkbox"
              checked={selectedStudents.includes(student.student?._id || "")}
              readOnly
              className="rounded border-gray-300"
            />
            <span>
              {student.firstName} {student.lastName} ({student.faculty})
              {student.student?.degree ? ` - ${student.student.degree}` : ""}
            </span>
          </div>
        ))}
      {error && <p className="text-red-500">Wybierz studentów</p>}
    </div>
  );
};

export default StudentSelect;
