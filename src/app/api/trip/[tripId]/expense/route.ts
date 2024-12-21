import { getDB } from "@/db/firebase";
import { expenseValidationSchema } from "@/lib/validations/expense";
import { Expense } from "@/types/expense";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const tripId = (await params).tripId;
  const searchParams = request.nextUrl.searchParams;

  let q = getDB().collection("expense").where("trip_id", "==", tripId);
  if (searchParams.has("created_by")) {
    q = q.where("created_by", "==", searchParams.get("created_by"));
  }

  // TODO: ADD ORDER BY CLAUSE
  const res = await q.get();
  const expenses = res.docs.map((e) => {
    return e.data();
  });
  return Response.json(expenses, {
    status: 200,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = (await expenseValidationSchema.validateAsync(
      await request.json()
    )) as Expense;
    const ref = getDB().collection("expense").doc();
    data.id = ref.id;
    data.created_by = user.username!!;
    data.trip_id = (await params).tripId;

    await ref.set(data);
    return Response.json(null, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: (error as Error).message },
      { status: 400 }
    );
  }
}
