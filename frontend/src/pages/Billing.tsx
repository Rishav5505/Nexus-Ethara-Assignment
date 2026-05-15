import { CreditCard, Zap, Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui-kit/Badge";

const plans = [
  {
    name: "Starter",
    price: "$0",
    desc: "For small teams getting started.",
    features: ["Up to 3 projects", "Unlimited tasks", "Basic analytics", "Team chat"],
    current: true
  },
  {
    name: "Pro",
    price: "$12",
    desc: "Best for growing organizations.",
    features: ["Unlimited projects", "Advanced analytics", "Custom fields", "Role management", "Priority support"],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$49",
    desc: "Scale with confidence and control.",
    features: ["Everything in Pro", "Single Sign-On (SSO)", "Audit logs", "API access", "Dedicated manager"],
  }
];

export function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight">Billing & Plans</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your subscription and payment methods.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.name} className={`glass rounded-2xl p-6 relative flex flex-col ${p.popular ? 'border-primary/50 shadow-glow' : ''}`}>
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-brand text-[10px] font-bold text-white uppercase tracking-wider shadow-glow">
                Most Popular
              </div>
            )}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                {p.current && <Badge variant="low">Current Plan</Badge>}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{p.price}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{p.desc}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <div className="size-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="size-2.5 text-primary-glow" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button className={`w-full h-10 rounded-xl text-sm font-medium transition ${p.current ? 'bg-white/5 border border-border text-muted-foreground' : 'gradient-brand text-white shadow-glow hover:scale-[1.02] active:scale-95'}`}>
              {p.current ? 'Your Current Plan' : 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden mt-8">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Payment Method</h3>
          <button className="text-xs text-primary-glow hover:underline flex items-center gap-1.5">
            <Plus className="size-3" /> Add new
          </button>
        </div>
        <div className="p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-surface border border-border flex items-center justify-center">
              <CreditCard className="size-6 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium flex items-center gap-2">
                Visa ending in 4242 <Badge variant="neutral">Default</Badge>
              </div>
              <div className="text-xs text-muted-foreground">Expires 12/26</div>
            </div>
          </div>
          <button className="h-9 px-4 rounded-xl text-xs border border-border hover:bg-surface transition">Edit</button>
        </div>
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
