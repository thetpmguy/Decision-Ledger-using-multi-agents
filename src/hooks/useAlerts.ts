import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Alert, AlertStatus } from "@/lib/types";

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("detected_at", { ascending: false });

      if (error) throw error;
      return data as Alert[];
    },
  });
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: ["alerts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Alert | null;
    },
    enabled: !!id,
  });
}

export function useUpdateAlertStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AlertStatus }) => {
      const { data, error } = await supabase
        .from("alerts")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}
