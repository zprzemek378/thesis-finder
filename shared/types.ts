import mongoose from "mongoose";

export type TestType = {
  test1: string;
  test2: number;
};

export interface IChat extends mongoose.Document {
  title: string;
  messages: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
}

export type Faculty =
  | "WEAIiIB"
  | "WGGiIŚ"
  | "WGiG"
  | "WIMiC"
  | "WIMiIP"
  | "WIMiR"
  | "WMS"
  | "WO"
  | "WFiIS"
  | "WWNiG"
  | "WZ"
  | "WEiP"
  | "WIEiT"
  | "WH";

export type StudiesType =
  | "BACHELOR"
  | "ENGINEERING"
  | "MASTER"
  | "DOCTORATE"
  | "POST-GRADUATE"
  | "OTHER";

export type Degree = "I" | "II" | "III" | "jednolite";

export type UserRole = "STUDENT" | "SUPERVISOR" | "ADMIN";
