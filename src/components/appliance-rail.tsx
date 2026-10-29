import { Fan, Lightbulb, Speaker } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { APPLIANCES, type ApplianceId } from "@/lib/gestures";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const ICONS = {
  light: Lightbulb,
  fan: Fan,
  aux: Speaker,
} as const;

export function ApplianceRail() {
  const light = useAppStore((s) => s.light);
  const fan = useAppStore((s) => s.fan);
  const aux = useAppStore((s) => s.aux);
  const setAppliance = useAppStore((s) => s.setAppliance);
  const states: Record<ApplianceId, boolean> = { light, fan, aux };

  return (
    <section className="flex min-w-0 flex-col rounded-xl border border-border bg-surface p-4 shadow-panel">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">Relays</p>
      <h2 className="mb-3 text-sm font-medium text-fg">Living · bedroom · speaker</h2>
      <ul className="grid grid-cols-3 gap-2">
        {(Object.keys(APPLIANCES) as ApplianceId[]).map((id) => {
          const a = APPLIANCES[id];
          const on = states[id];
          const Icon = ICONS[id];
          return (
            <li key={id} className="min-w-0">
              <article
                className={cn(
                  "flex h-full min-w-0 flex-col items-center justify-center gap-2 rounded-md border px-2 py-2 text-center transition-colors duration-200",
                  on ? "border-sage/40 bg-sage/10" : "border-border bg-surface-2",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-md",
                    on ? "bg-sage/15 text-sage" : "bg-bg text-muted",
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-fg">{a.name.replace(" Appliance", "")}</p>
                  <p className="font-mono text-[11px] text-muted tabular-nums">
                    {a.pin} · {on ? "ON" : "OFF"}
                  </p>
                </div>
                <Switch checked={on} onCheckedChange={(v) => setAppliance(id, v, "manual")} aria-label={a.name} />
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
