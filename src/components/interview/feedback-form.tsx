"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star } from "lucide-react";

export function FeedbackForm({ room, currentParticipant }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  const opponent = room.participants.find((p: any) => p.id !== currentParticipant.id);
  const isInterviewer = currentParticipant.role === "INTERVIEWER";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setLoading(true);
    try {
      await fetch("/api/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: room.interview.id,
          reviewerId: currentParticipant.userId,
          revieweeId: opponent?.userId,
          role: currentParticipant.role,
          ratings: { overall: rating },
          comments
        })
      });
      router.push("/dashboard/interviews");
    } catch (e) {
      console.error("Failed to submit feedback", e);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Interview Completed</CardTitle>
          <CardDescription>
            Please provide feedback for {opponent ? opponent.user?.name || "your partner" : "your partner"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Overall Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Additional Comments</Label>
              <Textarea
                id="comments"
                placeholder={isInterviewer ? "How did the candidate perform?" : "How was the interviewer?"}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
              />
            </div>

            <Button type="submit" disabled={rating === 0 || loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
