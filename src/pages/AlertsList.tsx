import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAlerts } from "@/hooks/useAlerts";
import { AlertCircle, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const getSeverityVariant = (severity: string) => {
  switch (severity) {
    case "Critical":
      return "destructive" as const;
    case "High":
      return "warning" as const;
    case "Medium":
      return "default" as const;
    default:
      return "muted" as const;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Resolved":
      return "success" as const;
    case "Acknowledged":
      return "active" as const;
    default:
      return "warning" as const;
  }
};

export default function AlertsList() {
  const { data: alerts, isLoading } = useAlerts();

  if (isLoading) {
    return <div className="text-muted-foreground">Loading alerts...</div>;
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">All Alerts</h1>
        <p className="mt-1 text-muted-foreground">
          Product health issues detected by observability
        </p>
      </div>

      <div className="space-y-3">
        {alerts?.map((alert) => (
          <Link
            key={alert.id}
            to={`/alerts/${alert.id}`}
            className="card-gradient flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-primary/30"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              alert.status === "Open" ? "bg-warning/10" : "bg-secondary"
            }`}>
              <AlertCircle className={`h-5 w-5 ${
                alert.status === "Open" ? "text-warning" : "text-muted-foreground"
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  {alert.metric_name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                <StatusBadge variant={getSeverityVariant(alert.severity)}>
                  {alert.severity}
                </StatusBadge>
                <StatusBadge variant={getStatusVariant(alert.status)}>
                  {alert.status}
                </StatusBadge>
              </div>
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                <span className={alert.delta < 0 ? "text-destructive" : "text-warning"}>
                  {alert.delta > 0 ? "+" : ""}{alert.delta.toFixed(1)}% change
                </span>
                <span>•</span>
                <span>{alert.type}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(alert.detected_at), { addSuffix: true })}</span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
