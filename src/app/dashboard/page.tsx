'use client';

import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import DiagramsDashboard from '@/components/Dashboard/DiagramsDashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DiagramsDashboard />
    </ProtectedRoute>
  );
}
