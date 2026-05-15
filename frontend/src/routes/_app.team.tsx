import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/pages/Team";
export const Route = createFileRoute("/_app/team")({ component: TeamPage });
