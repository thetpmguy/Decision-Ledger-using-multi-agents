# Intent App  
*A Decision Ledger for Product Managers*

---

## What This Project Is About

**Intent App** is a **decision ledger designed for product managers**.

It provides a structured way to capture:
- what signals were observed
- what intent was declared
- what decision was made
- and what outcome followed

when responding to live system and product data.

Instead of decisions living across dashboards, Slack messages, tickets, and memory, Intent App creates a **durable record of product judgment**.

This is especially important for products built on:
- feature flags
- platform services
- experimentation
- AI-enabled and adaptive systems

---

## The Core Problem

Product managers are accountable for outcomes, but are often **operationally dependent on engineers** to act on insights.

A common workflow today:
1. PM observes an issue in observability or feature flag tools  
2. PM suspects a cause or opportunity  
3. PM asks engineering to validate  
4. Engineering proposes options  
5. PM approves  
6. Engineering executes  

This leads to:
- slow decisions
- fragmented context
- undocumented reasoning
- blurred ownership of judgment
- reactive rather than deliberate action

Most critically, **the “why” behind decisions disappears**.

---

## What Intent App Solves

Intent App separates **decision-making** from **execution**, without removing engineering from the loop.

It enables product managers to:
- reason independently from live signals
- declare intent explicitly
- document tradeoffs and risk
- simulate outcomes before acting
- hand engineers a clear decision artifact

Engineers still execute.  
PMs own the judgment and direction.

---

## How It Works

### 1. Observe Signals
Product managers review live and historical data such as:
- error rates and latency
- feature flag health
- traffic shifts
- conversion metrics
- experiment performance

Intent App does not replace these tools — it consumes **context**, not raw data.
<img width="1468" height="703" alt="Screenshot 2025-12-30 at 1 40 02 PM" src="https://github.com/user-attachments/assets/36e2b3a2-8c15-45bb-8b6b-9b6b2856da33" />

---

### 2. Declare Product Intent
PMs declare intent in plain language.

Examples:
- Stabilize checkout latency before scaling traffic
- Limit blast radius while validating a new market
- Bias toward learning over revenue for this release
- Accept short-term risk to unlock long-term adoption

Intent becomes a first-class artifact.
<img width="1445" height="718" alt="Screenshot 2025-12-30 at 1 39 15 PM" src="https://github.com/user-attachments/assets/d82b78e6-06bb-4598-9d2a-97085d85b5b8" />

---

### 3. Attach Evidence
Each intent is linked to:
- metric snapshots
- dashboards
- alerts
- experiments
- contextual notes

This preserves decision context at the moment it was made.
<img width="1459" height="700" alt="Screenshot 2025-12-30 at 1 39 00 PM" src="https://github.com/user-attachments/assets/e65efc1a-8d4d-432c-9f3e-61f0d636704d" />

---

### 4. Simulate Before Acting

Before execution, Intent App allows PMs to **simulate possible outcomes**.

Simulation exists to:
- surface tradeoffs
- explore risk
- frame uncertainty
- support judgment

It is not designed to predict exact results.
<img width="1205" height="707" alt="Screenshot 2025-12-30 at 1 52 36 PM" src="https://github.com/user-attachments/assets/8aa7d584-7cbd-4e5d-b5f6-905871117d38" />

---

## How Simulation Works Without Company Data

Simulation in Intent App is **intent-first, not data-first**.

Company-specific data is optional — not required.

### Zero-Data Simulation
When no internal historical data exists, simulations rely on:
- declared intent
- decision type (rollout, rollback, limit, experiment)
- known system constraints
- common product and platform failure patterns

The system generates scenario-based outputs:
- best-case
- expected-case
- failure-case

These describe *directional impact*, not precise metrics.

---

### Heuristic & Domain Reasoning

Early simulations use:
- industry rollout heuristics
- known system behaviors
- coupling and blast-radius logic
- PM-defined tolerances

This is structured reasoning, not forecasting.

---

### Explicit Uncertainty

The system never hides uncertainty.

When data is missing:
- uncertainty is surfaced explicitly
- ranges are used instead of point estimates
- confidence levels are shown

---

### Learning Over Time

Simulation improves as the ledger grows:

- Zero data: intent-driven reasoning  
- Low data: pattern matching across past decisions  
- Rich data: company-specific outcome correlations  

---

## How AI and Agents Are Used

AI and agents **do not make decisions**.

They exist to:
- structure human judgment
- reason about uncertainty
- support simulation
- preserve decision intelligence

AI sits **between signals and decisions**, not at execution.

Signals → AI reasoning → Human decision → Engineering execution

---

### AI for Intent Structuring

AI translates free-form PM intent into a structured decision model:
- decision type
- domain
- scope
- risk posture
- reversibility
- success signals

This makes judgment explicit and shareable.

---

### AI for Signal Interpretation

AI contextualizes metrics based on declared intent:
- identifies which signals matter
- suppresses irrelevant noise
- frames metrics relative to goals

---

### AI-Driven Simulation

AI generates scenario reasoning:
- plausible outcomes
- failure modes
- risk concentration
- post-decision signals to monitor

Outputs emphasize ranges, tradeoffs, and uncertainty.

---

### Agents as Specialized Reasoning Roles

Internally, the system may use multiple agents:
- Intent interpretation agent
- Risk reasoning agent
- Simulation agent
- Decision memory agent

Agents collaborate to support **one human decision**.

---

### AI for Decision Memory

Over time, AI analyzes the decision ledger to:
- surface recurring tradeoffs
- detect decision patterns
- highlight biases
- improve future simulations
- support onboarding

---

### What AI Does Not Do

AI does not:
- deploy code
- flip feature flags
- override decisions
- act autonomously

Human judgment remains central.

---

## Record the Decision

After simulation, PMs record:
- the chosen action
- scope and constraints
- acceptable risk
- reversibility
- expected outcome

This becomes a decision contract.
<img width="1206" height="473" alt="Screenshot 2025-12-30 at 1 52 45 PM" src="https://github.com/user-attachments/assets/ff2d1b49-b7da-4a31-87f1-61dfb6d5a9e5" />

---

## Hand Off to Engineering

Engineers receive:
- the decision
- intent and rationale
- supporting evidence
- simulation context
- success criteria

This reduces ambiguity and rework.

---

## Track Outcomes & Learning

As metrics evolve:
- outcomes are compared to expectations
- deviations are recorded
- learnings are captured

Each decision improves the system.

---

## Core Concepts

- Intent: why action is considered  
- Signal: evidence informing the decision  
- Simulation: exploration of outcomes  
- Decision: committed action  
- Outcome: what actually happened  
- Learning: what improves future judgment  

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
