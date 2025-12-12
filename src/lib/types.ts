// Database types for Observeo

export type AlertType = 'MetricDrop' | 'MetricSpike' | 'FunnelStepRegression' | 'LatencyRegression' | 'ErrorSpike';
export type AlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AlertStatus = 'Open' | 'Acknowledged' | 'Resolved';

export type IntentStatus = 'Draft' | 'Proposed' | 'Simulating' | 'ReadyToExecute' | 'Executing' | 'RolledBack' | 'Completed' | 'Paused';
export type AuthorityMode = 'RecommendOnly' | 'RecommendThenExecute' | 'AutoExecute';

export type FixPlanType = 'RollbackFlag' | 'ConfigTweak' | 'Experiment' | 'RollbackRelease' | 'TrafficShift';
export type FixPlanStatus = 'Proposed' | 'Simulating' | 'Approved' | 'Executing' | 'Rejected' | 'Completed' | 'RolledBack';

export type RunMode = 'Simulation' | 'Shadow' | 'Canary' | 'ABTest' | 'Rollout';
export type RunStatus = 'Queued' | 'Running' | 'Passed' | 'Failed' | 'RolledBack';

export type TimelineEventType = 
  | 'IntentCreated' 
  | 'DiagnosisGenerated' 
  | 'PlanProposed' 
  | 'SimulationApproved' 
  | 'SimulationPassed' 
  | 'SimulationFailed'
  | 'ExecuteApproved' 
  | 'RolloutStepChanged' 
  | 'GuardrailBreached' 
  | 'AutoRollback' 
  | 'Completed';

export type ConnectorType = 'Observability' | 'Flags' | 'Analytics' | 'Deployments';
export type ConnectorStatus = 'Connected' | 'Disconnected';

export interface Alert {
  id: string;
  type: AlertType;
  metric_name: string;
  severity: AlertSeverity;
  detected_at: string;
  baseline_window: string;
  current_value: number;
  baseline_value: number;
  delta: number;
  suspected_change: string | null;
  status: AlertStatus;
  links: any[];
  created_at: string;
  updated_at: string;
}

export interface Intent {
  id: string;
  title: string;
  goal_metric: string;
  goal_target_delta: number;
  time_horizon_days: number;
  authority_mode: AuthorityMode;
  blast_radius_plan: number[];
  constraints: Record<string, any>;
  status: IntentStatus;
  owner_user_id: string | null;
  source_alert_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Diagnosis {
  id: string;
  intent_id: string;
  root_cause_hypotheses: Array<{
    hypothesis: string;
    evidence: string;
    confidence: number;
  }>;
  segments_impacted: string[];
  recommended_next_questions: string[];
  generated_at: string;
}

export interface FixPlan {
  id: string;
  intent_id: string;
  name: string;
  type: FixPlanType;
  expected_impact: Record<string, any>;
  risk_score: number;
  cost_score: number;
  guardrails: Record<string, any>;
  execution_steps: string[];
  rollback_steps: string[];
  status: FixPlanStatus;
  created_at: string;
  updated_at: string;
}

export interface Run {
  id: string;
  fix_plan_id: string;
  mode: RunMode;
  traffic_percent: number;
  start_at: string;
  end_at: string | null;
  result_summary: Record<string, any>;
  status: RunStatus;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  intent_id: string;
  event_type: TimelineEventType;
  actor: string;
  details: Record<string, any>;
  created_at: string;
}

export interface Connector {
  id: string;
  name: string;
  type: ConnectorType;
  status: ConnectorStatus;
  auth_mode: string;
  scopes: string[];
  icon: string | null;
  created_at: string;
}

export interface Playbook {
  id: string;
  name: string;
  description: string | null;
  matching_conditions: Record<string, any>;
  candidate_fix_plans: any[];
  default_guardrails: Record<string, any>;
  risk_scoring_rules: Record<string, any>;
  created_at: string;
}
