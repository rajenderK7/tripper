import { ArrowLeft, Calendar, MapPin, Plus, Users } from "lucide-react";
import Link from "next/link";

import { ExpenseList } from "@/components/trip/expense-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Expense, ExpenseDB } from "@/types/expense";
import { Trip, TripDB } from "@/types/trip";
import { currentUser } from "@clerk/nextjs/server";
import MembersList from "@/components/members-list";
import { getDB } from "@/db/firebase";
import { notFound } from "next/navigation";
import { ExpensesSection } from "@/components/trip/expenses-section";

const fetchTrip = async (
  trip_id: string,
  username: string
): Promise<Trip | null> => {
  try {
    const res = await getDB()
      .collection("trip")
      .where("id", "==", trip_id)
      .where("members", "array-contains", username)
      .get();

    if (res.docs.length > 0) {
      const data = res.docs[0].data() as TripDB;
      return {
        ...data,
        start_date: data.start_date.toDate(),
      };
    }
    return null;
  } catch (error) {
    throw new Error("Please try after sometime.");
  }
};

const fetchExpenses = async (trip_id: string): Promise<Expense[]> => {
  try {
    const res = await getDB()
      .collection("expense")
      .where("trip_id", "==", trip_id)
      .orderBy("date", "desc")
      .get();
    const expenses = res.docs.map((e) => {
      const data = e.data() as ExpenseDB;
      return {
        ...data,
        date: data.date.toDate(),
      };
    });

    return expenses;
  } catch (error) {
    throw new Error("Please try after sometime.");
  }
};

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const user = await currentUser();

  const trip_id = (await params).tripId;
  const trip = await fetchTrip(trip_id, user?.username!!);
  if (!trip) {
    notFound();
  }

  const expenses = await fetchExpenses(trip_id);

  const myExpenses = expenses.filter((e) => e.created_by === user?.username);

  const totalExpense = expenses.reduce((ac, exp) => ac + exp.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-2">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to my trips
            </Link>
          </div>

          <div className="grid gap-4">
            {/* Trip Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{trip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 -mt-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {trip.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {trip.planned_dates}
                    </div>
                    <div className="flex text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      <div className="flex-1">
                        <MembersList members={trip.members ?? []} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expenses Section */}
            <ExpensesSection
              tripId={trip_id}
              allExpenses={expenses}
              myExpenses={myExpenses}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
