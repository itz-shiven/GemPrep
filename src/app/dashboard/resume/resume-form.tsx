"use client";

import { useState } from "react";
import { uploadResume } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { Resume } from "@prisma/client";

export function ResumeForm({ existingResume }: { existingResume: Resume | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const result = await uploadResume(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      (event.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Resume (PDF)</Label>
        <Input 
          id="file" 
          name="file" 
          type="file" 
          accept="application/pdf" 
          required 
          disabled={loading}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-500">Resume uploaded successfully!</p>}

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {existingResume ? "Update Resume" : "Upload Resume"}
      </Button>
    </form>
  );
}
