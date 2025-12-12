import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Intent, IntentStatus, AuthorityMode } from "@/lib/types";

export function useIntents() {
  return useQuery({
    queryKey: ["intents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("intents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Intent[];
    },
  });
}

export function useIntent(id: string) {
  return useQuery({
    queryKey: ["intents", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("intents")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Intent | null;
    },
    enabled: !!id,
  });
}

export function useCreateIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intent: {
      title: string;
      goal_metric: string;
      goal_target_delta: number;
      time_horizon_days?: number;
      authority_mode?: AuthorityMode;
      blast_radius_plan?: number[];
      constraints?: Record<string, any>;
      source_alert_id?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("intents")
        .insert({
          ...intent,
          status: "Draft" as IntentStatus,
        })
        .select()
        .single();

      if (error) throw error;

      // Create timeline event
      await supabase.from("timeline_events").insert({
        intent_id: data.id,
        event_type: "IntentCreated",
        actor: "User",
        details: { source: intent.source_alert_id ? "Alert" : "Manual" },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intents"] });
      queryClient.invalidateQueries({ queryKey: ["timeline_events"] });
    },
  });
}

export function useUpdateIntentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: IntentStatus }) => {
      const { data, error } = await supabase
        .from("intents")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intents"] });
    },
  });
}
