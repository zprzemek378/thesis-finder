import React from "react";
import { Link } from "react-router-dom";
import { Thesis } from "@/types/thesis";
import UserCard from "@/components/user/UserCard";
import { getDegreeLabel } from "@/utils/degreeUtils";

interface ThesisSidebarProps {
  thesis: Thesis;
}

const ThesisSidebar = ({ thesis }: ThesisSidebarProps) => {
  const availableSlots = thesis.studentsLimit - thesis.students.length;
  console.log(thesis);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full text-left">
      <Link
        to="/search"
        className="flex items-center text-[var(--o-blue)] mb-6 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Wstecz
      </Link>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-medium">Typ pracy:</p>
          <p>{getDegreeLabel(thesis.degree)}</p>
        </div>

        <div>
          <p className="font-medium">Promotor:</p>
          <div className="border rounded-md">
            <div className="flex items-center p-3">
              <p>
                {thesis.supervisor._doc.academicTitle}{" "}
                {thesis.supervisor.user.firstName}{" "}
                {thesis.supervisor.user.lastName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-medium">Limit miejsc:</p>
          <p>{thesis.studentsLimit}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-medium">Dostępne miejsca:</p>
          <p className="text-[var(--o-yellow)]">{availableSlots}</p>
        </div>

        <div>
          <p className="font-medium mb-2">Zapisani uczestnicy:</p>
          <div className="border rounded-md">
            {thesis.students.map((student) => (
              <UserCard
                key={student._id}
                user={student}
                description={`Informatyka, pierwszego stopnia, stacjonarne`}
              />
            ))}

            {Array.from({ length: availableSlots }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="p-4 border-b last:border-b-0 text-[var(--o-green)]"
              >
                Dostępne
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisSidebar;
