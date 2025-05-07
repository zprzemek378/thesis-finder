import React from "react";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import * as Separator from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import MainLayout from "@/common/layout/MainLayout";
import ThesisSidebar from "@/features/thesis/components/ThesisSidebar";
import StarButton from "@/components/ui/star-button";
import { Thesis } from "@/types/thesis";
import { User } from "@/types/user";
import { Link } from "react-router-dom";

// Przykładowe dane zgodne ze zrzutem ekranu
const mockSupervisor: User = {
  _id: "1",
  firstName: "Jan",
  lastName: "Kowalski",
  email: "jan.kowalski@university.edu",
  faculty: "Wydział Informatyki",
  role: "SUPERVISOR",
  academicTitle: "dr",
};

const mockStudents: User[] = [
  {
    _id: "2",
    firstName: "Michał",
    lastName: "Nowak",
    email: "michal.nowak@university.edu",
    faculty: "Wydział Informatyki",
    role: "STUDENT",
    degree: "Informatyka",
    studyYear: 1,
    studyMode: "STACJONARNE",
  },
  {
    _id: "3",
    firstName: "Tomasz",
    lastName: "Malinowski",
    email: "tomasz.malinowski@university.edu",
    faculty: "Wydział Informatyki",
    role: "STUDENT",
    degree: "Informatyka",
    studyYear: 1,
    studyMode: "STACJONARNE",
  },
];

const exampleThesis: Thesis = {
  _id: "1",
  title: "Implementacja algorytmów uczenia maszynowego w diagnostyce medycznej",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  degree: "inżynierska",
  faculty: "Wydział Informatyki i Informatyka | Studia inżynierskie",
  supervisor: mockSupervisor,
  studentsLimit: 4,
  students: mockStudents,
  status: "IN_PROGRESS",
  tags: ["Machine Learning", "Diagnostyka medyczna", "Algorytmy"],
};

const ThesisDetails = () => {
  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <ThesisSidebar thesis={exampleThesis} />
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-[var(--o-blue)]">
                  {exampleThesis.title}
                </h1>
                <StarButton initialState={true} />
              </div>

              <div className="mb-6">
                <p className="text-gray-600">{exampleThesis.faculty}</p>
              </div>

              <Separator.Root className="h-px bg-gray-200 my-4" />

              <AspectRatio.Root ratio={16 / 9} className="mb-8">
                <div className="h-full overflow-auto">
                  <p className="text-gray-800 whitespace-pre-line">
                    {exampleThesis.description}
                  </p>
                </div>
              </AspectRatio.Root>

              <Separator.Root className="h-px bg-gray-200 my-4" />

              <div className="flex space-x-4">
                <Button className="bg-[var(--o-yellow)] hover:bg-[var(--o-yellow-dark)] text-black">
                  Dołącz
                </Button>
                <Link to={"/chats"}>
                  <Button
                    variant="outline"
                    className="border-[var(--o-blue)] text-[var(--o-blue)]"
                  >
                    Wyślij wiadomość
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ThesisDetails;
