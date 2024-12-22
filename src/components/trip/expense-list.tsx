import { format } from "date-fns";
import { Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { ScrollArea } from "../ui/scroll-area";

interface ExpenseListProps {
  expenses: Expense[];
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  return (
    <div className="grid gap-4">
      {expenses.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          <p>No expenses made yet</p>
        </div>
      )}

      {expenses.length > 0 && (
        <ScrollArea className="h-72 rounded-md border">
          {expenses.map((expense) => (
            <Card className="m-4 -p-2" key={expense.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  {expense.title}
                </CardTitle>
                <div className="flex items-center font-bold text-lg">
                  <Wallet className="mr-1 h-4 w-4" />
                  {expense.amount}
                </div>
              </CardHeader>
              <CardContent>
                <p>{expense.description}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    by
                    <span>{expense.created_by}</span>
                  </div>
                  <time dateTime={expense.date.toISOString()}>
                    {format(expense.date, "MMM d, yyyy")}
                  </time>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      )}
    </div>
  );
}
