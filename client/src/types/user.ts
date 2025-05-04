export type UserRole = "STUDENT" | "SUPERVISOR" | "ADMIN";
export type StudyMode = "STACJONARNE" | "NIESTACJONARNE";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  role: UserRole;
  academicTitle?: string;
  degree?: string;
  studyYear?: number;
  studyMode?: StudyMode;
}