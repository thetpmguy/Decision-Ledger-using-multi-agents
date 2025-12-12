import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Diagnosis } from "@/lib/types";

export function useDiagnosis(intentId: string) {
  return useQuery({
    queryKey: ["diagnoses", intentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diagnoses")
        .select("*")
        .eq("intent_id", intentId)
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Diagnosis | null;
    },
    enabled: !!intentId,
  });
}

export function useGenerateDiagnosis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intentId: string) => {
      // Mock AI diagnosis generation
      const mockDiagnosis = {
        intent_id: intentId,
        root_cause_hypotheses: [
          {
            hypothesis: "Recent code deployment introduced a regression",
            evidence: "Error rate increased 35% after v2.3 release",
            confidence: 0.82,
          },
          {
            hypothesis: "Feature flag configuration causing timeouts",
            evidence: "Timeout errors correlate with payment_retry flag rollout",
            confidence: 0.75,
          },
          {
            hypothesis: "Third-party service degradation",
            evidence: "Upstream API latency increased during same window",
            confidence: 0.48,
          },
        ],
        segments_impacted: ["Mobile users", "Chrome browser", "US East region"],
        recommended_next_questions: [
          "What changes were included in v2.3?",
          "Is the payment_retry flag using correct timeout values?",
          "Are other customers reporting issues with the payment provider?",
        ],
      };

      const { data, error } = await supabase
        .from("diagnoses")
        .insert(mockDiagnosis)
        .select()
        .single();

      if (error) throw error;

      // Update intent status
      await supabase
        .from("intents")
        .update({ status: "Proposed" })
        .eq("id", intentId);

      // Create timeline event
      await supabase.from("timeline_events").insert({
        intent_id: intentId,
        event_type: "DiagnosisGenerated",
        actor: "System",
        details: { hypotheses_count: mockDiagnosis.root_cause_hypotheses.length },
      });

      return data;
    },
    onSuccess: (_, intentId) => {
      queryClient.invalidateQueries({ queryKey: ["diagnoses", intentId] });
      queryClient.invalidateQueries({ queryKey: ["intents"] });
      queryClient.invalidateQueries({ queryKey: ["timeline_events"] });
    },
  });
}
