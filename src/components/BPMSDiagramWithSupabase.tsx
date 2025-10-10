'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDiagram } from '@/hooks/useDiagrams';
import BPMSDiagram from './BPMSDiagram';

interface BPMSDiagramWithSupabaseProps {
  diagramId?: string;
}

export default function BPMSDiagramWithSupabase({ diagramId }: BPMSDiagramWithSupabaseProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { diagram, loading, updateDiagram } = useDiagram(diagramId || null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dataReady, setDataReady] = useState(false);
  const [diagramTitle, setDiagramTitle] = useState<string>('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Ref para controlar si ya se cargaron los datos iniciales
  const initialDataLoaded = useRef(false);

  // Cargar datos del diagrama cuando se carga el componente
  useEffect(() => {
    if (diagram && !initialDataLoaded.current) {
      if (diagram.data) {
        setNodes(diagram.data.nodes || []);
        setEdges(diagram.data.edges || []);
      } else {
        setNodes([]);
        setEdges([]);
      }
      
      // Cargar el título del diagrama
      setDiagramTitle(diagram.title || 'Sin título');
      
      initialDataLoaded.current = true;
    }
  }, [diagram]);

  // Asegurar que los datos estén listos antes de renderizar
  useEffect(() => {
    if (diagram && diagram.data) {
      setDataReady(true);
    }
  }, [diagram]);

  // Función para guardar el diagrama con validación
  const saveDiagram = useCallback(async () => {
    if (!diagramId || isSaving) return;

    // Validar que hay datos para guardar
    if (nodes.length === 0 && edges.length === 0) {
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateDiagram({
        data: { nodes, edges }
      });
      
      if (result.error) {
        throw result.error;
      }
      
      setLastSaved(new Date());
    } catch (error) {
      alert('Error al guardar el diagrama. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  }, [diagramId, isSaving, nodes, edges, updateDiagram]);

  // Auto-guardar cada 30 segundos si hay cambios
  useEffect(() => {
    if (!user || !diagramId || !diagram) return;

    const interval = setInterval(async () => {
      if (nodes.length > 0 || edges.length > 0) {
        await saveDiagram();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [nodes, edges, diagramId, user, diagram, saveDiagram]);

  // Función para manejar cambios en el diagrama
  const handleDiagramChange = (newNodes: any[], newEdges: any[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
  };

  // Función para guardar manualmente
  const handleManualSave = async () => {
    await saveDiagram();
  };

  // Función para volver al dashboard
  const handleBackToDashboard = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Cargando diagrama...</p>
        </div>
      </div>
    );
  }

  if (!diagram && diagramId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Diagrama no encontrado</h3>
          <p className="text-gray-600 mb-6">El diagrama que buscas no existe o no tienes permisos para verlo.</p>
          <button
            onClick={handleBackToDashboard}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Función para exportar diagrama como JSON
  const exportDiagramAsJSON = () => {
    const exportData = {
      nodes: nodes,
      edges: edges,
      metadata: {
        title: diagram?.title || 'Diagrama Exportado',
        exported_at: new Date().toISOString(),
        version: '1.0',
        user_id: user?.id || 'anonymous'
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `diagrama_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      // Manejar error si es necesario
    }
  };

  // Determinar el estado de guardado
  const getSaveStatus = () => {
    if (isSaving) return 'saving';
    if (lastSaved) return 'saved';
    return 'unsaved';
  };

  const getSaveStatusText = () => {
    if (isSaving) return 'Guardando...';
    if (lastSaved) return `Guardado ${lastSaved.toLocaleTimeString()}`;
    return 'Sin cambios';
  };

  const getSaveStatusColor = () => {
    if (isSaving) return 'text-blue-600';
    if (lastSaved) return 'text-green-600';
    return 'text-gray-600';
  };

  // Función para guardar el título del diagrama
  const handleSaveTitle = async (newTitle: string) => {
    if (!diagramId || !newTitle.trim()) return;
    
    try {
      setIsSaving(true);
      const result = await updateDiagram({
        title: newTitle.trim()
      });
      
      if (result.error) {
        throw result.error;
      }
      
      setDiagramTitle(newTitle.trim());
      setLastSaved(new Date());
    } catch (error) {
      alert('Error al guardar el título. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
      setIsEditingTitle(false);
    }
  };

  // No renderizar hasta que los datos estén listos
  if (!dataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Cargando diagrama...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <BPMSDiagram
        initialNodes={nodes}
        initialEdges={edges}
        onDiagramChange={handleDiagramChange}
        saveStatus={getSaveStatus()}
        saveStatusText={getSaveStatusText()}
        saveStatusColor={getSaveStatusColor()}
        isSaving={isSaving}
        onManualSave={handleManualSave}
        onExportJSON={exportDiagramAsJSON}
        onLogout={handleLogout}
        currentDiagramId={diagramId}
        diagramTitle={diagramTitle}
        onTitleChange={handleSaveTitle}
      />
    </div>
  );
}
