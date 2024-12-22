"use client";

import { Expense } from "@/types/expense";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ExpenseList } from "./expense-list";
import { deleteExpense } from "@/app/action";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface ExpensesSectionProps {
  tripId: string;
  totalExpense?: number;
  allExpenses: Expense[];
  myExpenses: Expense[];
}

export function ExpensesSection({
  tripId,
  allExpenses: initialExpenses,
  myExpenses: initialMyExpenses,
}: ExpensesSectionProps) {
  const user = useUser();
  const router = useRouter();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [myExpenses, setMyExpenses] = useState(initialMyExpenses);

  // Calculate total expense from current expenses if not provided
  const currentTotalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      setMyExpenses((prev) => prev.filter((expense) => expense.id !== id));
      router.refresh();
    } catch (error) {
      console.error(error);
      toast("Error deleting expense", {
        icon: "❌",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Expenses</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total: {currentTotalExpense} (All expenses)
          </p>
        </div>
        <Link href={`/trip/${tripId}/expense/new`}>
          <Button>Add Expense</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="my-expenses" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="my-expenses" className="flex-1">
              My Expenses
            </TabsTrigger>
            <TabsTrigger value="all-expenses" className="flex-1">
              All Expenses
            </TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="my-expenses">
              <ExpenseList
                username={user.user?.username!!}
                expenses={myExpenses}
                onDeleteExpense={handleDeleteExpense}
              />
            </TabsContent>
            <TabsContent value="all-expenses">
              <ExpenseList
                username={user.user?.username!!}
                expenses={expenses}
                onDeleteExpense={handleDeleteExpense}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
