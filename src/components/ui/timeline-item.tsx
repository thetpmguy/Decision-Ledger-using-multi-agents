import { cn } from "@/lib/utils";
import { Check, Clock, AlertTriangle, X, ChevronRight } from "lucide-react";

interface TimelineItemProps {
  title: string;
  description?: string;
  timestamp: string;
  status: "completed" | "active" | "pending" | "failed" | "warning";
  actor?: string;
  details?: string[];
  isLast?: boolean;
}

export function TimelineItem({
  title,
  description,
  timestamp,
  status,
  actor,
  details,
  isLast = false,
}: TimelineItemProps) {
  const statusIcons = {
    completed: <Check className="h-4 w-4" />,
    active: <Clock className="h-4 w-4" />,
    pending: <Clock className="h-4 w-4" />,
    failed: <X className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
  };

  const statusColors = {
    completed: "bg-success text-success-foreground border-success",
    active: "bg-primary text-primary-foreground border-primary animate-pulse",
    pending: "bg-muted text-muted-foreground border-border",
    failed: "bg-destructive text-destructive-foreground border-destructive",
    warning: "bg-warning text-warning-foreground border-warning",
  };

  const lineColors = {
    completed: "bg-success/50",
    active: "bg-primary/50",
    pending: "bg-border",
    failed: "bg-destructive/50",
    warning: "bg-warning/50",
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2",
            statusColors[status]
          )}
        >
          {statusIcons[status]}
        </div>
        {!isLast && (
          <div className={cn("h-full w-0.5 flex-1", lineColors[status])} />
        )}
      </div>
      <div className={cn("flex-1 pb-8", isLast && "pb-0")}>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{title}</p>
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        {actor && (
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="text-foreground/80">{actor}</span>
          </p>
        )}
        {details && details.length > 0 && (
          <div className="mt-3 space-y-1">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <ChevronRight className="h-3 w-3" />
                {detail}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
