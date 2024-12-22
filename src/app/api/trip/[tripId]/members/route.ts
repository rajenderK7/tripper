import { getDB } from "@/db/firebase";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  _: Request,
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

  const res = await getDB()
    .collection("trip")
    .select("members")
    .where("trip_id", "==", tripId)
    .get();

  let data = null;
  if (res.docs.length > 0) {
    data = res.docs[0].data().members;
  }
  return Response.json(data, {
    status: 200,
  });
}
