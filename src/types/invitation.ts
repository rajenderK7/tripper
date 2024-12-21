import { TripInvitation, TripInvitationDB } from "./trip";

export interface Invitation {
  id?: string;
  trip: TripInvitation;
  invitee: string;
  invited_by: string;
}

export interface InvitationDB extends Omit<Invitation, "trip"> {
  trip: TripInvitationDB;
}

export interface InvitationAction {
  id: string;
  trip_id: string;
  accept: boolean;
}
