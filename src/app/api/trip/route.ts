import { getDB } from "@/db/firebase";
import { tripValidationSchema } from "@/lib/validations/trip";
import { Trip, TripDB, TripInvitationDB } from "@/types/trip";
import { InvitationDB } from "@/types/invitation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { firestore } from "firebase-admin";

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
  const res = await getDB().collection("trip").where("id", "==", tripId).get();

  if (res.docs.length > 0) {
    const data = res.docs[0].data();
    return Response.json(data, {
      status: 200,
    });
  }

  return Response.json(null, {
    status: 404,
  });
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return Response.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  try {
    const tripData = (await tripValidationSchema.validateAsync(
      await request.json()
    )) as Trip;
    const tripRef = getDB().collection("trip").doc();

    const tripDB: TripDB = {
      id: tripRef.id,
      title: tripData.title,
      location: tripData.location,
      created_by: user.username!!,
      start_date: firestore.Timestamp.fromDate(tripData.start_date),
      planned_dates: tripData.planned_dates,
      members: [user.username!!],
      invitees: tripData.invitees,
    };

    const db = getDB();
    const batch = db.batch();

    // Create trip
    batch.create(tripRef, tripDB);

    // Create an invitation for the invitees.
    tripData.invitees?.forEach((invitee) => {
      const inviteRef = db.collection("invitation").doc();
      const tripInvitation: TripInvitationDB = {
        id: tripRef.id,
        title: tripData.title,
        location: tripData.location,
        start_date: firestore.Timestamp.fromDate(tripData.start_date),
      };
      const invitation: InvitationDB = {
        id: inviteRef.id,
        trip: tripInvitation,
        invitee: invitee,
        invited_by: tripData.created_by!!,
      };
      batch.create(inviteRef, invitation);
    });

    await batch.commit();

    return Response.json(null, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: (error as Error).message },
      { status: 400 }
    );
  }
}
