import { User } from "./user";

export type ThesisStatus = "FREE" | "TAKEN" | "PENDING_APPROVAL" | "ARCHIVED";
export type StudyType = "BACHELOR" | "MASTER" | "DOCTORAL" | "POSTGRADUATE";

export interface ThesisFormData {
  title: string;
  description: string;
  degree: StudyType;
  field: string;
  faculty: string;
  tags: string[];
  studentsLimit: number;
}

export interface Thesis extends ThesisFormData {
  _id: string;
  supervisor: User;
  students: User[];
  status: ThesisStatus;
}
