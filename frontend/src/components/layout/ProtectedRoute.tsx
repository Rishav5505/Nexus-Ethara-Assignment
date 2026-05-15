import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  adminOnly?: boolean;
}> = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
    if (!loading && user && adminOnly && user.role !== "admin") {
      navigate({ to: "/dashboard" });
    }
  }, [user, loading, navigate, adminOnly]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-10 rounded-full border-t-2 border-primary animate-spin" />
      </div>
    );
  }

  return user ? <>{children}</> : null;
};
