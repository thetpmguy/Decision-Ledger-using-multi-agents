import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIntent, useUpdateIntentStatus } from "@/hooks/useIntents";
import { useDiagnosis, useGenerateDiagnosis } from "@/hooks/useDiagnoses";
import { useFixPlans, useGenerateFixPlans, useUpdateFixPlanStatus } from "@/hooks/useFixPlans";
import { useRunsForIntent, useCreateRun, useCompleteRun } from "@/hooks/useRuns";
import { useTimelineEvents } from "@/hooks/useTimeline";
import { TimelineItem } from "@/components/ui/timeline-item";
import {
  ArrowLeft,
  Brain,
  Wrench,
  Play,
  Clock,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pause,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Completed":
    case "Passed":
      return "success" as const;
    case "Executing":
    case "Simulating":
    case "Running":
      return "active" as const;
    case "RolledBack":
    case "Paused":
    case "Failed":
      return "warning" as const;
    case "Rejected":
      return "destructive" as const;
    default:
      return "default" as const;
  }
};

const getTimelineStatus = (eventType: string) => {
  switch (eventType) {
    case "Completed":
    case "SimulationPassed":
      return "completed" as const;
    case "GuardrailBreached":
    case "AutoRollback":
    case "SimulationFailed":
      return "failed" as const;
    default:
      return "completed" as const;
  }
};

export default function IntentOverview() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("diagnosis");

  const { data: intent, isLoading: intentLoading } = useIntent(id || "");
  const { data: diagnosis, isLoading: diagnosisLoading } = useDiagnosis(id || "");
  const { data: fixPlans, isLoading: plansLoading } = useFixPlans(id || "");
  const { data: runs, isLoading: runsLoading } = useRunsForIntent(id || "");
  const { data: timelineEvents, isLoading: timelineLoading } = useTimelineEvents(id || "");

  const generateDiagnosis = useGenerateDiagnosis();
  const generateFixPlans = useGenerateFixPlans();
  const createRun = useCreateRun();
  const completeRun = useCompleteRun();
  const updateIntentStatus = useUpdateIntentStatus();
  const updateFixPlanStatus = useUpdateFixPlanStatus();

  const handleGenerateDiagnosis = async () => {
    if (!id) return;
    try {
      await generateDiagnosis.mutateAsync(id);
      toast.success("Diagnosis generated");
    } catch (error) {
      toast.error("Failed to generate diagnosis");
    }
  };

  const handleGenerateFixPlans = async () => {
    if (!id) return;
    try {
      await generateFixPlans.mutateAsync(id);
      toast.success("Fix plans generated");
      setActiveTab("plans");
    } catch (error) {
      toast.error("Failed to generate fix plans");
    }
  };

  const handleRunSimulation = async (planId: string) => {
    if (!id) return;
    try {
      const run = await createRun.mutateAsync({
        fixPlanId: planId,
        intentId: id,
        mode: "Simulation",
        trafficPercent: 0,
      });

      // Simulate completion after 2 seconds
      setTimeout(async () => {
        await completeRun.mutateAsync({
          runId: run.id,
          fixPlanId: planId,
          intentId: id,
          passed: true,
          resultSummary: {
            conversion_lift_estimate: 0.9 + Math.random() * 0.4,
            latency_delta_estimate: -5 + Math.random() * 10,
            error_delta_estimate: -0.1 + Math.random() * 0.05,
            confidence: 0.85 + Math.random() * 0.1,
          },
        });
        toast.success("Simulation passed");
      }, 2000);

      toast.info("Running simulation...");
      setActiveTab("runs");
    } catch (error) {
      toast.error("Failed to run simulation");
    }
  };

  const handleRunCanary = async (planId: string, percent: number = 1) => {
    if (!id) return;
    try {
      await createRun.mutateAsync({
        fixPlanId: planId,
        intentId: id,
        mode: "Canary",
        trafficPercent: percent,
      });
      await updateFixPlanStatus.mutateAsync({ id: planId, status: "Executing", intentId: id });
      toast.success(`Canary started at ${percent}%`);
      setActiveTab("runs");
    } catch (error) {
      toast.error("Failed to start canary");
    }
  };

  if (intentLoading || !intent) {
    return <div className="text-muted-foreground">Loading intent...</div>;
  }

  const completedRun = runs?.find(
    (r) => r.status === "Passed" && (r as any).fix_plans?.status === "Completed"
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{intent.title}</h1>
            <StatusBadge
              variant={getStatusVariant(intent.status)}
              pulse={intent.status === "Executing" || intent.status === "Simulating"}
            >
              {intent.status}
            </StatusBadge>
          </div>
          <p className="text-muted-foreground mt-1">
            Goal: {intent.goal_target_delta > 0 ? "+" : ""}{intent.goal_target_delta}%{" "}
            {intent.goal_metric.replace(/_/g, " ")} • {intent.time_horizon_days} days
          </p>
        </div>
        <div className="flex gap-2">
          {intent.status === "Executing" && (
            <>
              <Button
                variant="outline"
                onClick={() => updateIntentStatus.mutate({ id: intent.id, status: "Paused" })}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button
                variant="destructive"
                onClick={() => updateIntentStatus.mutate({ id: intent.id, status: "RolledBack" })}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Rollback
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="diagnosis" className="gap-2">
            <Brain className="h-4 w-4" />
            Diagnosis
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-2">
            <Wrench className="h-4 w-4" />
            Fix Plans
          </TabsTrigger>
          <TabsTrigger value="runs" className="gap-2">
            <Play className="h-4 w-4" />
            Runs
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <Clock className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="proof" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Outcome Proof
          </TabsTrigger>
        </TabsList>

        {/* Diagnosis Tab */}
        <TabsContent value="diagnosis" className="space-y-6 mt-6">
          {!diagnosis ? (
            <div className="text-center py-12 card-gradient rounded-lg border border-border">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No diagnosis yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate a diagnosis to identify root causes
              </p>
              <Button onClick={handleGenerateDiagnosis} disabled={generateDiagnosis.isPending}>
                {generateDiagnosis.isPending ? "Generating..." : "Generate Diagnosis"}
              </Button>
            </div>
          ) : (
            <>
              <div className="card-gradient rounded-lg border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Root Cause Hypotheses</h2>
                </div>
                <div className="space-y-4">
                  {(diagnosis.root_cause_hypotheses as any[]).map((h, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-secondary/50 p-4 border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-medium">{h.hypothesis}</p>
                        <span className="text-sm text-primary font-medium">
                          {Math.round(h.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{h.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="card-gradient rounded-lg border border-border p-6">
                  <h3 className="font-semibold mb-3">Segments Impacted</h3>
                  <div className="flex flex-wrap gap-2">
                    {(diagnosis.segments_impacted as string[]).map((seg, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                      >
                        {seg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-gradient rounded-lg border border-border p-6">
                  <h3 className="font-semibold mb-3">Recommended Questions</h3>
                  <ul className="space-y-2">
                    {(diagnosis.recommended_next_questions as string[]).map((q, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleGenerateFixPlans} disabled={generateFixPlans.isPending}>
                  {generateFixPlans.isPending ? "Generating..." : "Generate Fix Plans"}
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* Fix Plans Tab */}
        <TabsContent value="plans" className="space-y-4 mt-6">
          {(!fixPlans || fixPlans.length === 0) ? (
            <div className="text-center py-12 card-gradient rounded-lg border border-border">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No fix plans yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate fix plans based on the diagnosis
              </p>
              <Button onClick={handleGenerateFixPlans} disabled={generateFixPlans.isPending || !diagnosis}>
                {generateFixPlans.isPending ? "Generating..." : "Generate Fix Plans"}
              </Button>
            </div>
          ) : (
            fixPlans.map((plan) => (
              <div
                key={plan.id}
                className="card-gradient rounded-lg border border-border p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{plan.name}</h3>
                      <StatusBadge variant={getStatusVariant(plan.status)}>
                        {plan.status}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{plan.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Expected Impact</p>
                    <p className="font-medium text-primary">
                      +{((plan.expected_impact as any)?.conversion_lift_pct_range?.[0] || 0).toFixed(1)}% to +{((plan.expected_impact as any)?.conversion_lift_pct_range?.[1] || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            plan.risk_score < 30
                              ? "bg-success"
                              : plan.risk_score < 60
                              ? "bg-warning"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${plan.risk_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{plan.risk_score}</span>
                    </div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Cost Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${plan.cost_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{plan.cost_score}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  {plan.status === "Proposed" && (
                    <Button
                      variant="outline"
                      onClick={() => handleRunSimulation(plan.id)}
                      disabled={createRun.isPending}
                    >
                      Run Simulation
                    </Button>
                  )}
                  {(plan.status === "Proposed" || plan.status === "Simulating") && (
                    <Button
                      onClick={() => handleRunCanary(plan.id, 1)}
                      disabled={createRun.isPending}
                    >
                      Run Canary (1%)
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Runs Tab */}
        <TabsContent value="runs" className="space-y-4 mt-6">
          {(!runs || runs.length === 0) ? (
            <div className="text-center py-12 card-gradient rounded-lg border border-border">
              <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No runs yet</h3>
              <p className="text-muted-foreground">
                Run a simulation or canary to see results here
              </p>
            </div>
          ) : (
            runs.map((run: any) => (
              <div
                key={run.id}
                className="card-gradient rounded-lg border border-border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {run.status === "Passed" && <CheckCircle2 className="h-5 w-5 text-success" />}
                    {run.status === "Failed" && <XCircle className="h-5 w-5 text-destructive" />}
                    {run.status === "Running" && <Play className="h-5 w-5 text-primary animate-pulse" />}
                    <div>
                      <p className="font-medium">{run.fix_plans?.name || "Run"}</p>
                      <p className="text-sm text-muted-foreground">
                        {run.mode} • {run.traffic_percent}% traffic
                      </p>
                    </div>
                  </div>
                  <StatusBadge variant={getStatusVariant(run.status)} pulse={run.status === "Running"}>
                    {run.status}
                  </StatusBadge>
                </div>

                {run.result_summary && Object.keys(run.result_summary).length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {run.result_summary.conversion_lift_estimate !== undefined && (
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Conversion Lift</p>
                        <p className="text-lg font-semibold text-success">
                          +{run.result_summary.conversion_lift_estimate?.toFixed(2)}%
                        </p>
                      </div>
                    )}
                    {run.result_summary.conversion_lift_current !== undefined && (
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Current Lift</p>
                        <p className="text-lg font-semibold text-success">
                          +{run.result_summary.conversion_lift_current?.toFixed(2)}%
                        </p>
                      </div>
                    )}
                    {run.result_summary.latency_delta_estimate !== undefined && (
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Latency Delta</p>
                        <p className="text-lg font-semibold">
                          {run.result_summary.latency_delta_estimate?.toFixed(0)}ms
                        </p>
                      </div>
                    )}
                    {run.result_summary.confidence !== undefined && (
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Confidence</p>
                        <p className="text-lg font-semibold text-primary">
                          {Math.round(run.result_summary.confidence * 100)}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="mt-6">
          <div className="card-gradient rounded-lg border border-border p-6">
            {(!timelineEvents || timelineEvents.length === 0) ? (
              <p className="text-muted-foreground text-center py-8">No events yet</p>
            ) : (
              <div className="space-y-0">
                {timelineEvents.map((event, i) => (
                  <TimelineItem
                    key={event.id}
                    title={event.event_type.replace(/([A-Z])/g, " $1").trim()}
                    description={JSON.stringify(event.details)}
                    timestamp={formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                    status={getTimelineStatus(event.event_type)}
                    actor={event.actor}
                    isLast={i === timelineEvents.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Outcome Proof Tab */}
        <TabsContent value="proof" className="space-y-6 mt-6">
          {intent.status !== "Completed" ? (
            <div className="text-center py-12 card-gradient rounded-lg border border-border">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Outcome proof pending</h3>
              <p className="text-muted-foreground">
                Complete the execution to see before/after metrics
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="card-gradient rounded-lg border border-border p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    Before
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversion Rate</span>
                      <span className="font-medium">2.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Error Rate</span>
                      <span className="font-medium">0.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latency P95</span>
                      <span className="font-medium">320ms</span>
                    </div>
                  </div>
                </div>

                <div className="card-gradient rounded-lg border border-success/30 p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    After
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversion Rate</span>
                      <span className="font-medium text-success">5.0% (+2.2%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Error Rate</span>
                      <span className="font-medium text-success">0.3% (-0.2%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latency P95</span>
                      <span className="font-medium text-success">290ms (-30ms)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-gradient rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Causal Confidence</h3>
                  <span className="text-2xl font-bold text-primary">94%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "94%" }} />
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  High statistical confidence that the improvement was caused by the fix.
                </p>
              </div>

              <div className="card-gradient rounded-lg border border-success/30 bg-success/5 p-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">Intent Completed Successfully</h3>
                <p className="text-muted-foreground">
                  The fix has been verified and the metric improvement is statistically significant.
                </p>
                <p className="text-success font-medium mt-2">
                  Decision: Keep the change
                </p>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
