import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/ui/metric-card";
import { useAlerts } from "@/hooks/useAlerts";
import { useIntents } from "@/hooks/useIntents";
import {
  Plus,
  TrendingUp,
  Zap,
  ShieldAlert,
  Clock,
  ArrowRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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

export default function Home() {
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: intents, isLoading: intentsLoading } = useIntents();

  const activeAlerts = alerts?.filter((a) => a.status === "Open") || [];
  const activeIntents = intents?.filter((i) => i.status !== "Completed" && i.status !== "RolledBack") || [];
  const completedIntents = intents?.filter((i) => i.status === "Completed") || [];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Product Health Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor, diagnose, and remediate product issues
          </p>
        </div>
        <Link to="/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Intent
          </Button>
        </Link>
      </div>

      {/* KPI Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Conversion Rate"
          value="3.24%"
          change={-0.4}
          changeLabel="vs last week"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Revenue/Session"
          value="$2.85"
          change={-0.12}
          changeLabel="vs last week"
          icon={<Zap className="h-5 w-5" />}
        />
        <MetricCard
          title="Latency P95"
          value="142ms"
          change={15}
          changeLabel="ms increase"
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricCard
          title="Error Rate"
          value="0.4%"
          change={0.2}
          changeLabel="vs last week"
          icon={<ShieldAlert className="h-5 w-5" />}
        />
      </div>

      {/* Active Alerts */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-semibold">Active Alerts</h2>
            <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
              {activeAlerts.length}
            </span>
          </div>
          <Link
            to="/alerts"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {alertsLoading ? (
          <div className="text-muted-foreground">Loading alerts...</div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.slice(0, 4).map((alert) => (
              <Link
                key={alert.id}
                to={`/alerts/${alert.id}`}
                className="card-gradient flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-warning/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{alert.metric_name.replace(/_/g, " ")}</p>
                    <StatusBadge variant={getSeverityVariant(alert.severity)}>
                      {alert.severity}
                    </StatusBadge>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className={alert.delta < 0 ? "text-destructive" : "text-warning"}>
                      {alert.delta > 0 ? "+" : ""}{alert.delta.toFixed(1)}% change
                    </span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(alert.detected_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Active Intents */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Active Intents</h2>
          </div>
          <Link
            to="/intents"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {intentsLoading ? (
          <div className="text-muted-foreground">Loading intents...</div>
        ) : (
          <div className="space-y-3">
            {activeIntents.map((intent) => (
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
                      {intent.goal_target_delta > 0 ? "+" : ""}{intent.goal_target_delta}% {intent.goal_metric.replace(/_/g, " ")}
                    </span>
                    <span>•</span>
                    <span>{intent.time_horizon_days} days</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Wins */}
      {completedIntents.length > 0 && (
        <div className="card-gradient rounded-lg border border-border p-5">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h2 className="text-lg font-semibold">Recent Wins</h2>
          </div>
          <div className="space-y-3">
            {completedIntents.slice(0, 3).map((intent) => (
              <Link
                key={intent.id}
                to={`/intents/${intent.id}`}
                className="flex items-start gap-3 rounded-lg bg-success/5 border border-success/20 p-3 hover:bg-success/10 transition-colors"
              >
                <div className="mt-0.5 h-2 w-2 rounded-full bg-success" />
                <div className="flex-1">
                  <p className="font-medium">{intent.title}</p>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-success">
                      +{intent.goal_target_delta}% {intent.goal_metric.replace(/_/g, " ")}
                    </span>
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(new Date(intent.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
