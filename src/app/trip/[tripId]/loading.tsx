import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TripDetailsLoading() {
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
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="grid gap-6">
            {/* Trip Details Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="h-px bg-border" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Expenses Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-32" />
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
                  <div className="mt-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-5 w-20" />
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-6 rounded-full" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
