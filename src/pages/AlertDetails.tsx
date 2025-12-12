import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAlert } from "@/hooks/useAlerts";
import { useCreateIntent } from "@/hooks/useIntents";
import { ArrowLeft, AlertCircle, Wrench, TrendingDown, TrendingUp, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

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

export default function AlertDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: alert, isLoading } = useAlert(id || "");
  const createIntent = useCreateIntent();

  const handleFixThis = async () => {
    if (!alert) return;

    try {
      const intent = await createIntent.mutateAsync({
        title: `Fix: ${alert.metric_name.replace(/_/g, " ")}`,
        goal_metric: alert.metric_name,
        goal_target_delta: Math.abs(alert.delta),
        time_horizon_days: 14,
        authority_mode: "RecommendOnly",
        source_alert_id: alert.id,
        constraints: {
          latency_p95_delta_max: 50,
          error_rate_max: 0.1,
        },
      });
      toast.success("Intent created successfully");
      navigate(`/intents/${intent.id}`);
    } catch (error) {
      toast.error("Failed to create intent");
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading alert...</div>;
  }

  if (!alert) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Alert not found</p>
        <Link to="/" className="text-primary hover:underline mt-2 inline-block">
          Go back home
        </Link>
      </div>
    );
  }

  const isNegative = alert.delta < 0;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {alert.metric_name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </h1>
            <StatusBadge variant={getSeverityVariant(alert.severity)}>
              {alert.severity}
            </StatusBadge>
            <StatusBadge variant={alert.status === "Resolved" ? "success" : "warning"}>
              {alert.status}
            </StatusBadge>
          </div>
          <p className="mt-1 text-muted-foreground">
            Detected {formatDistanceToNow(new Date(alert.detected_at), { addSuffix: true })}
          </p>
        </div>
        <Button onClick={handleFixThis} disabled={createIntent.isPending} className="gap-2">
          <Wrench className="h-4 w-4" />
          {createIntent.isPending ? "Creating..." : "Fix this"}
        </Button>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-gradient rounded-lg border border-border p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            {isNegative ? (
              <TrendingDown className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingUp className="h-4 w-4 text-warning" />
            )}
            <span className="text-sm">Change</span>
          </div>
          <p className={`text-3xl font-semibold ${isNegative ? "text-destructive" : "text-warning"}`}>
            {alert.delta > 0 ? "+" : ""}{alert.delta.toFixed(2)}%
          </p>
        </div>

        <div className="card-gradient rounded-lg border border-border p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Current vs Baseline</span>
          </div>
          <p className="text-3xl font-semibold">
            {alert.current_value.toFixed(2)} <span className="text-lg text-muted-foreground">/ {alert.baseline_value.toFixed(2)}</span>
          </p>
        </div>

        <div className="card-gradient rounded-lg border border-border p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Baseline Window</span>
          </div>
          <p className="text-3xl font-semibold">{alert.baseline_window}</p>
        </div>
      </div>

      {/* Suspected Change */}
      {alert.suspected_change && (
        <div className="card-gradient rounded-lg border border-warning/30 p-5">
          <h2 className="text-lg font-semibold mb-2">Suspected Cause</h2>
          <p className="text-muted-foreground">{alert.suspected_change}</p>
        </div>
      )}

      {/* Mock Metric Chart */}
      <div className="card-gradient rounded-lg border border-border p-5">
        <h2 className="text-lg font-semibold mb-4">Metric Trend</h2>
        <div className="h-48 flex items-end justify-around gap-1">
          {Array.from({ length: 24 }).map((_, i) => {
            const isRecent = i >= 20;
            const height = isRecent
              ? 30 + Math.random() * 20
              : 60 + Math.random() * 30;
            return (
              <div
                key={i}
                className={`flex-1 rounded-t transition-colors ${
                  isRecent ? "bg-destructive/60" : "bg-primary/40"
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>24 hours ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Alert Type Info */}
      <div className="card-gradient rounded-lg border border-border p-5">
        <h2 className="text-lg font-semibold mb-2">Alert Type</h2>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">{alert.type}</span> - 
          {alert.type === "MetricDrop" && " A key metric has dropped below the expected baseline."}
          {alert.type === "ErrorSpike" && " Error rate has increased above acceptable thresholds."}
          {alert.type === "LatencyRegression" && " Response times have degraded significantly."}
          {alert.type === "MetricSpike" && " A metric has spiked above normal levels."}
          {alert.type === "FunnelStepRegression" && " Conversion at a funnel step has decreased."}
        </p>
      </div>
    </div>
  );
}
