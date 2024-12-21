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

export function InvitationsList() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const fetchInvitations = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trip/invitation`
      );
      if (!res.ok) {
        throw new Error("Error fetching Invitations. Please try again later.");
      }
      const data = (await res.json()) as InvitationDB[];
      const invitations = data.map((i) => {
        const date = i.trip.start_date.toDate();
        return {
          ...i,
          trip: {
            ...i.trip,
            start_date: date,
          },
        };
      });
      setInvitations(invitations);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const handleInvitationAction = async (action: InvitationAction) => {
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
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className="grid gap-4">
      {invitations.length === 0 && (
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
                  {"invitation.trip.start_date.toDateString()"}
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
