'use client';

import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import BPMSDiagramWithSupabase from '@/components/BPMSDiagramWithSupabase';

export default function EditorPage() {
  const params = useParams();
  const diagramId = params.id as string;

  return (
    <ProtectedRoute>
      <BPMSDiagramWithSupabase diagramId={diagramId} />
    </ProtectedRoute>
  );
}
