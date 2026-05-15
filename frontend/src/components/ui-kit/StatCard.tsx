import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  delta: number;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "info";
  spark?: number[];
}

const accents = {
  primary: {
    bg: "from-primary/40 to-primary/0 text-primary-glow",
    stroke: "#ff4fcb",
  },
  success: {
    bg: "from-success/40 to-success/0 text-success",
    stroke: "#34d399",
  },
  warning: {
    bg: "from-warning/40 to-warning/0 text-warning",
    stroke: "#fbbf24",
  },
  info: { bg: "from-info/40 to-info/0 text-info", stroke: "#60a5fa" },
};

function Sparkline({ data, stroke }: { data: number[]; stroke: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80,
    h = 28;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  accent = "primary",
  spark = [4, 6, 5, 7, 6, 8, 9],
}: StatCardProps) {
  const positive = delta >= 0;
  const a = accents[accent];
  return (
    <div className="group relative overflow-hidden glass rounded-2xl p-5 hover:border-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div
        className={cn(
          "absolute -top-12 -right-12 size-32 rounded-full blur-2xl opacity-40 bg-gradient-to-br",
          a.bg,
        )}
      />
      <div className="relative flex items-start justify-between mb-5">
        <div
          className={cn(
            "size-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
            a.bg,
          )}
        >
          <Icon className="size-5" />
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 text-[11px] font-medium px-2 py-1 rounded-full",
            positive
              ? "text-success bg-success/10"
              : "text-destructive bg-destructive/10",
          )}
        >
          {positive ? (
            <ArrowUpRight className="size-3" />
          ) : (
            <ArrowDownRight className="size-3" />
          )}
          {Math.abs(delta)}%
        </div>
      </div>
      <div className="relative flex items-end justify-between gap-3">
        <div>
          <div className="text-3xl font-semibold tracking-tight">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
        <Sparkline data={spark} stroke={a.stroke} />
      </div>
    </div>
  );
}
