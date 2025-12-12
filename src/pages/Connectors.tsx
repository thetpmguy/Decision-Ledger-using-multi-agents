import { StatusBadge } from "@/components/ui/status-badge";
import { useConnectors } from "@/hooks/useConnectors";
import {
  Activity,
  Flag,
  BarChart2,
  Github,
  Bell,
  Database,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const getConnectorIcon = (icon: string | null) => {
  switch (icon) {
    case "activity":
      return Activity;
    case "flag":
      return Flag;
    case "bar-chart-2":
      return BarChart2;
    case "github":
      return Github;
    case "bell":
      return Bell;
    case "database":
    default:
      return Database;
  }
};

export default function Connectors() {
  const { data: connectors, isLoading } = useConnectors();

  if (isLoading) {
    return <div className="text-muted-foreground">Loading connectors...</div>;
  }

  const connected = connectors?.filter((c) => c.status === "Connected") || [];
  const disconnected = connectors?.filter((c) => c.status === "Disconnected") || [];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Connectors</h1>
        <p className="mt-1 text-muted-foreground">
          Integrations with your observability and deployment tools
        </p>
      </div>

      {/* Connected */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <h2 className="text-lg font-semibold">Connected</h2>
          <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-medium text-success">
            {connected.length}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {connected.map((connector) => {
            const Icon = getConnectorIcon(connector.icon);
            return (
              <div
                key={connector.id}
                className="card-gradient rounded-lg border border-success/30 p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                      <Icon className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold">{connector.name}</p>
                      <p className="text-sm text-muted-foreground">{connector.type}</p>
                    </div>
                  </div>
                  <StatusBadge variant="success">Connected</StatusBadge>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Auth: {connector.auth_mode}</p>
                  <div className="flex flex-wrap gap-1">
                    {(connector.scopes as string[]).map((scope, i) => (
                      <span
                        key={i}
                        className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disconnected */}
      {disconnected.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Available</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {disconnected.map((connector) => {
              const Icon = getConnectorIcon(connector.icon);
              return (
                <div
                  key={connector.id}
                  className="card-gradient rounded-lg border border-border p-5 opacity-60"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{connector.name}</p>
                        <p className="text-sm text-muted-foreground">{connector.type}</p>
                      </div>
                    </div>
                    <StatusBadge variant="muted">Not Connected</StatusBadge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Connect {connector.name} to enable {connector.type.toLowerCase()} features
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
