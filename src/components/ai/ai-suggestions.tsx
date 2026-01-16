"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Loader2,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  AlertCircle,
  Minus,
  Check,
  X,
} from "lucide-react";
import { useAISuggestions } from "@/hooks/use-ai";
import { motion, AnimatePresence } from "framer-motion";

interface AISuggestionsProps {
  title: string;
  description?: string;
  onApplySuggestion: (suggestion: {
    priority?: string;
    labels?: string[];
  }) => void;
  className?: string;
}

const priorityIcons: Record<string, React.ElementType> = {
  urgent: AlertCircle,
  high: ArrowUp,
  medium: ArrowRight,
  low: ArrowDown,
  none: Minus,
};

const priorityColors: Record<string, string> = {
  urgent: "text-red-500",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
  none: "text-gray-500",
};

export function AISuggestions({
  title,
  description,
  onApplySuggestion,
  className,
}: AISuggestionsProps) {
  const { suggestions, isLoading, getSuggestions } = useAISuggestions();
  const [dismissed, setDismissed] = React.useState(false);
  const [applied, setApplied] = React.useState(false);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  // Auto-fetch suggestions when title changes (with debounce)
  React.useEffect(() => {
    setDismissed(false);
    setApplied(false);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (title.length >= 10) {
      debounceRef.current = setTimeout(() => {
        getSuggestions(title, description);
      }, 1000);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [title, description, getSuggestions]);

  const handleApply = () => {
    if (!suggestions) return;

    onApplySuggestion({
      priority: suggestions.suggestedPriority,
      labels: suggestions.suggestedLabels,
    });
    setApplied(true);
  };

  if (dismissed || applied || (!isLoading && !suggestions)) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "rounded-lg border bg-gradient-to-r from-violet-500/5 to-indigo-500/5 p-4",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-500">
              {isLoading ? (
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">AI Suggestions</p>
              {isLoading ? (
                <p className="text-xs text-muted-foreground">
                  Analyzing your issue...
                </p>
              ) : suggestions ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.suggestedPriority && (
                      <Badge variant="outline" className="gap-1">
                        {React.createElement(
                          priorityIcons[suggestions.suggestedPriority] || Minus,
                          {
                            className: cn(
                              "h-3 w-3",
                              priorityColors[suggestions.suggestedPriority]
                            ),
                          }
                        )}
                        {suggestions.suggestedPriority} priority
                      </Badge>
                    )}
                    {suggestions.issueType && (
                      <Badge variant="outline">{suggestions.issueType}</Badge>
                    )}
                    {suggestions.suggestedLabels?.map((label: string) => (
                      <Badge
                        key={label}
                        variant="secondary"
                        className="text-xs"
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                  {suggestions.reasoning && (
                    <p className="text-xs text-muted-foreground">
                      {suggestions.reasoning}
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <Button size="sm" variant="default" onClick={handleApply}>
                      <Check className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDismissed(true)}
                    >
                      Dismiss
                    </Button>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {Math.round((suggestions.confidence || 0) * 100)}%
                      confident
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
