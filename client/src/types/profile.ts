export interface ProfileUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  role: "STUDENT" | "SUPERVISOR" | "ADMIN";
  student?: ProfileStudent;
  supervisor?: ProfileSupervisor;
}

export interface ProfileStudent {
  _id: string;
  studiesType: "BACHELOR" | "ENGINEERING" | "MASTER" | "DOCTORATE" | "POST-GRADUATE" | "OTHER";
  studiesStartDate: string;
  degree: string;
  thesisList: string[];
}

export interface ProfileSupervisor {
  _id: string;
  thesisLimit: number;
  academicTitle: string;
  selfInterests: string;
  thesisList: string[];
}