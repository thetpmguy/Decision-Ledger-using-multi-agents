# Observeo

An AI-powered observability and remediation platform that monitors product metrics, diagnoses issues, and proposes automated fixes.

## Features

- **Alerts Dashboard** - Monitor metric drops, spikes, and anomalies
- **Intent Management** - Create goals with constraints and authority levels
- **AI Diagnosis** - Automated root cause analysis
- **Fix Plans** - Proposed remediation with risk scoring
- **Simulation & Rollout** - Safe deployment with guardrails
- **Timeline** - Full audit trail of all actions

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **State Management**: TanStack Query

---

## Fork & Deploy Instructions

### 1. Fork the Repository

1. Click the **Fork** button on this GitHub repository
2. Clone your forked repo locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/observeo.git
   cd observeo
   ```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project's **URL** and **anon key** from Settings → API

### 3. Set Up the Database

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Create enums
CREATE TYPE alert_type AS ENUM ('MetricDrop', 'MetricSpike', 'FunnelStepRegression', 'LatencyRegression', 'ErrorSpike');
CREATE TYPE alert_severity AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE alert_status AS ENUM ('Open', 'Acknowledged', 'Resolved');
CREATE TYPE intent_status AS ENUM ('Draft', 'Proposed', 'Simulating', 'ReadyToExecute', 'Executing', 'RolledBack', 'Completed', 'Paused');
CREATE TYPE authority_mode AS ENUM ('RecommendOnly', 'RecommendThenExecute', 'AutoExecute');
CREATE TYPE fix_plan_type AS ENUM ('RollbackFlag', 'ConfigTweak', 'Experiment', 'RollbackRelease', 'TrafficShift');
CREATE TYPE fix_plan_status AS ENUM ('Proposed', 'Simulating', 'Approved', 'Executing', 'Rejected', 'Completed', 'RolledBack');
CREATE TYPE run_mode AS ENUM ('Simulation', 'Shadow', 'Canary', 'ABTest', 'Rollout');
CREATE TYPE run_status AS ENUM ('Queued', 'Running', 'Passed', 'Failed', 'RolledBack');
CREATE TYPE timeline_event_type AS ENUM ('IntentCreated', 'DiagnosisGenerated', 'PlanProposed', 'SimulationApproved', 'SimulationPassed', 'SimulationFailed', 'ExecuteApproved', 'RolloutStepChanged', 'GuardrailBreached', 'AutoRollback', 'Completed');
CREATE TYPE connector_type AS ENUM ('Observability', 'Flags', 'Analytics', 'Deployments');
CREATE TYPE connector_status AS ENUM ('Connected', 'Disconnected');

-- Alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type alert_type NOT NULL,
  metric_name TEXT NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'Medium',
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  baseline_window TEXT NOT NULL DEFAULT '7d',
  current_value NUMERIC NOT NULL,
  baseline_value NUMERIC NOT NULL,
  delta NUMERIC NOT NULL,
  suspected_change TEXT,
  status alert_status NOT NULL DEFAULT 'Open',
  links JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Intents table
CREATE TABLE public.intents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  goal_metric TEXT NOT NULL,
  goal_target_delta NUMERIC NOT NULL DEFAULT 0,
  time_horizon_days INTEGER NOT NULL DEFAULT 7,
  authority_mode authority_mode NOT NULL DEFAULT 'RecommendOnly',
  blast_radius_plan INTEGER[] DEFAULT '{10,25,50,100}',
  constraints JSONB DEFAULT '{}',
  status intent_status NOT NULL DEFAULT 'Draft',
  owner_user_id UUID,
  source_alert_id UUID REFERENCES public.alerts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Diagnoses table
CREATE TABLE public.diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intent_id UUID NOT NULL REFERENCES public.intents(id) ON DELETE CASCADE,
  root_cause_hypotheses JSONB NOT NULL DEFAULT '[]',
  segments_impacted TEXT[] DEFAULT '{}',
  recommended_next_questions TEXT[] DEFAULT '{}',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fix Plans table
CREATE TABLE public.fix_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intent_id UUID NOT NULL REFERENCES public.intents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type fix_plan_type NOT NULL,
  expected_impact JSONB DEFAULT '{}',
  risk_score NUMERIC NOT NULL DEFAULT 0,
  cost_score NUMERIC NOT NULL DEFAULT 0,
  guardrails JSONB DEFAULT '{}',
  execution_steps TEXT[] DEFAULT '{}',
  rollback_steps TEXT[] DEFAULT '{}',
  status fix_plan_status NOT NULL DEFAULT 'Proposed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Runs table
CREATE TABLE public.runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fix_plan_id UUID NOT NULL REFERENCES public.fix_plans(id) ON DELETE CASCADE,
  mode run_mode NOT NULL,
  traffic_percent INTEGER NOT NULL DEFAULT 0,
  start_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_at TIMESTAMPTZ,
  result_summary JSONB DEFAULT '{}',
  status run_status NOT NULL DEFAULT 'Queued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Timeline Events table
CREATE TABLE public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intent_id UUID NOT NULL REFERENCES public.intents(id) ON DELETE CASCADE,
  event_type timeline_event_type NOT NULL,
  actor TEXT NOT NULL DEFAULT 'system',
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Connectors table
CREATE TABLE public.connectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type connector_type NOT NULL,
  status connector_status NOT NULL DEFAULT 'Disconnected',
  auth_mode TEXT NOT NULL DEFAULT 'api_key',
  scopes TEXT[] DEFAULT '{}',
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Playbooks table
CREATE TABLE public.playbooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  matching_conditions JSONB DEFAULT '{}',
  candidate_fix_plans JSONB DEFAULT '[]',
  default_guardrails JSONB DEFAULT '{}',
  risk_scoring_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles table (for user data)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fix_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create public read policies (adjust based on your auth needs)
CREATE POLICY "Allow public read on alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Allow public read on intents" ON public.intents FOR SELECT USING (true);
CREATE POLICY "Allow public read on diagnoses" ON public.diagnoses FOR SELECT USING (true);
CREATE POLICY "Allow public read on fix_plans" ON public.fix_plans FOR SELECT USING (true);
CREATE POLICY "Allow public read on runs" ON public.runs FOR SELECT USING (true);
CREATE POLICY "Allow public read on timeline_events" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Allow public read on connectors" ON public.connectors FOR SELECT USING (true);
CREATE POLICY "Allow public read on playbooks" ON public.playbooks FOR SELECT USING (true);

-- Create insert policies
CREATE POLICY "Allow public insert on alerts" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on intents" ON public.intents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on diagnoses" ON public.diagnoses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on fix_plans" ON public.fix_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on runs" ON public.runs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on timeline_events" ON public.timeline_events FOR INSERT WITH CHECK (true);

-- Create update policies
CREATE POLICY "Allow public update on alerts" ON public.alerts FOR UPDATE USING (true);
CREATE POLICY "Allow public update on intents" ON public.intents FOR UPDATE USING (true);
CREATE POLICY "Allow public update on fix_plans" ON public.fix_plans FOR UPDATE USING (true);
CREATE POLICY "Allow public update on runs" ON public.runs FOR UPDATE USING (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_intents_updated_at BEFORE UPDATE ON public.intents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fix_plans_updated_at BEFORE UPDATE ON public.fix_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

### 5. Install Dependencies & Run Locally

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Deploy Options

#### Option A: Deploy on Lovable
1. Import your GitHub repo into [Lovable](https://lovable.dev)
2. Connect to Supabase via Lovable Cloud
3. Click Publish

#### Option B: Deploy on Vercel
1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Add environment variables in Vercel dashboard
3. Deploy

#### Option C: Deploy on Netlify
1. Connect your GitHub repo to [Netlify](https://netlify.com)
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

---

## Project Structure

```
src/
├── components/
│   ├── layout/       # App layout components
│   └── ui/           # shadcn/ui components
├── hooks/            # Custom React hooks for data fetching
├── integrations/     # Supabase client & types
├── lib/              # Utilities and type definitions
└── pages/            # Route components
```

---

## Philosophy

Metrics show what happened.  
Simulation explores what might happen.  
Intent explains why you chose.

**Observeo exists to make product judgment explicit, durable, and improvable.**

## License

MIT
