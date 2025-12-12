// Mock connector functions returning mock JSON data

export const observabilityConnector = {
  getMetricTimeseries: async (metric: string, window: string) => {
    const now = Date.now();
    const points = [];
    for (let i = 24; i >= 0; i--) {
      points.push({
        timestamp: new Date(now - i * 3600000).toISOString(),
        value: Math.random() * 10 + 90,
      });
    }
    return { metric, window, data: points };
  },

  getActiveAlerts: async () => {
    return {
      alerts: [
        { id: 'dd-1', title: 'High CPU usage on checkout-service', severity: 'warning' },
        { id: 'dd-2', title: 'Error rate spike in payment-gateway', severity: 'critical' },
      ],
    };
  },

  getReleaseAnnotations: async (window: string) => {
    return {
      releases: [
        { version: 'v2.3.0', timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), service: 'checkout-service' },
        { version: 'v1.8.2', timestamp: new Date(Date.now() - 36 * 3600000).toISOString(), service: 'payment-gateway' },
      ],
    };
  },
};

export const flagsConnector = {
  createFlag: async (name: string, variants: string[]) => {
    return {
      success: true,
      flag: { key: name, variants, enabled: false, targeting: [] },
    };
  },

  setRollout: async (flag: string, percent: number) => {
    return {
      success: true,
      flag,
      rolloutPercent: percent,
      updatedAt: new Date().toISOString(),
    };
  },

  rollbackFlag: async (flag: string) => {
    return {
      success: true,
      flag,
      previousState: { enabled: true, rollout: 100 },
      newState: { enabled: false, rollout: 0 },
    };
  },

  getExperimentResults: async (flag: string, window: string) => {
    return {
      flag,
      window,
      variants: {
        control: { users: 12500, conversion: 0.042 },
        treatment: { users: 12300, conversion: 0.048 },
      },
      statisticalSignificance: 0.94,
      winner: 'treatment',
    };
  },
};

export const analyticsConnector = {
  getFunnel: async (funnelId: string, window: string) => {
    return {
      funnelId,
      window,
      steps: [
        { name: 'Landing Page', users: 100000, rate: 1.0 },
        { name: 'Product View', users: 45000, rate: 0.45 },
        { name: 'Add to Cart', users: 18000, rate: 0.40 },
        { name: 'Checkout Start', users: 9000, rate: 0.50 },
        { name: 'Purchase', users: 3600, rate: 0.40 },
      ],
    };
  },

  getSegmentedMetric: async (metric: string, segments: string[], window: string) => {
    const results: Record<string, number> = {};
    segments.forEach((seg) => {
      results[seg] = Math.random() * 5 + 2;
    });
    return { metric, window, segments: results };
  },
};
