import { User } from "./user";

export type ThesisStatus = "FREE" | "IN_PROGRESS" | "TAKEN" | "FINISHED";
export type StudyType = "BACHELOR" | "ENGINEERING" | "MASTER" | "DOCTORAL" | "POST-GRADUATE";

export interface Thesis {
  _id: string;
  title: string;
  description: string;
  degree: string;
  faculty: string;
  supervisor: User;
  studentsLimit: number;
  students: User[];
  status: ThesisStatus;
  tags: string[];
}