import { HAND_CONNECTIONS, type Landmark } from "@/lib/landmarks";
import { cn } from "@/lib/utils";

export function HandSkeleton({
  landmarks,
  className,
  stroke = "currentColor",
  joint = "var(--color-lamp)",
  numbered = false,
}: {
  landmarks: Landmark[];
  className?: string;
  stroke?: string;
  joint?: string;
  numbered?: boolean;
}) {
  if (!landmarks || landmarks.length < 21) return null;
  return (
    <svg viewBox="0 0 1 1" className={cn("overflow-visible", className)} aria-hidden>
      {HAND_CONNECTIONS.map(([a, b]) => {
        const p = landmarks[a];
        const q = landmarks[b];
        if (!p || !q) return null;
        return (
          <line
            key={`${a}-${b}`}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            stroke={stroke}
            strokeWidth={0.018}
            strokeLinecap="round"
          />
        );
      })}
      {landmarks.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={i === 0 ? 0.028 : i === 4 || i === 8 || i === 12 || i === 16 || i === 20 ? 0.022 : 0.016}
            fill={i === 0 ? "var(--color-fg)" : joint}
          />
          {numbered && (
            <text
              x={p.x}
              y={p.y - 0.03}
              textAnchor="middle"
              fill="var(--color-fg)"
              fontSize="0.045"
              fontFamily="var(--font-mono)"
            >
              {i}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
