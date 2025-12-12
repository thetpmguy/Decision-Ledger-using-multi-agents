import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Run, RunMode, RunStatus, TimelineEventType } from "@/lib/types";

export function useRuns(fixPlanId: string) {
  return useQuery({
    queryKey: ["runs", fixPlanId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("runs")
        .select("*")
        .eq("fix_plan_id", fixPlanId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Run[];
    },
    enabled: !!fixPlanId,
  });
}

export function useRunsForIntent(intentId: string) {
  return useQuery({
    queryKey: ["runs_for_intent", intentId],
    queryFn: async () => {
      const { data: plans, error: plansError } = await supabase
        .from("fix_plans")
        .select("id")
        .eq("intent_id", intentId);

      if (plansError) throw plansError;
      if (!plans?.length) return [];

      const planIds = plans.map((p) => p.id);
      const { data, error } = await supabase
        .from("runs")
        .select("*, fix_plans!inner(name, type)")
        .in("fix_plan_id", planIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!intentId,
  });
}

export function useCreateRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fixPlanId,
      intentId,
      mode,
      trafficPercent = 0,
    }: {
      fixPlanId: string;
      intentId: string;
      mode: RunMode;
      trafficPercent?: number;
    }) => {
      // Create the run
      const { data: run, error: runError } = await supabase
        .from("runs")
        .insert({
          fix_plan_id: fixPlanId,
          mode,
          traffic_percent: trafficPercent,
          status: "Running" as RunStatus,
        })
        .select()
        .single();

      if (runError) throw runError;

      // Update fix plan status
      const newPlanStatus = mode === "Simulation" ? "Simulating" : "Executing";
      await supabase
        .from("fix_plans")
        .update({ status: newPlanStatus })
        .eq("id", fixPlanId);

      // Update intent status
      const newIntentStatus = mode === "Simulation" ? "Simulating" : "Executing";
      await supabase
        .from("intents")
        .update({ status: newIntentStatus })
        .eq("id", intentId);

      // Create timeline event
      const eventType: TimelineEventType =
        mode === "Simulation" ? "SimulationApproved" : "ExecuteApproved";
      await supabase.from("timeline_events").insert({
        intent_id: intentId,
        event_type: eventType,
        actor: "User",
        details: { mode, traffic_percent: trafficPercent },
      });

      return run;
    },
    onSuccess: (_, { fixPlanId, intentId }) => {
      queryClient.invalidateQueries({ queryKey: ["runs", fixPlanId] });
      queryClient.invalidateQueries({ queryKey: ["runs_for_intent", intentId] });
      queryClient.invalidateQueries({ queryKey: ["fix_plans", intentId] });
      queryClient.invalidateQueries({ queryKey: ["intents"] });
      queryClient.invalidateQueries({ queryKey: ["timeline_events"] });
    },
  });
}

export function useCompleteRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      runId,
      fixPlanId,
      intentId,
      passed,
      resultSummary,
    }: {
      runId: string;
      fixPlanId: string;
      intentId: string;
      passed: boolean;
      resultSummary: Record<string, any>;
    }) => {
      const status: RunStatus = passed ? "Passed" : "Failed";

      const { data, error } = await supabase
        .from("runs")
        .update({
          status,
          end_at: new Date().toISOString(),
          result_summary: resultSummary,
        })
        .eq("id", runId)
        .select()
        .single();

      if (error) throw error;

      // Create timeline event
      const eventType: TimelineEventType = passed ? "SimulationPassed" : "SimulationFailed";
      await supabase.from("timeline_events").insert({
        intent_id: intentId,
        event_type: eventType,
        actor: "System",
        details: { confidence: resultSummary.confidence },
      });

      return data;
    },
    onSuccess: (_, { fixPlanId, intentId }) => {
      queryClient.invalidateQueries({ queryKey: ["runs", fixPlanId] });
      queryClient.invalidateQueries({ queryKey: ["runs_for_intent", intentId] });
      queryClient.invalidateQueries({ queryKey: ["timeline_events"] });
    },
  });
}
