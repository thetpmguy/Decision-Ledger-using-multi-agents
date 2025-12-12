import { TimelineItem } from "@/components/ui/timeline-item";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Clock,
  Download,
  Filter,
} from "lucide-react";

const timelineEvents = [
  {
    title: "Intent Created",
    description: "Increase checkout conversion by 1%",
    timestamp: "Dec 10, 2024 • 9:00 AM",
    status: "completed" as const,
    actor: "Created by Sarah Miller (PM)",
    details: [
      "Target metric: Conversion rate",
      "Constraints: Latency < 200ms, Error rate < 0.1%",
      "Authority: Recommend + Execute with Approval",
    ],
  },
  {
    title: "Analysis Complete",
    description: "Metrics Agent identified checkout step 3 as drop-off point",
    timestamp: "Dec 10, 2024 • 9:15 AM",
    status: "completed" as const,
    actor: "Metrics Agent",
    details: [
      "23% abandonment rate at payment step",
      "8% higher than industry benchmark",
      "Mobile users abandon 34% more than desktop",
    ],
  },
  {
    title: "Plan Proposed",
    description: "Simplified Payment Form A/B Test",
    timestamp: "Dec 10, 2024 • 9:30 AM",
    status: "completed" as const,
    actor: "Experiment Agent",
    details: [
      "Remove optional fields",
      "Enable autofill for payment info",
      "Expected impact: +0.5% to +1.2%",
    ],
  },
  {
    title: "Simulation Approved",
    description: "All constraint checks passed",
    timestamp: "Dec 10, 2024 • 2:00 PM",
    status: "completed" as const,
    actor: "Approved by John Davis (Eng Lead)",
    details: [
      "Latency: 142ms (within limits)",
      "Error rate: 0.02% (within limits)",
      "Confidence score: 94%",
    ],
  },
  {
    title: "Canary Started (1%)",
    description: "Experiment deployed to 1% of traffic",
    timestamp: "Dec 11, 2024 • 10:00 AM",
    status: "completed" as const,
    actor: "LaunchDarkly connector",
    details: [
      "Flag: checkout-simplified-form",
      "Traffic: 1% (≈500 users/day)",
      "Monitoring enabled",
    ],
  },
  {
    title: "Expanded to 10%",
    description: "Positive signals, expanding experiment",
    timestamp: "Dec 12, 2024 • 10:00 AM",
    status: "active" as const,
    actor: "Auto-expanded by system",
    details: [
      "Observed lift: +0.6%",
      "No guardrail breaches",
      "Traffic: 10% (≈5,000 users/day)",
    ],
  },
  {
    title: "Full Rollout (100%)",
    description: "Pending approval for full deployment",
    timestamp: "Estimated: Dec 15, 2024",
    status: "pending" as const,
    details: [
      "Requires PM approval",
      "Statistical significance: pending",
    ],
  },
];

export default function Timeline() {
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
            Execution Timeline
          </h1>
          <p className="mt-1 text-muted-foreground">
            Complete audit trail of all decisions and actions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="card-gradient rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StatusBadge variant="active" pulse className="text-sm px-3 py-1">
              <Clock className="mr-1.5 h-4 w-4" />
              In Progress
            </StatusBadge>
            <span className="text-muted-foreground">
              5 of 7 milestones completed
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Started</p>
              <p className="font-medium">Dec 10, 2024</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Est. Completion</p>
              <p className="font-medium">Dec 15, 2024</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Lift</p>
              <p className="font-medium text-success">+0.6%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card-gradient rounded-lg border border-border p-6">
        <div className="space-y-0">
          {timelineEvents.map((event, index) => (
            <TimelineItem
              key={index}
              {...event}
              isLast={index === timelineEvents.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
