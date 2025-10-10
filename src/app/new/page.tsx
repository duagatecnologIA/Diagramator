'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { diagramService } from '@/services/diagramService';

export default function NewDiagramPage() {
  const router = useRouter();
  const { user } = useAuth();

  const createNewDiagram = useCallback(async () => {
    try {
      const { diagram, error } = await diagramService.createDiagram({
        title: 'Nuevo Diagrama',
        description: 'Descripción del diagrama',
        data: { nodes: [], edges: [] },
        is_public: false,
      });

      if (!error && diagram) {
        router.push(`/editor/${diagram.id}`);
      } else {
        // Fallback: redirect to dashboard
        router.push('/');
      }
    } catch (_error) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      createNewDiagram();
    }
  }, [user, createNewDiagram]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Creando nuevo diagrama...</p>
      </div>
    </div>
  );
}
