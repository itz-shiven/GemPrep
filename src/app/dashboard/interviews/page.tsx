import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Video, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function InterviewsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    include: {
      participantIn: {
        include: {
          room: true,
        },
        orderBy: {
          joinedAt: 'desc',
        }
      },
    },
  });

  if (!dbUser) {
    redirect("/dashboard");
  }

  const interviews = dbUser.participantIn.map(p => ({
    id: p.room.id,
    code: p.room.code,
    type: p.room.type,
    status: p.room.status,
    role: p.role,
    date: p.room.createdAt,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Interviews</h2>
          <p className="text-muted-foreground mt-2">Manage your mock interviews.</p>
        </div>
        <Link href="/dashboard/interviews/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Interview
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {interviews.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/20">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No interviews yet</h3>
            <p className="text-muted-foreground mb-4 text-center max-w-sm">
              Create a new interview or join an existing one to get started practicing.
            </p>
            <Link href="/dashboard/interviews/new">
              <Button>Create Interview</Button>
            </Link>
          </div>
        ) : (
          interviews.map((interview) => (
            <Card key={interview.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant={interview.type === "PRIVATE" ? "outline" : "default"}>
                    {interview.type}
                  </Badge>
                  <Badge variant={interview.status === "COMPLETED" ? "secondary" : "default"}>
                    {interview.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-4">Mock Interview</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(interview.date), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4 flex gap-2">
                <Link href={`/interview/${interview.code}`} className="w-full">
                  <Button variant="secondary" className="w-full">
                    {interview.status === "COMPLETED" ? "View Details" : "Join Room"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
