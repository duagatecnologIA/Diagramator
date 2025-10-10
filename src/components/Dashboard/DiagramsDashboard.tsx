'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDiagrams } from '@/hooks/useDiagrams';
import { 
  Plus, 
  FileText, 
  Trash2, 
  Copy, 
  Share2, 
  Download,
  Search,
  LogOut,
  User,
  Calendar,
  Eye,
  MoreVertical
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import DiagramIcon from './DiagramIcon';

export default function DiagramsDashboard() {
  const { user, profile, signOut } = useAuth();
  const { diagrams, loading, createDiagram, deleteDiagram, duplicateDiagram } = useDiagrams();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleCreateDiagram = async () => {
    router.push('/new');
  };

  const handleDeleteDiagram = async (diagramId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este diagrama?')) {
      await deleteDiagram(diagramId);
    }
  };

  const handleDuplicateDiagram = async (diagramId: string) => {
    await duplicateDiagram(diagramId);
  };

  const filteredDiagrams = diagrams.filter((diagram) =>
    diagram.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    diagram.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };


  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden shadow-sm border-b border-gray-200/60">
        {/* Textura sutil */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.3)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        
        {/* Contenido principal */}
        <div className="relative flex items-center justify-between px-8 h-full">
          <div className="flex items-center space-x-6">
            {/* Logo/Icono */}
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
          </div>
            
            {/* Título y subtítulo */}
            <div className="flex flex-col">
              <h1 className="text-4xl font-light text-gray-900 tracking-tight leading-none">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">
                  Diagramator
                </span>
              </h1>
              
              <p className="text-sm text-gray-500 font-normal mt-1 tracking-wide">
                Diagramas de procesos de negocio inteligentes
              </p>
            </div>
        </div>

        
          {/* Elementos del lado derecho */}
          <div className="flex items-center space-x-4">
            {/* Botón Dashboard */}
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-lg shadow-sm border border-gray-200 transition-all flex items-center gap-2"
              title="Volver al canvas"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Canvas Principal
            </button>

            {/* Botón Cerrar Sesión */}
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg shadow-sm border border-red-400 transition-all flex items-center gap-2"
              title="Cerrar sesión"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>

            {/* Elementos decorativos */}
            <div className="hidden md:flex items-center space-x-4 opacity-60">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
              </div>
              <div className="text-xs text-gray-400 font-mono">
                v1.0
              </div>
            </div>
          </div>
            </div>
        
        {/* Línea decorativa inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      </div>

      {/* Main Content - Estilo Google Drive */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        {/* Actions Bar - Solo Búsqueda */}
        <div className="mb-6">
          {/* Search - Más compacto */}
          <div className="max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Stats - Ultra Minimalistas */}
        <div className="flex gap-8 mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{diagrams.length} diagramas</span>
          </div>
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{diagrams.filter(d => d.is_public).length} públicos</span>
          </div>
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{diagrams.reduce((sum, d) => sum + d.view_count, 0)} vistas</span>
          </div>
        </div>

        {/* Diagrams Grid - Estilo Google Drive */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Cargando diagramas...</p>
          </div>
        ) : filteredDiagrams.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron diagramas' : 'No tienes diagramas aún'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchQuery
                ? 'Intenta con otra búsqueda'
                : 'Crea tu primer diagrama para comenzar a diseñar procesos de negocio'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateDiagram}
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Crear Diagrama
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filteredDiagrams.map((diagram) => (
              <div
                key={diagram.id}
                className="bg-white rounded-lg p-3 hover:shadow-md transition-all duration-200 group cursor-pointer border border-gray-100 hover:border-gray-200"
                onClick={() => router.push(`/editor/${diagram.id}`)}
              >
                {/* Thumbnail - Visualización Abstracta Minimalista */}
                <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-gray-100 transition-colors relative overflow-hidden">
                  {diagram.thumbnail_url ? (
                    <img
                      src={diagram.thumbnail_url}
                      alt={diagram.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <DiagramIcon 
                        nodes={Array.isArray(diagram.data?.nodes) ? diagram.data.nodes : []} 
                        edges={Array.isArray(diagram.data?.edges) ? diagram.data.edges : []} 
                        size={40}
                        className="text-gray-400"
                      />
                    </div>
                  )}
                </div>

                {/* Content - Ultra compacto */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 text-xs truncate">
                    {diagram.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{formatDate(diagram.updated_at)}</span>
                    <span>{diagram.view_count}</span>
                  </div>

                  {/* Actions - Solo iconos, aparecen al hover */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateDiagram(diagram.id);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Duplicar"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDiagram(diagram.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

