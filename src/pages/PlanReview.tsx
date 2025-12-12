import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";
import {
  BarChart3,
  GitBranch,
  Lightbulb,
  AlertTriangle,
  Check,
  X,
  MessageSquare,
  ArrowRight,
  Sparkles,
  DollarSign,
  Clock,
  RotateCcw,
} from "lucide-react";

const proposals = [
  {
    id: "1",
    agent: "Metrics Agent",
    agentIcon: BarChart3,
    title: "Baseline Analysis Complete",
    description:
      "Identified checkout step 3 (payment info) as the biggest drop-off point with 23% abandonment rate. This is 8% higher than industry benchmark.",
    insight:
      "Users are spending an average of 45s on this step before abandoning. Mobile users abandon 34% more than desktop.",
    expectedImpact: "+0.8% conversion",
    riskScore: "Low",
    cost: "$0 (analysis only)",
    status: "approved" as const,
  },
  {
    id: "2",
    agent: "Experiment Agent",
    agentIcon: GitBranch,
    title: "A/B Test: Simplified Payment Form",
    description:
      "Proposes removing optional fields and enabling autofill for payment information. Test against current form with 50/50 traffic split.",
    insight:
      "Similar experiments at comparable companies showed 0.5-1.2% lift. Form completion time expected to reduce by 15s.",
    expectedImpact: "+0.5% to +1.2% conversion",
    riskScore: "Low",
    cost: "$500 (eng time)",
    status: "pending" as const,
  },
  {
    id: "3",
    agent: "Domain Agent",
    agentIcon: Lightbulb,
    title: "Express Checkout Integration",
    description:
      "Integrate Apple Pay and Google Pay as primary payment options. Reduces form fields from 8 to 1 for supported devices.",
    insight:
      "42% of mobile traffic uses compatible devices. Could eliminate payment step entirely for these users.",
    expectedImpact: "+1.5% to +2.1% conversion",
    riskScore: "Medium",
    cost: "$2,000 (integration + fees)",
    status: "pending" as const,
  },
];

export default function PlanReview() {
  const [expandedId, setExpandedId] = useState<string | null>("1");

  const handleApprove = (id: string) => {
    toast.success("Proposal approved", {
      description: "Simulation will begin shortly.",
    });
  };

  const handleReject = (id: string) => {
    toast.info("Proposal rejected", {
      description: "Agent will generate alternate proposals.",
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-success";
      case "medium":
        return "text-warning";
      case "high":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Intent:</span>
          <span className="text-foreground">Increase checkout conversion by 1%</span>
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Plan Review</h1>
        <p className="mt-1 text-muted-foreground">
          Review proposals from specialist agents
        </p>
      </div>

      {/* Proposals */}
      <div className="space-y-4">
        {proposals.map((proposal) => {
          const isExpanded = expandedId === proposal.id;
          const Icon = proposal.agentIcon;

          return (
            <div
              key={proposal.id}
              className="card-gradient overflow-hidden rounded-lg border border-border transition-all hover:border-primary/30"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : proposal.id)}
                className="flex w-full items-center gap-4 p-5 text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">
                      {proposal.agent}
                    </span>
                    <StatusBadge
                      variant={proposal.status === "approved" ? "success" : "active"}
                      pulse={proposal.status === "pending"}
                    >
                      {proposal.status === "approved" ? "Approved" : "Pending Review"}
                    </StatusBadge>
                  </div>
                  <h3 className="mt-0.5 font-semibold">{proposal.title}</h3>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <span className="text-muted-foreground">Expected Impact</span>
                    <p className="font-semibold text-success">
                      {proposal.expectedImpact}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground">Risk</span>
                    <p className={`font-semibold ${getRiskColor(proposal.riskScore)}`}>
                      {proposal.riskScore}
                    </p>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-border bg-secondary/20 p-5">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Left column */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Description
                        </h4>
                        <p className="mt-1">{proposal.description}</p>
                      </div>
                      <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/20 p-3">
                        <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                          <span className="text-sm font-medium text-primary">
                            AI Insight
                          </span>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {proposal.insight}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-secondary p-3">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Risk Score
                          </div>
                          <p
                            className={`mt-1 font-semibold ${getRiskColor(
                              proposal.riskScore
                            )}`}
                          >
                            {proposal.riskScore}
                          </p>
                        </div>
                        <div className="rounded-lg bg-secondary p-3">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <DollarSign className="h-3.5 w-3.5" />
                            Est. Cost
                          </div>
                          <p className="mt-1 font-semibold">{proposal.cost}</p>
                        </div>
                        <div className="rounded-lg bg-secondary p-3">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <RotateCcw className="h-3.5 w-3.5" />
                            Rollback
                          </div>
                          <p className="mt-1 font-semibold text-success">Instant</p>
                        </div>
                      </div>

                      {proposal.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(proposal.id)}
                            className="flex-1 gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Approve Simulation
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleReject(proposal.id)}
                            className="gap-2"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Ask Alternate
                          </Button>
                        </div>
                      )}

                      {proposal.status === "approved" && (
                        <div className="flex items-center justify-between rounded-lg bg-success/10 border border-success/30 p-3">
                          <div className="flex items-center gap-2 text-success">
                            <Check className="h-5 w-5" />
                            <span className="font-medium">
                              Approved and running simulation
                            </span>
                          </div>
                          <Button variant="outline" size="sm" className="gap-1">
                            View Results
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
