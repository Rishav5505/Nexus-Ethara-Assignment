import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/pages/Admin";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

export const Route = createFileRoute("/_app/admin")({
  component: () => (
    <ProtectedRoute adminOnly>
      <AdminPage />
    </ProtectedRoute>
  ),
});
