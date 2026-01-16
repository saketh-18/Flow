import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function InboxSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Inbox Items */}
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-5 w-16 flex-shrink-0" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
