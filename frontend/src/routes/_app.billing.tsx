import { createFileRoute } from "@tanstack/react-router";
import { BillingPage } from "@/pages/Billing";

export const Route = createFileRoute("/_app/billing")({
  component: BillingPage,
});
