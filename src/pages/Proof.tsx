import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  BarChart3,
  TrendingUp,
  Shield,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Download,
  Share2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const chartData = [
  { day: "Day 1", control: 3.2, treatment: 3.3 },
  { day: "Day 2", control: 3.1, treatment: 3.5 },
  { day: "Day 3", control: 3.3, treatment: 3.7 },
  { day: "Day 4", control: 3.2, treatment: 3.8 },
  { day: "Day 5", control: 3.4, treatment: 3.9 },
  { day: "Day 6", control: 3.3, treatment: 4.0 },
  { day: "Day 7", control: 3.2, treatment: 3.9 },
];

const metricsComparison = [
  {
    metric: "Conversion Rate",
    before: "3.24%",
    after: "3.89%",
    change: "+0.65%",
    isPositive: true,
  },
  {
    metric: "Avg. Order Value",
    before: "$87.50",
    after: "$89.20",
    change: "+$1.70",
    isPositive: true,
  },
  {
    metric: "Cart Abandonment",
    before: "68.2%",
    after: "65.8%",
    change: "-2.4%",
    isPositive: true,
  },
  {
    metric: "Page Load Time",
    before: "1.8s",
    after: "1.7s",
    change: "-0.1s",
    isPositive: true,
  },
];

const guardrails = [
  { name: "Latency (p95)", target: "< 200ms", actual: "156ms", status: "passed" },
  { name: "Error Rate", target: "< 0.1%", actual: "0.02%", status: "passed" },
  { name: "Bounce Rate", target: "< +5%", actual: "-1.2%", status: "passed" },
  { name: "Revenue Impact", target: "> $0", actual: "+$45K/mo", status: "passed" },
];

export default function Proof() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Intent:</span>
            <span className="text-foreground">
              Increase checkout conversion by 1%
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Outcome Proof
          </h1>
          <p className="mt-1 text-muted-foreground">
            Simplified Payment Form A/B Test Results
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="card-gradient rounded-lg border border-success/30 p-6 glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Experiment Successful</h2>
              <p className="text-muted-foreground">
                Goal achieved with 98% statistical confidence
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Net Impact</p>
            <p className="text-4xl font-bold text-gradient">+0.65%</p>
            <p className="text-sm text-success">conversion rate</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card-gradient rounded-lg border border-border p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Control vs Treatment</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="day"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={[2.5, 4.5]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="control"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--muted-foreground))" }}
                name="Control"
              />
              <Line
                type="monotone"
                dataKey="treatment"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
                name="Treatment"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Before vs After */}
      <div className="card-gradient rounded-lg border border-border p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Before vs After</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricsComparison.map((metric, index) => (
            <div
              key={index}
              className="rounded-lg bg-secondary p-4"
            >
              <p className="text-sm text-muted-foreground">{metric.metric}</p>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Before</p>
                  <p className="text-lg font-semibold">{metric.before}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">After</p>
                  <p className="text-lg font-semibold">{metric.after}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1 rounded-full bg-success/10 py-1 text-success">
                {metric.isPositive ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span className="font-medium">{metric.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guardrail Status */}
      <div className="card-gradient rounded-lg border border-border p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Guardrail Status</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {guardrails.map((guard, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-success/5 border border-success/20 p-4"
            >
              <div>
                <p className="font-medium">{guard.name}</p>
                <p className="text-sm text-muted-foreground">
                  Target: {guard.target}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-success">{guard.actual}</p>
                <StatusBadge variant="success" className="mt-1">
                  Passed
                </StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision */}
      <div className="card-gradient rounded-lg border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Decision</h2>
        <div className="flex items-center gap-4">
          <Button className="gap-2 bg-success hover:bg-success/90">
            <CheckCircle2 className="h-4 w-4" />
            Keep Changes (100% rollout)
          </Button>
          <Button variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Iterate Further
          </Button>
          <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
            <RotateCcw className="h-4 w-4" />
            Rollback
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          <span className="text-foreground font-medium">Causal Confidence: 98%</span>
          {" "}— Strong evidence that changes directly caused the improvement
        </p>
      </div>
    </div>
  );
}
