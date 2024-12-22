import { getDB } from "@/db/firebase";
import { invitationActionValidationSchema } from "@/lib/validations/invitation";
import { InvitationAction } from "@/types/invitation";
import { currentUser } from "@clerk/nextjs/server";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return Response.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const res = await getDB()
    .collection("invitation")
    .where("invitee", "==", user.username)
    .get();

  const invitations = res.docs.map((e) => {
    return e.data();
  });

  return Response.json(invitations, {
    status: 200,
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
    const data = (await invitationActionValidationSchema.validateAsync(
      await request.json()
    )) as InvitationAction;
    const db = getDB();
    const batch = db.batch();

    const tripRef = db.doc(`trip/${data.trip_id}`);

    // TODO: Check if the trip has already started or completed.
    // In those cases simple send the appropriate message and delete the inviation entry.

    // Add the user to members only if invitation is accepted otherwise
    // just remove the user from invitees and delete the invitation.
    if (data.accept) {
      batch.update(tripRef, {
        members: FieldValue.arrayUnion(user.username),
      });
    }
    batch.update(tripRef, {
      invitees: FieldValue.arrayRemove(user.username),
    });

    // Delete the invitation document.
    const invitationRef = db.doc(`invitation/${data.id}`);
    batch.delete(invitationRef);

    await batch.commit();
    return Response.json(null, {
      status: 200,
    });
  } catch (error) {
    return Response.json(
      { message: (error as Error).message },
      { status: 400 }
    );
  }
}
