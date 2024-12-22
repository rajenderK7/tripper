"use client";

import { format } from "date-fns";
import { Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { ScrollArea } from "../ui/scroll-area";
import { ConfirmDialog } from "../confirm-dialog";
import { ExpenseDetailModal } from "./expense-detail-modal";
import { useState } from "react";

interface ExpenseListProps {
  username: string;
  expenses: Expense[];
  onDeleteExpense?: (id: string) => void;
}

export function ExpenseList({
  username,
  expenses,
  onDeleteExpense,
}: ExpenseListProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    setIsDetailModalOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpense && onDeleteExpense) {
      onDeleteExpense(selectedExpense.id!!);
      setSelectedExpense(null);
    }
    setIsDeleteDialogOpen(false);
  };
  return (
    <>
      <div className="grid gap-4">
        {expenses.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            <p>No expenses made yet</p>
          </div>
        )}

        {expenses.length > 0 && (
          <ScrollArea className="h-72 border rounded-lg">
            {expenses.map((expense) => (
              // <Card
              //   className="m-2 rounded-sm cursor-pointer transition-colors hover:bg-muted/50"
              //   key={expense.id}
              //   onClick={() => {
              //     setSelectedExpense(expense);
              //     setIsDetailModalOpen(true);
              //   }}
              // >
              //   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              //     <CardTitle className="text-sm">
              //       {
              //         "DeprecationWarning: The `punycode` module is deprecated. Please use a userland"
              //       }
              //     </CardTitle>
              //     <div className="flex items-center font-semibold text-lg">
              //       <Wallet className="mr-1 h-4 w-4" />
              //       {expense.amount}
              //     </div>
              //   </CardHeader>
              //   <CardContent>
              //     <p>{expense.description}</p>
              //     <div className="flex items-center justify-between text-sm text-muted-foreground">
              //       <div className="flex items-center gap-1">
              //         by
              //         <span>{expense.created_by}</span>
              //       </div>
              //       <time dateTime={expense.date.toISOString()}>
              //         {format(expense.date, "MMM d, yyyy")}
              //       </time>
              //     </div>
              //   </CardContent>
              // </Card>
              <Card
                key={expense.id}
                className="m-2 cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => {
                  setSelectedExpense(expense);
                  setIsDetailModalOpen(true);
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                  <CardTitle className="text-base font-medium line-clamp-1 mr-4">
                    {expense.title}
                  </CardTitle>
                  <div className="flex items-center font-bold text-lg shrink-0">
                    {/* <DollarSign className="mr-1 h-4 w-4" /> */}
                    {expense.amount}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex flex-row justify-between gap-2 text-sm text-muted-foreground">
                    <span className="line-clamp-1">
                      By {expense.created_by}
                    </span>
                    <time
                      dateTime={expense.date.toISOString()}
                      className="shrink-0"
                    >
                      {format(expense.date, "MMM d, yyyy")}
                    </time>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        )}
      </div>
      <ExpenseDetailModal
        expense={selectedExpense}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onDelete={
          username === selectedExpense?.created_by ? handleDelete : undefined
        }
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
      />
    </>
  );
}
