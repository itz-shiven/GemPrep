import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, Star, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Ensure user exists in our DB (upsert based on Clerk ID)
  const dbUser = await db.user.upsert({
    where: { clerkId: user.id },
    update: {
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      avatarUrl: user.imageUrl,
    },
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      avatarUrl: user.imageUrl,
    },
    include: {
      resume: true,
      participantIn: {
        include: {
          room: true,
        },
      },
      feedbackReceived: true,
    },
  });

  // Calculate stats
  const hasResume = !!dbUser.resume;
  const totalInterviews = dbUser.participantIn.length;
  const completedInterviews = dbUser.participantIn.filter((p: any) => p.room.status === "COMPLETED").length;
  
  // Calculate average rating from feedback
  const avgRating = dbUser.feedbackReceived.length > 0
    ? (dbUser.feedbackReceived.reduce((acc: number, curr: any) => {
        // Assume ratings is a JSON object with numeric scores
        const scores = curr.ratings as Record<string, number>;
        const avg = Object.values(scores).reduce((a, b) => a + b, 0) / (Object.values(scores).length || 1);
        return acc + avg;
      }, 0) / dbUser.feedbackReceived.length).toFixed(1)
    : "N/A";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.firstName || "Engineer"}!</h2>
        <Link href="/dashboard/interviews/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Interview
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resume Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hasResume ? "Uploaded" : "Not Uploaded"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasResume ? "Your resume is ready for interviews" : "Upload your resume to get matched"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInterviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mock interviews participated in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedInterviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully finished interviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on peer feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity or Next Steps can go here */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Interviews</CardTitle>
            <CardDescription>
              Your most recent mock interview sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dbUser.participantIn.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
                <p>No interviews yet.</p>
                <Link href="/dashboard/interviews/new" className="mt-2 text-primary hover:underline">
                  Start your first interview
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {/* We can map recent interviews here */}
                <p className="text-sm text-muted-foreground">Interview history will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Resume Action</CardTitle>
            <CardDescription>
              Keep your resume updated for better matches.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[200px]">
            {!hasResume ? (
              <div className="text-center">
                <p className="mb-4 text-sm text-muted-foreground">You haven't uploaded a resume yet.</p>
                <Link href="/dashboard/resume">
                  <Button variant="outline">Upload Resume</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-primary opacity-20 mb-4" />
                <p className="mb-4 text-sm text-muted-foreground">Your resume is active.</p>
                <Link href="/dashboard/resume">
                  <Button variant="outline">Update Resume</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}