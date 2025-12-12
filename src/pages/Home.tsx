import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/ui/metric-card";
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
} from "lucide-react";

const intents = [
  {
    id: "1",
    name: "Increase checkout conversion by 1%",
    status: "active" as const,
    progress: 65,
    metric: "+0.7%",
    owners: ["Sarah M.", "John D."],
  },
  {
    id: "2",
    name: "Reduce cart abandonment rate",
    status: "active" as const,
    progress: 42,
    metric: "-2.3%",
    owners: ["Mike R."],
  },
  {
    id: "3",
    name: "Optimize search latency to <100ms",
    status: "success" as const,
    progress: 100,
    metric: "87ms avg",
    owners: ["Alex K.", "Lisa P."],
  },
];

const risks = [
  {
    title: "Memory pressure on checkout service",
    severity: "warning" as const,
    intent: "Checkout conversion",
  },
  {
    title: "Experiment overlap detected",
    severity: "warning" as const,
    intent: "Cart abandonment",
  },
];

const wins = [
  {
    title: "Search latency reduced by 23%",
    impact: "+$12K/mo estimated",
    time: "2 hours ago",
  },
  {
    title: "Cart recovery email A/B winner deployed",
    impact: "+0.4% conversion",
    time: "Yesterday",
  },
];

export default function Home() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Outcomes Board</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor and manage your business intents
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
          change={0.7}
          changeLabel="vs last week"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg. Latency"
          value="142ms"
          change={-12}
          changeLabel="improvement"
          icon={<Zap className="h-5 w-5" />}
        />
        <MetricCard
          title="Error Rate"
          value="0.02%"
          change={-0.01}
          changeLabel="vs last week"
          icon={<ShieldAlert className="h-5 w-5" />}
        />
        <MetricCard
          title="Incidents"
          value="0"
          change={0}
          changeLabel="this week"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Active Intents */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Intents</h2>
          <Link
            to="/plans"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {intents.map((intent) => (
            <div
              key={intent.id}
              className="card-gradient flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-primary/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{intent.name}</p>
                  <StatusBadge
                    variant={intent.status}
                    pulse={intent.status === "active"}
                  >
                    {intent.status === "active" ? "In Progress" : "Completed"}
                  </StatusBadge>
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="text-primary font-medium">{intent.metric}</span>
                  <span>•</span>
                  <span>{intent.owners.join(", ")}</span>
                </div>
              </div>
              <div className="w-32">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{intent.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${intent.progress}%` }}
                  />
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      {/* Risks and Wins */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Risks */}
        <div className="card-gradient rounded-lg border border-border p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-semibold">Top Risks</h2>
          </div>
          <div className="space-y-3">
            {risks.map((risk, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-warning/5 border border-warning/20 p-3"
              >
                <div className="mt-0.5 h-2 w-2 rounded-full bg-warning" />
                <div>
                  <p className="font-medium">{risk.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Related to: {risk.intent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Wins */}
        <div className="card-gradient rounded-lg border border-border p-5">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h2 className="text-lg font-semibold">Recent Wins</h2>
          </div>
          <div className="space-y-3">
            {wins.map((win, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-success/5 border border-success/20 p-3"
              >
                <div className="mt-0.5 h-2 w-2 rounded-full bg-success" />
                <div className="flex-1">
                  <p className="font-medium">{win.title}</p>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-success">{win.impact}</span>
                    <span className="text-muted-foreground">{win.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
