import { Timestamp } from "firebase-admin/firestore";

export interface Expense {
  id?: string;
  trip_id?: string;
  title: string;
  description?: string;
  amount: number;
  created_by: string;
  date: Date;
  members: string[];
}

export interface ExpenseDB extends Omit<Expense, "date"> {
  date: Timestamp;
}
