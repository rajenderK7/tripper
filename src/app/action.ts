"use server";

import { getDB } from "@/db/firebase";

export async function deleteExpense(id: string) {
  const db = getDB();
  const ref = db.doc(`expense/${id}`);
  await ref.delete();

  return { success: true };
}
