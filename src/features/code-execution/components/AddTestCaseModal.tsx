"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { NewCodeExecutionTestCase } from "@/features/code-execution/types/execution";

type AddTestCaseModalProps = {
  onAddTestCase: (testCase: NewCodeExecutionTestCase) => void;
  trigger?: ReactNode;
};

export function AddTestCaseModal({
  onAddTestCase,
  trigger,
}: AddTestCaseModalProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");

  function handleSave() {
    onAddTestCase({
      input: input.trim(),
      expectedOutput: expectedOutput.trim(),
    });
    setInput("");
    setExpectedOutput("");
    setOpen(false);
  }

  const canSave = input.trim().length > 0 && expectedOutput.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12]"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add Test Case
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add test case</DialogTitle>
          <DialogDescription>
            Save a local interview test case for this room session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Input</span>
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="mt-2 font-mono"
              placeholder={"3\n4 8 6\n10"}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Expected output</span>
            <Textarea
              value={expectedOutput}
              onChange={(event) => setExpectedOutput(event.target.value)}
              className="mt-2 min-h-20 font-mono"
              placeholder="10"
            />
          </label>
        </div>

        <DialogFooter>
          <Button type="button" variant="quiet" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!canSave}>
            Save test case
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
