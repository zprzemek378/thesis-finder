import { User } from "./user";
import { Thesis } from "./thesis";

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type RequestType = "THESIS_ENROLLMENT" | "OWN_THESIS_PROPOSAL" | "OTHER";

export interface Request {
  _id: string;
  student: User;
  supervisor: User;
  thesis?: Thesis;
  content?: string;
  status: RequestStatus;
  type: RequestType;
  createdAt: Date;
  updatedAt: Date;
}
