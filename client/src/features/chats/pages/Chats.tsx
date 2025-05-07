import React from "react";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import * as Separator from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import MainLayout from "@/common/layout/MainLayout";
import ThesisSidebar from "@/features/thesis/components/ThesisSidebar";
import StarButton from "@/components/ui/star-button";
import { Thesis } from "@/types/thesis";
import { User } from "@/types/user";
import ChatsSidebar from "../components/ChatsSidebar";
import SingleChat from "../components/SingleChat";
import FixedHeightLayout from "@/common/layout/FixedHeightLayout";

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

const Chats = () => {
  return (
    <FixedHeightLayout>
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 flex-1 min-h-0">
          {/* Sidebar */}
          <div className="md:col-span-1 h-full">
            <ChatsSidebar />
          </div>
          {/* Main Content */}
          <SingleChat />
        </div>
      </div>
    </FixedHeightLayout>
  );
};

export default Chats;
