import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FixPlan, FixPlanStatus } from "@/lib/types";

export function useFixPlans(intentId: string) {
  return useQuery({
    queryKey: ["fix_plans", intentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fix_plans")
        .select("*")
        .eq("intent_id", intentId)
        .order("risk_score", { ascending: true });

      if (error) throw error;
      return data as FixPlan[];
    },
    enabled: !!intentId,
  });
}

export function useGenerateFixPlans() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intentId: string) => {
      // Generate 3 mock fix plans
      const mockPlans = [
        {
          intent_id: intentId,
          name: "Rollback recent feature flag",
          type: "RollbackFlag" as const,
          expected_impact: { conversion_lift_pct_range: [0.7, 1.2] },
          risk_score: 15,
          cost_score: 10,
          guardrails: { latency_p95_delta_max: 50, error_rate_max: 0.1 },
          execution_steps: [
            "Disable feature flag via LaunchDarkly",
            "Monitor metrics for 30 minutes",
            "Verify baseline restoration",
          ],
          rollback_steps: ["Re-enable feature flag", "Alert on-call team"],
          status: "Proposed" as FixPlanStatus,
        },
        {
          intent_id: intentId,
          name: "Adjust timeout configuration",
          type: "ConfigTweak" as const,
          expected_impact: { conversion_lift_pct_range: [0.4, 0.8] },
          risk_score: 35,
          cost_score: 20,
          guardrails: { latency_p95_delta_max: 100, error_rate_max: 0.15 },
          execution_steps: [
            "Update timeout from 5s to 8s",
            "Deploy configuration change",
            "Monitor success rate",
          ],
          rollback_steps: ["Revert timeout configuration", "Notify platform team"],
          status: "Proposed" as FixPlanStatus,
        },
        {
          intent_id: intentId,
          name: "Run A/B experiment with optimized flow",
          type: "Experiment" as const,
          expected_impact: { conversion_lift_pct_range: [0.2, 1.5] },
          risk_score: 45,
          cost_score: 55,
          guardrails: { latency_p95_delta_max: 50, error_rate_max: 0.1, min_sample_size: 5000 },
          execution_steps: [
            "Create experiment variant",
            "Configure 10% traffic allocation",
            "Run for minimum 7 days",
          ],
          rollback_steps: ["End experiment", "Route all traffic to control"],
          status: "Proposed" as FixPlanStatus,
        },
      ];

      const { data, error } = await supabase
        .from("fix_plans")
        .insert(mockPlans)
        .select();

      if (error) throw error;

      // Create timeline event
      await supabase.from("timeline_events").insert({
        intent_id: intentId,
        event_type: "PlanProposed",
        actor: "System",
        details: { plans_count: mockPlans.length },
      });

      return data;
    },
    onSuccess: (_, intentId) => {
      queryClient.invalidateQueries({ queryKey: ["fix_plans", intentId] });
      queryClient.invalidateQueries({ queryKey: ["timeline_events"] });
    },
  });
}

export function useUpdateFixPlanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, intentId }: { id: string; status: FixPlanStatus; intentId: string }) => {
      const { data, error } = await supabase
        .from("fix_plans")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, intentId };
    },
    onSuccess: ({ intentId }) => {
      queryClient.invalidateQueries({ queryKey: ["fix_plans", intentId] });
    },
  });
}
