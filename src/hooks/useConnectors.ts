import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Connector } from "@/lib/types";

export function useConnectors() {
  return useQuery({
    queryKey: ["connectors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("connectors")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Connector[];
    },
  });
}
