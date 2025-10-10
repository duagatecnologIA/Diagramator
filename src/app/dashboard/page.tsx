'use client';

import { useEffect } from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import DiagramsDashboard from '@/components/Dashboard/DiagramsDashboard';

export default function DashboardPage() {

  // Asegurarse de que estamos en el cliente
  useEffect(() => {
    // Verificar que estamos en el lado del cliente
    if (typeof window === 'undefined') {
      return;
    }
  }, []);

  return (
    <ProtectedRoute>
      <DiagramsDashboard />
    </ProtectedRoute>
  );
}
