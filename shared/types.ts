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