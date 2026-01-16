"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  Plus,
  Search,
  Edit,
  Tag,
  User,
  FolderKanban,
  Navigation,
} from "lucide-react";
import { useAICommand } from "@/hooks/use-ai";
import { motion, AnimatePresence } from "framer-motion";

interface AICommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExecuteAction: (action: string, params: Record<string, unknown>) => void;
}

const actionIcons: Record<string, React.ElementType> = {
  create_issue: Plus,
  update_issue: Edit,
  search_issues: Search,
  add_label: Tag,
  assign_issue: User,
  create_project: FolderKanban,
  navigate: Navigation,
};

const actionLabels: Record<string, string> = {
  create_issue: "Create Issue",
  update_issue: "Update Issue",
  search_issues: "Search Issues",
  add_label: "Add Label",
  assign_issue: "Assign Issue",
  create_project: "Create Project",
  navigate: "Navigate",
  change_status: "Change Status",
  list_issues: "List Issues",
};

export function AICommandBar({
  open,
  onOpenChange,
  onExecuteAction,
}: AICommandBarProps) {
  const { parseCommand, isLoading } = useAICommand();
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState<{
    action: string;
    parameters: Record<string, unknown>;
    confidence: number;
    interpretation: string;
  } | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setInput("");
      setResult(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const parsed = await parseCommand(input);
    if (parsed) {
      setResult(parsed);
    }
  };

  const handleExecute = () => {
    if (result && result.action !== "unknown") {
      onExecuteAction(result.action, result.parameters);
      onOpenChange(false);
    }
  };

  const ActionIcon = result ? actionIcons[result.action] || Sparkles : Sparkles;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            AI Command
          </DialogTitle>
          <DialogDescription>
            Tell Flow what you want to do in natural language
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Try "Create a bug for the login page" or "Assign issue 123 to John"'
              className="pr-10"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-lg border bg-muted/50 p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      result.action === "unknown"
                        ? "bg-yellow-500/10"
                        : "bg-green-500/10"
                    )}
                  >
                    <ActionIcon
                      className={cn(
                        "h-4 w-4",
                        result.action === "unknown"
                          ? "text-yellow-500"
                          : "text-green-500"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {result.action === "unknown"
                        ? "Couldn't understand command"
                        : actionLabels[result.action] || result.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.interpretation}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      result.confidence > 0.7
                        ? "bg-green-500/10 text-green-600"
                        : result.confidence > 0.4
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-red-500/10 text-red-600"
                    )}
                  >
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>

                {result.action !== "unknown" &&
                  Object.keys(result.parameters).length > 0 && (
                    <div className="pl-11">
                      <p className="text-xs text-muted-foreground mb-2">
                        Parameters:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(result.parameters).map(
                          ([key, value]) => (
                            <span
                              key={key}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-background rounded text-xs"
                            >
                              <span className="text-muted-foreground">
                                {key}:
                              </span>
                              <span className="font-medium">
                                {String(value)}
                              </span>
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {result && result.action !== "unknown" ? (
              <Button type="button" onClick={handleExecute}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Execute
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Parse Command
              </Button>
            )}
          </div>
        </form>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            Example commands:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Create a high priority bug",
              "Show my assigned issues",
              "Go to the board view",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setInput(example)}
                className="text-xs px-2 py-1 rounded bg-muted hover:bg-accent transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
