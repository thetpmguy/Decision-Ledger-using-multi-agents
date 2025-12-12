export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          baseline_value: number
          baseline_window: string | null
          created_at: string | null
          current_value: number
          delta: number
          detected_at: string | null
          id: string
          links: Json | null
          metric_name: string
          severity: Database["public"]["Enums"]["alert_severity"]
          status: Database["public"]["Enums"]["alert_status"] | null
          suspected_change: string | null
          type: Database["public"]["Enums"]["alert_type"]
          updated_at: string | null
        }
        Insert: {
          baseline_value: number
          baseline_window?: string | null
          created_at?: string | null
          current_value: number
          delta: number
          detected_at?: string | null
          id?: string
          links?: Json | null
          metric_name: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"] | null
          suspected_change?: string | null
          type: Database["public"]["Enums"]["alert_type"]
          updated_at?: string | null
        }
        Update: {
          baseline_value?: number
          baseline_window?: string | null
          created_at?: string | null
          current_value?: number
          delta?: number
          detected_at?: string | null
          id?: string
          links?: Json | null
          metric_name?: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"] | null
          suspected_change?: string | null
          type?: Database["public"]["Enums"]["alert_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      connectors: {
        Row: {
          auth_mode: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          scopes: Json | null
          status: Database["public"]["Enums"]["connector_status"] | null
          type: Database["public"]["Enums"]["connector_type"]
        }
        Insert: {
          auth_mode?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          scopes?: Json | null
          status?: Database["public"]["Enums"]["connector_status"] | null
          type: Database["public"]["Enums"]["connector_type"]
        }
        Update: {
          auth_mode?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          scopes?: Json | null
          status?: Database["public"]["Enums"]["connector_status"] | null
          type?: Database["public"]["Enums"]["connector_type"]
        }
        Relationships: []
      }
      diagnoses: {
        Row: {
          generated_at: string | null
          id: string
          intent_id: string
          recommended_next_questions: Json | null
          root_cause_hypotheses: Json | null
          segments_impacted: Json | null
        }
        Insert: {
          generated_at?: string | null
          id?: string
          intent_id: string
          recommended_next_questions?: Json | null
          root_cause_hypotheses?: Json | null
          segments_impacted?: Json | null
        }
        Update: {
          generated_at?: string | null
          id?: string
          intent_id?: string
          recommended_next_questions?: Json | null
          root_cause_hypotheses?: Json | null
          segments_impacted?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnoses_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["id"]
          },
        ]
      }
      fix_plans: {
        Row: {
          cost_score: number | null
          created_at: string | null
          execution_steps: Json | null
          expected_impact: Json | null
          guardrails: Json | null
          id: string
          intent_id: string
          name: string
          risk_score: number | null
          rollback_steps: Json | null
          status: Database["public"]["Enums"]["fix_plan_status"] | null
          type: Database["public"]["Enums"]["fix_plan_type"]
          updated_at: string | null
        }
        Insert: {
          cost_score?: number | null
          created_at?: string | null
          execution_steps?: Json | null
          expected_impact?: Json | null
          guardrails?: Json | null
          id?: string
          intent_id: string
          name: string
          risk_score?: number | null
          rollback_steps?: Json | null
          status?: Database["public"]["Enums"]["fix_plan_status"] | null
          type: Database["public"]["Enums"]["fix_plan_type"]
          updated_at?: string | null
        }
        Update: {
          cost_score?: number | null
          created_at?: string | null
          execution_steps?: Json | null
          expected_impact?: Json | null
          guardrails?: Json | null
          id?: string
          intent_id?: string
          name?: string
          risk_score?: number | null
          rollback_steps?: Json | null
          status?: Database["public"]["Enums"]["fix_plan_status"] | null
          type?: Database["public"]["Enums"]["fix_plan_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fix_plans_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["id"]
          },
        ]
      }
      intents: {
        Row: {
          authority_mode: Database["public"]["Enums"]["authority_mode"] | null
          blast_radius_plan: Json | null
          constraints: Json | null
          created_at: string | null
          goal_metric: string
          goal_target_delta: number
          id: string
          owner_user_id: string | null
          source_alert_id: string | null
          status: Database["public"]["Enums"]["intent_status"] | null
          time_horizon_days: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          authority_mode?: Database["public"]["Enums"]["authority_mode"] | null
          blast_radius_plan?: Json | null
          constraints?: Json | null
          created_at?: string | null
          goal_metric: string
          goal_target_delta: number
          id?: string
          owner_user_id?: string | null
          source_alert_id?: string | null
          status?: Database["public"]["Enums"]["intent_status"] | null
          time_horizon_days?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          authority_mode?: Database["public"]["Enums"]["authority_mode"] | null
          blast_radius_plan?: Json | null
          constraints?: Json | null
          created_at?: string | null
          goal_metric?: string
          goal_target_delta?: number
          id?: string
          owner_user_id?: string | null
          source_alert_id?: string | null
          status?: Database["public"]["Enums"]["intent_status"] | null
          time_horizon_days?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intents_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intents_source_alert_id_fkey"
            columns: ["source_alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      playbooks: {
        Row: {
          candidate_fix_plans: Json | null
          created_at: string | null
          default_guardrails: Json | null
          description: string | null
          id: string
          matching_conditions: Json | null
          name: string
          risk_scoring_rules: Json | null
        }
        Insert: {
          candidate_fix_plans?: Json | null
          created_at?: string | null
          default_guardrails?: Json | null
          description?: string | null
          id?: string
          matching_conditions?: Json | null
          name: string
          risk_scoring_rules?: Json | null
        }
        Update: {
          candidate_fix_plans?: Json | null
          created_at?: string | null
          default_guardrails?: Json | null
          description?: string | null
          id?: string
          matching_conditions?: Json | null
          name?: string
          risk_scoring_rules?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      runs: {
        Row: {
          created_at: string | null
          end_at: string | null
          fix_plan_id: string
          id: string
          mode: Database["public"]["Enums"]["run_mode"]
          result_summary: Json | null
          start_at: string | null
          status: Database["public"]["Enums"]["run_status"] | null
          traffic_percent: number | null
        }
        Insert: {
          created_at?: string | null
          end_at?: string | null
          fix_plan_id: string
          id?: string
          mode: Database["public"]["Enums"]["run_mode"]
          result_summary?: Json | null
          start_at?: string | null
          status?: Database["public"]["Enums"]["run_status"] | null
          traffic_percent?: number | null
        }
        Update: {
          created_at?: string | null
          end_at?: string | null
          fix_plan_id?: string
          id?: string
          mode?: Database["public"]["Enums"]["run_mode"]
          result_summary?: Json | null
          start_at?: string | null
          status?: Database["public"]["Enums"]["run_status"] | null
          traffic_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "runs_fix_plan_id_fkey"
            columns: ["fix_plan_id"]
            isOneToOne: false
            referencedRelation: "fix_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          actor: string | null
          created_at: string | null
          details: Json | null
          event_type: Database["public"]["Enums"]["timeline_event_type"]
          id: string
          intent_id: string
        }
        Insert: {
          actor?: string | null
          created_at?: string | null
          details?: Json | null
          event_type: Database["public"]["Enums"]["timeline_event_type"]
          id?: string
          intent_id: string
        }
        Update: {
          actor?: string | null
          created_at?: string | null
          details?: Json | null
          event_type?: Database["public"]["Enums"]["timeline_event_type"]
          id?: string
          intent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_severity: "Low" | "Medium" | "High" | "Critical"
      alert_status: "Open" | "Acknowledged" | "Resolved"
      alert_type:
        | "MetricDrop"
        | "MetricSpike"
        | "FunnelStepRegression"
        | "LatencyRegression"
        | "ErrorSpike"
      authority_mode: "RecommendOnly" | "RecommendThenExecute" | "AutoExecute"
      connector_status: "Connected" | "Disconnected"
      connector_type: "Observability" | "Flags" | "Analytics" | "Deployments"
      fix_plan_status:
        | "Proposed"
        | "Simulating"
        | "Approved"
        | "Executing"
        | "Rejected"
        | "Completed"
        | "RolledBack"
      fix_plan_type:
        | "RollbackFlag"
        | "ConfigTweak"
        | "Experiment"
        | "RollbackRelease"
        | "TrafficShift"
      intent_status:
        | "Draft"
        | "Proposed"
        | "Simulating"
        | "ReadyToExecute"
        | "Executing"
        | "RolledBack"
        | "Completed"
        | "Paused"
      run_mode: "Simulation" | "Shadow" | "Canary" | "ABTest" | "Rollout"
      run_status: "Queued" | "Running" | "Passed" | "Failed" | "RolledBack"
      timeline_event_type:
        | "IntentCreated"
        | "DiagnosisGenerated"
        | "PlanProposed"
        | "SimulationApproved"
        | "SimulationPassed"
        | "SimulationFailed"
        | "ExecuteApproved"
        | "RolloutStepChanged"
        | "GuardrailBreached"
        | "AutoRollback"
        | "Completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["Low", "Medium", "High", "Critical"],
      alert_status: ["Open", "Acknowledged", "Resolved"],
      alert_type: [
        "MetricDrop",
        "MetricSpike",
        "FunnelStepRegression",
        "LatencyRegression",
        "ErrorSpike",
      ],
      authority_mode: ["RecommendOnly", "RecommendThenExecute", "AutoExecute"],
      connector_status: ["Connected", "Disconnected"],
      connector_type: ["Observability", "Flags", "Analytics", "Deployments"],
      fix_plan_status: [
        "Proposed",
        "Simulating",
        "Approved",
        "Executing",
        "Rejected",
        "Completed",
        "RolledBack",
      ],
      fix_plan_type: [
        "RollbackFlag",
        "ConfigTweak",
        "Experiment",
        "RollbackRelease",
        "TrafficShift",
      ],
      intent_status: [
        "Draft",
        "Proposed",
        "Simulating",
        "ReadyToExecute",
        "Executing",
        "RolledBack",
        "Completed",
        "Paused",
      ],
      run_mode: ["Simulation", "Shadow", "Canary", "ABTest", "Rollout"],
      run_status: ["Queued", "Running", "Passed", "Failed", "RolledBack"],
      timeline_event_type: [
        "IntentCreated",
        "DiagnosisGenerated",
        "PlanProposed",
        "SimulationApproved",
        "SimulationPassed",
        "SimulationFailed",
        "ExecuteApproved",
        "RolloutStepChanged",
        "GuardrailBreached",
        "AutoRollback",
        "Completed",
      ],
    },
  },
} as const
