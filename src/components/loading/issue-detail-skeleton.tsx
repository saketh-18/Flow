import { Skeleton } from "@/components/ui/skeleton";

export function IssueDetailSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-8 w-2/3 mb-3" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-3 gap-6 p-6">
        {/* Main content area */}
        <div className="col-span-2 space-y-6">
          {/* Description section */}
          <div>
            <Skeleton className="h-6 w-32 mb-3" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>

          {/* Activity section */}
          <div>
            <Skeleton className="h-6 w-24 mb-3" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Status, Priority, Assignee, etc. */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
