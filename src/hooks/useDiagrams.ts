'use client';

import { useState, useEffect, useCallback } from 'react';
import { Diagram } from '@/lib/supabase';
import { diagramService } from '@/services/diagramService';
import { useAuth } from '@/contexts/AuthContext';

export function useDiagrams() {
  const { user } = useAuth();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDiagrams = useCallback(async () => {
    if (!user) {
      setDiagrams([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { diagrams: data, error } = await diagramService.getUserDiagrams(
        user.id
      );

      if (error) throw error;
      setDiagrams(data || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDiagrams();
  }, [loadDiagrams]);

  const createDiagram = async (data: {
    title: string;
    description?: string;
    data: any;
    is_public?: boolean;
  }) => {
    const { diagram, error } = await diagramService.createDiagram(data);
    if (!error && diagram) {
      setDiagrams((prev) => [diagram, ...prev]);
    }
    return { diagram, error };
  };

  const updateDiagram = async (
    diagramId: string,
    data: Partial<Diagram>
  ) => {
    // Convertir null a undefined para compatibilidad con el servicio
    const updateData = {
      ...data,
      description: data.description === null ? undefined : data.description,
      thumbnail_url: data.thumbnail_url === null ? undefined : data.thumbnail_url
    };
    
    const { diagram, error } = await diagramService.updateDiagram(
      diagramId,
      updateData
    );
    if (!error && diagram) {
      setDiagrams((prev) =>
        prev.map((d) => (d.id === diagramId ? diagram : d))
      );
    }
    return { diagram, error };
  };

  const deleteDiagram = async (diagramId: string) => {
    const { error } = await diagramService.deleteDiagram(diagramId);
    if (!error) {
      setDiagrams((prev) => prev.filter((d) => d.id !== diagramId));
    }
    return { error };
  };

  const duplicateDiagram = async (diagramId: string) => {
    const { diagram, error } = await diagramService.duplicateDiagram(
      diagramId
    );
    if (!error && diagram) {
      setDiagrams((prev) => [diagram, ...prev]);
    }
    return { diagram, error };
  };

  return {
    diagrams,
    loading,
    error,
    refresh: loadDiagrams,
    createDiagram,
    updateDiagram,
    deleteDiagram,
    duplicateDiagram,
  };
}

export function useDiagram(diagramId: string | null) {
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDiagram = useCallback(async () => {
    if (!diagramId) {
      setDiagram(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { diagram: data, error } = await diagramService.getDiagram(
        diagramId
      );

      if (error) throw error;
      setDiagram(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [diagramId]);

  useEffect(() => {
    loadDiagram();
  }, [loadDiagram]);

  const updateDiagram = async (data: Partial<Diagram>) => {
    if (!diagramId) return { diagram: null, error: new Error('No diagram ID') };

    // Convertir null a undefined para compatibilidad con el servicio
    const updateData = {
      ...data,
      description: data.description === null ? undefined : data.description,
      thumbnail_url: data.thumbnail_url === null ? undefined : data.thumbnail_url
    };

    const { diagram: updated, error } = await diagramService.updateDiagram(
      diagramId,
      updateData
    );

    if (!error && updated) {
      setDiagram(updated);
    }
    return { diagram: updated, error };
  };

  return {
    diagram,
    loading,
    error,
    refresh: loadDiagram,
    updateDiagram,
  };
}

