import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function NewExpenseLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Skeleton className="h-8 w-24" />
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
      <main className="container py-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <Skeleton className="h-4 w-32" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Title field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-48" />
                </div>

                {/* Amount field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-48" />
                </div>

                {/* Date field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-48" />
                </div>

                {/* Members field */}
                <div className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-6 w-24 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <Skeleton className="h-4 w-64" />
                </div>

                {/* Description field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-4 w-48" />
                </div>

                {/* Receipt field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-64" />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
