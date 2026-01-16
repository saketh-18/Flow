import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Settings Layout */}
      <div className="flex-1 grid grid-cols-4 gap-6 p-6">
        {/* Sidebar Navigation */}
        <div className="col-span-1 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>

        {/* Main Content */}
        <div className="col-span-3 space-y-6">
          {/* Section Title */}
          <Skeleton className="h-6 w-32" />

          {/* Form Fields */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          {/* Divider */}
          <Skeleton className="h-px w-full" />

          {/* Additional Section */}
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
