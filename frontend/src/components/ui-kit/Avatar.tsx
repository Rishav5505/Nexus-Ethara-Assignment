import { cn } from "@/lib/utils";

const palettes = [
  "from-pink-500 to-rose-500",
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-fuchsia-500 to-pink-600",
];

export function Avatar({
  name,
  size = 32,
  className,
}: {
  name?: string;
  size?: number;
  className?: string;
}) {
  const safeName = name || "U";
  const idx = safeName.charCodeAt(0) % palettes.length;
  const initials = safeName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold ring-2 ring-background",
        palettes[idx],
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

export function AvatarStack({
  names,
  max = 4,
}: {
  names: string[];
  max?: number;
}) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((n) => (
        <Avatar key={n} name={n} size={28} />
      ))}
      {extra > 0 && (
        <div className="size-7 rounded-full bg-surface-elevated border border-border ring-2 ring-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
          +{extra}
        </div>
      )}
    </div>
  );
}
