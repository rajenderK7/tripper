import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function NewTripLoading() {
  return (
    <main className="container py-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Title field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Location field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-64" />
              </div>

              {/* Start date field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Planned dates field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-56" />
              </div>

              {/* Invitees field */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
                <div className="rounded-md border p-2">
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-6 w-20 rounded-full" />
                    ))}
                  </div>
                </div>
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
  );
}
