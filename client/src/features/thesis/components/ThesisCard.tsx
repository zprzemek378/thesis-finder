import React from "react";
import { Link } from "react-router-dom";
import { Thesis } from "@/types/thesis";
import StarButton from "@/components/ui/star-button";

interface ThesisCardProps {
  thesis: Thesis;
}

const ThesisCard = ({ thesis }: ThesisCardProps) => {
  const availableSlots = thesis.studentsLimit - thesis.students.length;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold text-[var(--o-blue)]">
          <Link to={`/thesis/${thesis._id}`} className="hover:underline">
            {thesis.title}
          </Link>
        </h2>
        <StarButton />
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        {thesis.faculty}
      </p>
      
      <p className="text-gray-800 mb-6 line-clamp-3 flex-grow">
        {thesis.description}
      </p>
      
      <div className="mt-auto">
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="font-medium">Promotor:</span> {thesis.supervisor.academicTitle} {thesis.supervisor.lastName}
          </div>
          <div className={`font-medium ${availableSlots > 0 ? "text-[var(--o-green)]" : "text-[var(--o-red)]"}`}>
            {availableSlots > 0 ? `Dostępne miejsca: ${availableSlots}` : "Brak miejsc"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisCard;