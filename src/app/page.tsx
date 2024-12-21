import { InvitationsList } from "@/components/dashboard/invitations-list";
import { TripsList } from "@/components/dashboard/trips-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDB } from "@/db/firebase";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const fetchInvitationsCount = async (username: string) => {
  try {
    const res = await getDB()
      .collection("invitation")
      .where("invitee", "==", username)
      .count()
      .get();
    return res.data().count;
  } catch (error) {
    console.error("Unable to fetch invitations", error);
  }
};

export default async function Home() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const invitationsCount = (await fetchInvitationsCount(user.username!!)) ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto py-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl space-y-4">
            <div className="flex justify-end">
              <Link href="/trip/create">
                <Button className=" tracking-tight">Create Trip</Button>
              </Link>
            </div>
            <Tabs defaultValue="trips" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="trips" className="flex-1">
                  My Trips
                </TabsTrigger>
                <TabsTrigger value="invitations" className="flex-1 relative">
                  Invitations
                  <span className="">
                    {invitationsCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-4 h-5 w-5 rounded-full p-0 text-xs flex justify-center"
                      >
                        {invitationsCount}
                      </Badge>
                    )}
                  </span>
                </TabsTrigger>
              </TabsList>
              <div className="mt-4">
                <TabsContent value="trips">
                  <TripsList username={user?.username!!} />
                </TabsContent>
                <TabsContent value="invitations">
                  <InvitationsList />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
