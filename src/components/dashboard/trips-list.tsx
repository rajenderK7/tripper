import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trip, TripDB } from "@/types/trip";
import Link from "next/link";
import MembersList from "../members-list";
import { getDB } from "@/db/firebase";
import { format } from "date-fns/format";

const fetchTrips = async (username: string): Promise<Trip[]> => {
  try {
    const res = await getDB()
      .collection("trip")
      .where("members", "array-contains", username)
      // .orderBy("start_date", "desc")
      .get();
    const trips = res.docs.map((t) => {
      const data = t.data() as TripDB;
      return {
        ...data,
        start_date: data.start_date.toDate(),
      };
    });
    return trips;
  } catch (error) {
    throw new Error("Please try after sometime.");
  }
};

export async function TripsList({ username }: { username: string }) {
  const trips = await fetchTrips(username);

  return (
    <div className="grid gap-4">
      {trips.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          <p>You are not part of any trips yet 🥲</p>
          <p> Create or join a trip</p>
        </div>
      )}
      {trips.length > 0 &&
        trips.map((trip) => (
          <Card key={trip.id}>
            <CardHeader>
              <Link href={`/trip/${trip.id}`} key={trip.id}>
                <CardTitle>{trip.title}</CardTitle>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {trip.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <time dateTime={trip.start_date.toISOString()}>
                    {format(trip.start_date, "MMM d, yyyy")}
                  </time>
                </div>
                <div className="flex text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <MembersList members={trip.members ?? []} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
