import { Timestamp } from "firebase-admin/firestore";

export interface Trip {
  id?: string;
  title: string;
  location: string;
  created_by?: string;
  start_date: Date;
  planned_dates: string; // Eg: July 15-20, 2025
  members?: string[];
  invitees?: string[];
}

export interface TripDB extends Omit<Trip, "start_date"> {
  start_date: Timestamp;
}

export interface TripInvitation {
  id?: string;
  title: string;
  location: string;
  start_date: Date;
}

export interface TripInvitationDB extends Omit<TripInvitation, "start_date"> {
  start_date: Timestamp;
}
