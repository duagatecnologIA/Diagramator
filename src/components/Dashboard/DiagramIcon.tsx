'use client';

import React from 'react';

interface DiagramIconProps {
  nodes?: any[];
  edges?: any[];
  size?: number;
  className?: string;
}

// Generar diferentes tipos de diagramas abstractos
const generateDiagramPattern = (nodes: any[], edges: any[]): 'linear' | 'branching' | 'network' | 'simple' | 'circular' | 'hierarchical' => {
  if (!nodes || nodes.length === 0) return 'simple';
  
  const nodeCount = nodes.length;
  const edgeCount = edges?.length || 0;
  
  // Determinar patrón basado en la estructura
  if (nodeCount <= 1) return 'simple';
  if (nodeCount === 2) return 'linear';
  if (nodeCount >= 5 && edgeCount > nodeCount * 1.5) return 'network';
  if (nodeCount >= 4 && edgeCount === nodeCount) return 'circular';
  if (nodeCount >= 3 && edgeCount <= nodeCount + 1) return 'hierarchical';
  return 'branching';
};

export default function DiagramIcon({ nodes = [], edges = [], size = 40, className = "text-gray-400" }: DiagramIconProps) {
  const pattern = generateDiagramPattern(nodes, edges);
  
  const renderPattern = () => {
    switch (pattern) {
      case 'linear':
        return (
          <>
            {/* Patrón lineal */}
            <circle cx="8" cy="20" r="3" fill="currentColor" />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
            <circle cx="32" cy="20" r="3" fill="currentColor" />
            <path d="M11 20 L17 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M23 20 L29 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      
      case 'branching':
        return (
          <>
            {/* Patrón con ramificación */}
            <circle cx="8" cy="20" r="3" fill="currentColor" />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
            <circle cx="32" cy="12" r="3" fill="currentColor" />
            <circle cx="32" cy="28" r="3" fill="currentColor" />
            <path d="M11 20 L17 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M23 20 Q27.5 16 29 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M23 20 Q27.5 24 29 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      
      case 'network':
        return (
          <>
            {/* Patrón de red */}
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            <circle cx="28" cy="12" r="2.5" fill="currentColor" />
            <circle cx="12" cy="28" r="2.5" fill="currentColor" />
            <circle cx="28" cy="28" r="2.5" fill="currentColor" />
            <circle cx="20" cy="20" r="2.5" fill="currentColor" />
            <path d="M14.5 12 L25.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14.5 28 L25.5 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 14.5 L12 25.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M28 14.5 L28 25.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14.5 14.5 L25.5 25.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M25.5 14.5 L14.5 25.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      
      case 'circular':
        return (
          <>
            {/* Patrón circular */}
            <circle cx="20" cy="12" r="3" fill="currentColor" />
            <circle cx="28" cy="20" r="3" fill="currentColor" />
            <circle cx="20" cy="28" r="3" fill="currentColor" />
            <circle cx="12" cy="20" r="3" fill="currentColor" />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
            <path d="M23 12 L27 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M28 23 L23 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M17 28 L12 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 17 L17 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      
      case 'hierarchical':
        return (
          <>
            {/* Patrón jerárquico */}
            <circle cx="20" cy="8" r="3" fill="currentColor" />
            <circle cx="12" cy="20" r="2.5" fill="currentColor" />
            <circle cx="20" cy="20" r="2.5" fill="currentColor" />
            <circle cx="28" cy="20" r="2.5" fill="currentColor" />
            <circle cx="16" cy="32" r="2" fill="currentColor" />
            <circle cx="24" cy="32" r="2" fill="currentColor" />
            <path d="M20 11 L16 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20 11 L20 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20 11 L24 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 22 L16 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20 22 L20 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M28 22 L24 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      
      case 'simple':
      default:
        return (
          <>
            {/* Patrón simple */}
            <circle cx="20" cy="20" r="4" fill="currentColor" />
            <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1" fill="none" />
          </>
        );
    }
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      className={className}
      fill="none"
    >
      {renderPattern()}
    </svg>
  );
}
