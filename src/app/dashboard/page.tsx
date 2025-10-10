'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import DiagramsDashboard from '@/components/Dashboard/DiagramsDashboard';

export default function DashboardPage() {
  const router = useRouter();

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
