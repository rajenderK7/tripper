import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Expense } from "@/types/expense";
import MembersList from "../members-list";

interface ExpenseDetailModalProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (id: string) => void;
}

export function ExpenseDetailModal({
  expense,
  open,
  onOpenChange,
  onDelete,
}: ExpenseDetailModalProps) {
  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-lg max-w-2xl">
        <DialogHeader>
          <DialogTitle>Expense</DialogTitle>
          <DialogDescription>Created by {expense.created_by}</DialogDescription>
        </DialogHeader>
        <h1 className="text-lg font-medium">{expense.title}</h1>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="font-medium">{expense.amount}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{format(expense.date, "PPP")}</div>
            </div>
          </div>
          <Separator />
          {expense.description && (
            <>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="text-sm">{expense.description}</div>
              </div>
              <Separator />
            </>
          )}
          {/* {expense.receipt && (
            <>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Receipt</div>
                {expense.receiptType?.startsWith("image/") ? (
                  <img
                    src={expense.receipt}
                    alt="Receipt"
                    className="rounded-lg border"
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border p-2">
                    <File className="h-4 w-4" />
                    <span className="text-sm">Receipt.pdf</span>
                  </div>
                )}
              </div>
              <Separator />
            </>
          )} */}
          <div className="grid gap-2">
            <div className="text-sm text-muted-foreground">
              Members Involved
            </div>
            <MembersList members={expense.members} />
            {(!expense.members || expense.members.length === 0) && (
              <p className="text-center text-sm text-muted-foreground py-4">
                No members found
              </p>
            )}
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button
              disabled={onDelete === undefined}
              variant={onDelete !== undefined ? "destructive" : "ghost"}
              onClick={() => {
                if (onDelete) {
                  onDelete(expense.id!!);
                }
              }}
            >
              Delete Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
