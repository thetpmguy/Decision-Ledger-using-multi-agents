-- Enums for the platform
CREATE TYPE public.alert_type AS ENUM ('MetricDrop', 'MetricSpike', 'FunnelStepRegression', 'LatencyRegression', 'ErrorSpike');
CREATE TYPE public.alert_severity AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE public.alert_status AS ENUM ('Open', 'Acknowledged', 'Resolved');
CREATE TYPE public.intent_status AS ENUM ('Draft', 'Proposed', 'Simulating', 'ReadyToExecute', 'Executing', 'RolledBack', 'Completed', 'Paused');
CREATE TYPE public.authority_mode AS ENUM ('RecommendOnly', 'RecommendThenExecute', 'AutoExecute');
CREATE TYPE public.fix_plan_type AS ENUM ('RollbackFlag', 'ConfigTweak', 'Experiment', 'RollbackRelease', 'TrafficShift');
CREATE TYPE public.fix_plan_status AS ENUM ('Proposed', 'Simulating', 'Approved', 'Executing', 'Rejected', 'Completed', 'RolledBack');
CREATE TYPE public.run_mode AS ENUM ('Simulation', 'Shadow', 'Canary', 'ABTest', 'Rollout');
CREATE TYPE public.run_status AS ENUM ('Queued', 'Running', 'Passed', 'Failed', 'RolledBack');
CREATE TYPE public.timeline_event_type AS ENUM ('IntentCreated', 'DiagnosisGenerated', 'PlanProposed', 'SimulationApproved', 'SimulationPassed', 'SimulationFailed', 'ExecuteApproved', 'RolloutStepChanged', 'GuardrailBreached', 'AutoRollback', 'Completed');
CREATE TYPE public.connector_type AS ENUM ('Observability', 'Flags', 'Analytics', 'Deployments');
CREATE TYPE public.connector_status AS ENUM ('Connected', 'Disconnected');

-- Profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'PM',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.alert_type NOT NULL,
  metric_name TEXT NOT NULL,
  severity public.alert_severity NOT NULL DEFAULT 'Medium',
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  baseline_window TEXT DEFAULT '14d',
  current_value NUMERIC NOT NULL,
  baseline_value NUMERIC NOT NULL,
  delta NUMERIC NOT NULL,
  suspected_change TEXT,
  status public.alert_status DEFAULT 'Open',
  links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Intents table
CREATE TABLE public.intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  goal_metric TEXT NOT NULL,
  goal_target_delta NUMERIC NOT NULL,
  time_horizon_days INTEGER DEFAULT 14,
  authority_mode public.authority_mode DEFAULT 'RecommendOnly',
  blast_radius_plan JSONB DEFAULT '[1, 5, 10, 25, 50, 100]'::jsonb,
  constraints JSONB DEFAULT '{}'::jsonb,
  status public.intent_status DEFAULT 'Draft',
  owner_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  source_alert_id UUID REFERENCES public.alerts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Diagnoses table
CREATE TABLE public.diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id UUID REFERENCES public.intents(id) ON DELETE CASCADE NOT NULL,
  root_cause_hypotheses JSONB DEFAULT '[]'::jsonb,
  segments_impacted JSONB DEFAULT '[]'::jsonb,
  recommended_next_questions JSONB DEFAULT '[]'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fix Plans table
CREATE TABLE public.fix_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id UUID REFERENCES public.intents(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type public.fix_plan_type NOT NULL,
  expected_impact JSONB DEFAULT '{}'::jsonb,
  risk_score INTEGER DEFAULT 50 CHECK (risk_score >= 0 AND risk_score <= 100),
  cost_score INTEGER DEFAULT 50 CHECK (cost_score >= 0 AND cost_score <= 100),
  guardrails JSONB DEFAULT '{}'::jsonb,
  execution_steps JSONB DEFAULT '[]'::jsonb,
  rollback_steps JSONB DEFAULT '[]'::jsonb,
  status public.fix_plan_status DEFAULT 'Proposed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Runs table
CREATE TABLE public.runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fix_plan_id UUID REFERENCES public.fix_plans(id) ON DELETE CASCADE NOT NULL,
  mode public.run_mode NOT NULL,
  traffic_percent INTEGER DEFAULT 1,
  start_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_at TIMESTAMP WITH TIME ZONE,
  result_summary JSONB DEFAULT '{}'::jsonb,
  status public.run_status DEFAULT 'Queued',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Timeline Events table
CREATE TABLE public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id UUID REFERENCES public.intents(id) ON DELETE CASCADE NOT NULL,
  event_type public.timeline_event_type NOT NULL,
  actor TEXT DEFAULT 'System',
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Connectors table
CREATE TABLE public.connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type public.connector_type NOT NULL,
  status public.connector_status DEFAULT 'Disconnected',
  auth_mode TEXT DEFAULT 'API Key',
  scopes JSONB DEFAULT '[]'::jsonb,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Playbooks table
CREATE TABLE public.playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  matching_conditions JSONB DEFAULT '{}'::jsonb,
  candidate_fix_plans JSONB DEFAULT '[]'::jsonb,
  default_guardrails JSONB DEFAULT '{}'::jsonb,
  risk_scoring_rules JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fix_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;

-- Public read policies for demo (can be restricted later)
CREATE POLICY "Allow public read on alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Allow public read on intents" ON public.intents FOR SELECT USING (true);
CREATE POLICY "Allow public read on diagnoses" ON public.diagnoses FOR SELECT USING (true);
CREATE POLICY "Allow public read on fix_plans" ON public.fix_plans FOR SELECT USING (true);
CREATE POLICY "Allow public read on runs" ON public.runs FOR SELECT USING (true);
CREATE POLICY "Allow public read on timeline_events" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Allow public read on connectors" ON public.connectors FOR SELECT USING (true);
CREATE POLICY "Allow public read on playbooks" ON public.playbooks FOR SELECT USING (true);
CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);

-- Public insert/update policies for demo
CREATE POLICY "Allow public insert on intents" ON public.intents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on intents" ON public.intents FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on diagnoses" ON public.diagnoses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on fix_plans" ON public.fix_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on fix_plans" ON public.fix_plans FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on runs" ON public.runs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on runs" ON public.runs FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on timeline_events" ON public.timeline_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on alerts" ON public.alerts FOR UPDATE USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_intents_updated_at BEFORE UPDATE ON public.intents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fix_plans_updated_at BEFORE UPDATE ON public.fix_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();