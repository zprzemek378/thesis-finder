import React from "react";
import MainLayout from "@/common/layout/MainLayout";
import ThesisCard from "@/features/thesis/components/ThesisCard";
import { Thesis } from "@/types/thesis";
import { User } from "@/types/user";

// Przykładowe dane zgodne ze zrzutem ekranu
const mockSupervisor: User = {
  _id: "1",
  firstName: "Jan",
  lastName: "Kowalski",
  email: "jan.kowalski@university.edu",
  faculty: "Wydział Informatyki",
  role: "SUPERVISOR",
  academicTitle: "dr"
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
    studyMode: "STACJONARNE"
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
    studyMode: "STACJONARNE"
  }
];

const exampleTheses: Thesis[] = [
  {
    _id: "1",
    title: "Implementacja algorytmów uczenia maszynowego w diagnostyce medycznej",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    degree: "inżynierska",
    faculty: "Wydział Informatyki i Informatyka | Studia inżynierskie",
    supervisor: mockSupervisor,
    studentsLimit: 4,
    students: mockStudents,
    status: "IN_PROGRESS",
    tags: ["Machine Learning", "Diagnostyka medyczna", "Algorytmy"]
  },
  {
    _id: "2",
    title: "Analiza wydajności algorytmów grafowych w zastosowaniach sieciowych",
    description: "Badanie efektywności różnych algorytmów grafowych w kontekście optymalizacji sieci komputerowych i telekomunikacyjnych.",
    degree: "magisterska",
    faculty: "Wydział Informatyki i Informatyka | Studia magisterskie",
    supervisor: mockSupervisor,
    studentsLimit: 3,
    students: [mockStudents[0]],
    status: "IN_PROGRESS",
    tags: ["Algorytmy grafowe", "Sieci komputerowe", "Optymalizacja"]
  },
  {
    _id: "3",
    title: "Zastosowanie metod uczenia głębokiego w przetwarzaniu języka naturalnego",
    description: "Badanie i implementacja najnowszych technik uczenia głębokiego w zadaniach przetwarzania języka naturalnego, takich jak analiza sentymentu i generowanie tekstu.",
    degree: "inżynierska",
    faculty: "Wydział Informatyki i Informatyka | Studia inżynierskie",
    supervisor: mockSupervisor,
    studentsLimit: 2,
    students: [],
    status: "FREE",
    tags: ["Deep Learning", "NLP", "Sieci neuronowe"]
  }
];

const Home = () => {
  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-[var(--o-blue)] mb-6">Dostępne prace dyplomowe</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleTheses.map((thesis) => (
            <ThesisCard key={thesis._id} thesis={thesis} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;