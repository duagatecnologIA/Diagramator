'use client';

import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import BPMSDiagramWithSave from '@/components/BPMSDiagramWithSave';

export default function Home() {
  return (
    <ProtectedRoute>
      <BPMSDiagramWithSave />
    </ProtectedRoute>
  );
}