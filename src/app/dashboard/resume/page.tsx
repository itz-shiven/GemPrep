import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { ResumeForm } from "./resume-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default async function ResumePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    include: { resume: true },
  });

  if (!dbUser) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Your Resume</h2>
        <p className="text-muted-foreground mt-2">
          Upload your resume to get AI-generated follow-up questions tailored to your experience during mock interviews.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resume Upload</CardTitle>
          <CardDescription>
            PDF files only. Max size 5MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeForm existingResume={dbUser.resume} />
        </CardContent>
      </Card>

      {dbUser.resume && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Current Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="font-medium truncate">{dbUser.resume.fileName}</div>
              <a 
                href={dbUser.resume.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm font-medium"
              >
                View
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
