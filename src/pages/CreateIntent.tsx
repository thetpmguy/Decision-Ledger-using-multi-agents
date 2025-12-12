import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Target,
  TrendingUp,
  Shield,
  Users,
  Clock,
  Gauge,
  X,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useCreateIntent } from "@/hooks/useIntents";
import type { AuthorityMode } from "@/lib/types";

const metricOptions = [
  "Conversion Rate",
  "Average Order Value",
  "Cart Abandonment",
  "Latency (p95)",
  "Error Rate",
  "Revenue",
  "Bounce Rate",
  "Session Duration",
];

const constraintOptions = [
  "Latency < 200ms",
  "Error rate < 0.1%",
  "No UI changes",
  "Maintain accessibility",
  "GDPR compliant",
  "No pricing changes",
];

const ownerOptions = [
  "Sarah Miller (PM)",
  "John Davis (Eng)",
  "Mike Roberts (Analytics)",
  "Alex Kim (Design)",
  "Lisa Park (QA)",
];

const authorityMap: Record<string, AuthorityMode> = {
  "recommend": "RecommendOnly",
  "recommend-execute": "RecommendThenExecute",
  "auto-execute": "AutoExecute",
};

const timeHorizonMap: Record<string, number> = {
  "1-week": 7,
  "2-weeks": 14,
  "1-month": 30,
  "3-months": 90,
};

const blastRadiusMap: Record<number, number[]> = {
  0: [1],
  1: [1, 10],
  2: [1, 10, 50],
  3: [1, 10, 50, 100],
};

export default function CreateIntent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sourceAlertId = searchParams.get("alertId");
  
  const createIntent = useCreateIntent();
  
  const [goal, setGoal] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
  const [authority, setAuthority] = useState("recommend");
  const [blastRadius, setBlastRadius] = useState([1]);
  const [timeHorizon, setTimeHorizon] = useState("2-weeks");
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [autoRollback, setAutoRollback] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal.trim()) {
      toast.error("Please enter a goal");
      return;
    }
    
    if (selectedMetrics.length === 0) {
      toast.error("Please select at least one metric");
      return;
    }

    try {
      const newIntent = await createIntent.mutateAsync({
        title: goal.trim(),
        goal_metric: selectedMetrics[0],
        goal_target_delta: 1, // Default 1% improvement target
        time_horizon_days: timeHorizonMap[timeHorizon],
        authority_mode: authorityMap[authority],
        blast_radius_plan: blastRadiusMap[blastRadius[0]],
        constraints: {
          items: selectedConstraints,
          auto_rollback: autoRollback,
        },
        source_alert_id: sourceAlertId,
      });

      toast.success("Intent created successfully", {
        description: "Your intent is now being analyzed by our AI agents.",
      });
      navigate(`/intents/${newIntent.id}`);
    } catch (error) {
      toast.error("Failed to create intent", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const toggleItem = (
    item: string,
    list: string[],
    setList: (items: string[]) => void
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const blastRadiusLabels = ["1%", "10%", "50%", "100%"];

  return (
    <div className="animate-fade-in mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create Intent</h1>
        <p className="mt-1 text-muted-foreground">
          Define your business outcome and let AI optimize for it
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Goal */}
        <div className="card-gradient rounded-lg border border-border p-6">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Goal</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal">What outcome do you want to achieve?</Label>
              <Textarea
                id="goal"
                placeholder="e.g., Increase checkout conversion by 1% within 2 weeks"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="mt-2 min-h-[100px] resize-none bg-secondary/50"
              />
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="card-gradient rounded-lg border border-border p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Metrics to Move</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {metricOptions.map((metric) => (
              <Badge
                key={metric}
                variant={selectedMetrics.includes(metric) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:bg-primary/20"
                onClick={() => toggleItem(metric, selectedMetrics, setSelectedMetrics)}
              >
                {selectedMetrics.includes(metric) && (
                  <X className="mr-1 h-3 w-3" />
                )}
                {metric}
              </Badge>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div className="card-gradient rounded-lg border border-border p-6">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Constraints (Guardrails)</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {constraintOptions.map((constraint) => (
              <Badge
                key={constraint}
                variant={
                  selectedConstraints.includes(constraint) ? "default" : "outline"
                }
                className="cursor-pointer transition-all hover:bg-primary/20"
                onClick={() =>
                  toggleItem(constraint, selectedConstraints, setSelectedConstraints)
                }
              >
                {selectedConstraints.includes(constraint) && (
                  <X className="mr-1 h-3 w-3" />
                )}
                {constraint}
              </Badge>
            ))}
            <Badge
              variant="outline"
              className="cursor-pointer border-dashed hover:bg-primary/20"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add custom
            </Badge>
          </div>
        </div>

        {/* Authority & Blast Radius */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-gradient rounded-lg border border-border p-6">
            <div className="mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Authority Level</h2>
            </div>
            <Select value={authority} onValueChange={setAuthority}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Select authority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommend">Recommend Only</SelectItem>
                <SelectItem value="recommend-execute">
                  Recommend + Execute with Approval
                </SelectItem>
                <SelectItem value="auto-execute">Auto-Execute</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-sm text-muted-foreground">
              {authority === "recommend" &&
                "AI will propose changes but require manual execution"}
              {authority === "recommend-execute" &&
                "AI will propose and execute after human approval"}
              {authority === "auto-execute" &&
                "AI will autonomously execute within guardrails"}
            </p>
          </div>

          <div className="card-gradient rounded-lg border border-border p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Blast Radius</h2>
            </div>
            <div className="space-y-4">
              <Slider
                value={blastRadius}
                onValueChange={setBlastRadius}
                max={3}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                {blastRadiusLabels.map((label, i) => (
                  <span
                    key={label}
                    className={blastRadius[0] === i ? "text-primary font-medium" : ""}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Changes will initially affect {blastRadiusLabels[blastRadius[0]]} of
                traffic
              </p>
            </div>
          </div>
        </div>

        {/* Time Horizon & Auto Rollback */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-gradient rounded-lg border border-border p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Time Horizon</h2>
            </div>
            <Select value={timeHorizon} onValueChange={setTimeHorizon}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Select time horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-week">1 Week</SelectItem>
                <SelectItem value="2-weeks">2 Weeks</SelectItem>
                <SelectItem value="1-month">1 Month</SelectItem>
                <SelectItem value="3-months">3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="card-gradient flex items-center justify-between rounded-lg border border-border p-6">
            <div>
              <h2 className="text-lg font-semibold">Auto Rollback</h2>
              <p className="text-sm text-muted-foreground">
                Automatically revert if guardrails are breached
              </p>
            </div>
            <Switch checked={autoRollback} onCheckedChange={setAutoRollback} />
          </div>
        </div>

        {/* Owners */}
        <div className="card-gradient rounded-lg border border-border p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Owners</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {ownerOptions.map((owner) => (
              <Badge
                key={owner}
                variant={selectedOwners.includes(owner) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:bg-primary/20"
                onClick={() => toggleItem(owner, selectedOwners, setSelectedOwners)}
              >
                {selectedOwners.includes(owner) && <X className="mr-1 h-3 w-3" />}
                {owner}
              </Badge>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            Create Intent
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
