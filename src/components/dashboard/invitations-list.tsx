"use client";

import { Calendar, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Invitation, InvitationAction, InvitationDB } from "@/types/invitation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns/format";
import Spinner from "../spinner";

export function InvitationsList() {
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trip/invitation`
      );
      if (!res.ok) {
        throw new Error("Error fetching Invitations. Please try again later.");
      }
      const data = (await res.json()) as InvitationDB[];
      const invitations = data.map((i) => {
        // TODO: Using the "_seconds" field because the Timestamp is no more
        // returned from the DB instead an object.
        // For now using the InvitationDB type but not necessarily the right approach.
        const startDate = new Date((i.trip.start_date as any)._seconds * 1000);
        return {
          ...i,
          trip: {
            ...i.trip,
            start_date: startDate,
          },
        };
      });
      setInvitations(invitations as Invitation[]);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationAction = async (action: InvitationAction) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trip/invitation`,
        {
          method: "POST",
          body: JSON.stringify(action),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast("Unable to act on the invitation", {
          description: data.message,
          icon: "❌",
        });
      }
      // Reload invitations
      fetchInvitations();
    } catch (error) {
      toast("Unable to act on the invitation", {
        description: "Please try again later",
        icon: "❌",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className="grid gap-4">
      {loading && (
        <div className="mt-12 flex justify-center">
          <Spinner />
        </div>
      )}
      {!loading && invitations.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          <p>No pending invitations</p>
          <p> Create or join a trip</p>
        </div>
      )}
      {invitations.length > 0 &&
        invitations.map((invitation) => (
          <Card key={invitation.id}>
            <CardHeader>
              <CardTitle>{invitation.trip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {invitation.trip.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <time dateTime={invitation.trip.start_date.toISOString()}>
                    {format(invitation.trip.start_date, "MMM d, yyyy")}
                  </time>
                </div>
                <div className="text-sm text-muted-foreground">
                  Invited by {invitation.invited_by}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={() =>
                  handleInvitationAction({
                    id: invitation.id!!,
                    trip_id: invitation.trip.id!!,
                    accept: true,
                  })
                }
                className="flex-1"
              >
                Accept
              </Button>
              <Button
                onClick={() =>
                  handleInvitationAction({
                    id: invitation.id!!,
                    trip_id: invitation.trip.id!!,
                    accept: false,
                  })
                }
                variant="outline"
                className="flex-1"
                value="false"
              >
                Decline
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}
