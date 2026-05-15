import { createFileRoute } from "@tanstack/react-router";
import { TasksPage } from "@/pages/Tasks";
export const Route = createFileRoute("/_app/tasks")({ component: TasksPage });
