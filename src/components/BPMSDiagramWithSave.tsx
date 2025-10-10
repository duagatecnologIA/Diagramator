'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { diagramService } from '@/services/diagramService';
import BPMSDiagram from './BPMSDiagram';

interface BPMSDiagramWithSaveProps {
  diagramId?: string; // Si no se proporciona, creará un nuevo diagrama
}

export default function BPMSDiagramWithSave({ diagramId }: BPMSDiagramWithSaveProps) {
  const { user, signOut } = useAuth();
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(diagramId || null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [diagramData, setDiagramData] = useState<any>({ nodes: [], edges: [] });

  // Función para crear un nuevo diagrama
  const createNewDiagram = useCallback(async () => {
    if (!user) return;

    try {
      const { diagram, error } = await diagramService.createDiagram({
        title: 'Diagrama sin título',
        description: 'Diagrama creado desde el canvas',
        data: { nodes: [], edges: [] },
        is_public: false,
      });

      if (!error && diagram) {
        setCurrentDiagramId(diagram.id);
        setSaveStatus('saved');
        return diagram.id;
      } else {
        setSaveStatus('error');
        return null;
      }
    } catch (error) {
      setSaveStatus('error');
      return null;
    }
  }, [user]);

  // Función para guardar el diagrama
  const saveDiagram = useCallback(async (data: { nodes: any[], edges: any[] }, title?: string) => {
    if (!user) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      let diagramIdToUse = currentDiagramId;

      // Si no hay diagrama actual, crear uno nuevo
      if (!diagramIdToUse) {
        diagramIdToUse = await createNewDiagram();
        if (!diagramIdToUse) {
          setSaveStatus('error');
          return;
        }
      }

      // Actualizar el diagrama existente
      const updateData: any = {
        data,
        updated_at: new Date().toISOString()
      };

      if (title) {
        updateData.title = title;
      }

      const { diagram, error } = await diagramService.updateDiagram(diagramIdToUse, updateData);

      if (!error && diagram) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        
        // Mostrar notificación temporal
        setSaveStatus('saved');
        setTimeout(() => {
          setSaveStatus('saved');
        }, 2000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [user, currentDiagramId, createNewDiagram]);

  // Función para exportar diagrama como JSON
  const exportDiagramAsJSON = useCallback(() => {
    const exportData = {
      nodes: diagramData.nodes,
      edges: diagramData.edges,
      metadata: {
        title: currentDiagramId ? 'Diagrama Exportado' : 'Nuevo Diagrama',
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
    
  }, [diagramData, currentDiagramId, user]);

  // Función para manejar Ctrl+S / Cmd+S
  const handleSaveShortcut = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      event.stopPropagation();
      
      // SIEMPRE guardar en base de datos (si hay usuario autenticado)
      if (user) {
        saveDiagram(diagramData);
      } else {
        // Si no hay usuario autenticado, mostrar mensaje
        alert('Debes iniciar sesión para guardar diagramas.');
      }
    }
  }, [saveDiagram, diagramData, user]);

  // Función para cerrar sesión
  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      // El redirect se maneja automáticamente en ProtectedRoute
    } catch (error) {
    }
  }, [signOut]);

  // Función para manejar cambios en el diagrama
  const handleDiagramChange = useCallback((nodes: any[], edges: any[]) => {
    setDiagramData({ nodes, edges });
    
    // Marcar como no guardado si hay cambios
    if (currentDiagramId) {
      setSaveStatus('unsaved');
    }
  }, [currentDiagramId]);

  // Agregar listener para Ctrl+S
  useEffect(() => {
    document.addEventListener('keydown', handleSaveShortcut);
    return () => {
      document.removeEventListener('keydown', handleSaveShortcut);
    };
  }, [handleSaveShortcut]);


  // Función para obtener el estado de guardado como texto
  const getSaveStatusText = useCallback(() => {
    switch (saveStatus) {
      case 'saving':
        return 'Guardando...';
      case 'saved':
        return lastSaved ? `Guardado ${lastSaved.toLocaleTimeString()}` : 'Guardado';
      case 'error':
        return 'Error al guardar';
      case 'unsaved':
        return 'Sin guardar';
      default:
        return '';
    }
  }, [saveStatus, lastSaved]);

  // Función para obtener el color del estado
  const getSaveStatusColor = useCallback(() => {
    switch (saveStatus) {
      case 'saving':
        return 'text-blue-600';
      case 'saved':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'unsaved':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  }, [saveStatus]);

  return (
    <div className="w-full h-screen">
      {/* Canvas de diagramas con banner integrado */}
      <BPMSDiagram
        onDiagramChange={handleDiagramChange}
        initialNodes={diagramData.nodes}
        initialEdges={diagramData.edges}
        saveStatus={saveStatus}
        saveStatusText={getSaveStatusText()}
        saveStatusColor={getSaveStatusColor()}
        isSaving={isSaving}
        onManualSave={() => saveDiagram(diagramData)}
        onExportJSON={exportDiagramAsJSON}
        onLogout={handleLogout}
        currentDiagramId={currentDiagramId}
      />
    </div>
  );
}
