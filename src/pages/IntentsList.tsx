import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useIntents } from "@/hooks/useIntents";
import { Activity, ArrowRight, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Completed":
      return "success" as const;
    case "Executing":
    case "Simulating":
      return "active" as const;
    case "RolledBack":
    case "Paused":
      return "warning" as const;
    default:
      return "default" as const;
  }
};

export default function IntentsList() {
  const { data: intents, isLoading } = useIntents();

  if (isLoading) {
    return <div className="text-muted-foreground">Loading intents...</div>;
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">All Intents</h1>
          <p className="mt-1 text-muted-foreground">
            Your remediation goals and their status
          </p>
        </div>
        <Link to="/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Intent
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {intents?.map((intent) => (
          <Link
            key={intent.id}
            to={`/intents/${intent.id}`}
            className="card-gradient flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-primary/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{intent.title}</p>
                <StatusBadge
                  variant={getStatusVariant(intent.status)}
                  pulse={intent.status === "Executing" || intent.status === "Simulating"}
                >
                  {intent.status}
                </StatusBadge>
              </div>
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="text-primary font-medium">
                  {intent.goal_target_delta > 0 ? "+" : ""}{intent.goal_target_delta}%{" "}
                  {intent.goal_metric.replace(/_/g, " ")}
                </span>
                <span>•</span>
                <span>{intent.authority_mode}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(intent.created_at), { addSuffix: true })}</span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
