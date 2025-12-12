import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import {
  FlaskConical,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Clock,
  Users,
  BarChart3,
} from "lucide-react";

const simulationData = {
  title: "Simplified Payment Form A/B Test",
  status: "passed" as const,
  confidence: 94,
  predictedLift: { min: 0.5, max: 1.2, expected: 0.8 },
  constraintChecks: [
    { name: "Latency < 200ms", status: "passed", value: "142ms avg" },
    { name: "Error rate < 0.1%", status: "passed", value: "0.02%" },
    { name: "No UI regressions", status: "passed", value: "0 detected" },
    { name: "Accessibility maintained", status: "passed", value: "AA compliant" },
  ],
  risks: [
    {
      title: "Payment provider rate limiting",
      likelihood: "Low",
      impact: "Medium",
      mitigation: "Implemented backoff strategy",
    },
    {
      title: "Form validation edge cases",
      likelihood: "Low",
      impact: "Low",
      mitigation: "Added comprehensive test coverage",
    },
  ],
  approvals: [
    { role: "Engineering Lead", name: "John Davis", status: "approved" },
    { role: "PM Owner", name: "Sarah Miller", status: "pending" },
  ],
};

export default function Simulation() {
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
            Simulation Results
          </h1>
          <p className="mt-1 text-muted-foreground">
            {simulationData.title}
          </p>
        </div>
        <StatusBadge variant="success" className="text-base px-4 py-1.5">
          <CheckCircle2 className="mr-1.5 h-4 w-4" />
          Simulation Passed
        </StatusBadge>
      </div>

      {/* Predicted Impact */}
      <div className="card-gradient rounded-lg border border-border p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Predicted Impact</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Expected Lift</p>
            <p className="mt-1 text-4xl font-bold text-gradient">
              +{simulationData.predictedLift.expected}%
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              conversion rate
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Range</p>
            <p className="mt-1 text-2xl font-semibold">
              +{simulationData.predictedLift.min}% to +
              {simulationData.predictedLift.max}%
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              95% confidence interval
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Confidence Score</p>
            <div className="mt-2">
              <div className="mx-auto h-20 w-20 rounded-full border-4 border-success flex items-center justify-center">
                <span className="text-2xl font-bold text-success">
                  {simulationData.confidence}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Constraint Checks */}
      <div className="card-gradient rounded-lg border border-border p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Constraint Checks</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {simulationData.constraintChecks.map((check, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-success/5 border border-success/20 p-4"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="font-medium">{check.name}</span>
              </div>
              <span className="text-success font-medium">{check.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risks & Approvals */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* What Could Go Wrong */}
        <div className="card-gradient rounded-lg border border-border p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-semibold">Potential Risks</h2>
          </div>
          <div className="space-y-3">
            {simulationData.risks.map((risk, index) => (
              <div
                key={index}
                className="rounded-lg bg-secondary p-4"
              >
                <p className="font-medium">{risk.title}</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Likelihood:{" "}
                    <span className="text-foreground">{risk.likelihood}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Impact:{" "}
                    <span className="text-foreground">{risk.impact}</span>
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="text-success">Mitigation:</span>{" "}
                  {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Required Approvals */}
        <div className="card-gradient rounded-lg border border-border p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Required Approvals</h2>
          </div>
          <div className="space-y-3">
            {simulationData.approvals.map((approval, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg p-4 ${
                  approval.status === "approved"
                    ? "bg-success/5 border border-success/20"
                    : "bg-warning/5 border border-warning/20"
                }`}
              >
                <div>
                  <p className="font-medium">{approval.name}</p>
                  <p className="text-sm text-muted-foreground">{approval.role}</p>
                </div>
                <StatusBadge
                  variant={approval.status === "approved" ? "success" : "warning"}
                >
                  {approval.status === "approved" ? "Approved" : "Pending"}
                </StatusBadge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between card-gradient rounded-lg border border-border p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Estimated time to results: 3-5 days
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            Sample size: 50,000 users
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Request Changes</Button>
          <Button className="gap-2">
            Start Canary (1%)
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
