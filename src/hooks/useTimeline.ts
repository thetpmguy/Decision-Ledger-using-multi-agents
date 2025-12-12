import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TimelineEvent } from "@/lib/types";

export function useTimelineEvents(intentId: string) {
  return useQuery({
    queryKey: ["timeline_events", intentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("intent_id", intentId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TimelineEvent[];
    },
    enabled: !!intentId,
  });
}

export function useAllTimelineEvents() {
  return useQuery({
    queryKey: ["timeline_events", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*, intents!inner(title)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });
}
