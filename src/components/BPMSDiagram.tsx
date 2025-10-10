'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  Position,
  Handle,
  ConnectionLineType,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  getNodesBounds,
  MiniMap,
  SelectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toPng, toSvg } from 'html-to-image';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  X,
  Download,
  MousePointer,
  Trash2,
  Circle,
  Square,
  Diamond,
  Hexagon,
  Save,
  Upload,
  Copy,
  FileJson,
} from 'lucide-react';

// Interfaz para los datos de los nodos
interface NodeData {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  textColor?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

// Definir tipos de nodos personalizados
const nodeTypes: NodeTypes = {
  phase: PhaseNode,
  activity: ActivityNode,
  decision: DecisionNode,
  process: ProcessNode,
};

// Nodo para las fases principales - Diseño moderno
function PhaseNode({ data }: { data: NodeData }) {
  const color = data.color || '#3B82F6';
  const textColor = data.textColor || '#FFFFFF';
  const size = data.size || 'medium';
  
  const sizeClasses = {
    small: 'min-w-[200px] p-4 text-base',
    medium: 'min-w-[240px] p-5 text-lg',
    large: 'min-w-[280px] p-6 text-xl',
    xlarge: 'min-w-[320px] p-7 text-2xl'
  };
  
  return (
    <div 
      className={`rounded-xl shadow-lg border-0 text-center relative ${sizeClasses[size]} transition-all duration-200 hover:shadow-xl hover:-translate-y-1`}
      style={{
        background: color,
        color: textColor,
        boxShadow: `0 4px 12px ${color}30, 0 2px 6px ${color}20`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 border-white !bg-white transition-all duration-200 hover:scale-110"
        style={{ 
          boxShadow: `0 0 0 2px ${color}`,
          top: -6
        }}
      />
      <div className="flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm leading-tight">{data.label}</h3>
        {data.description && (
          <p className="text-xs opacity-90 mt-1 leading-relaxed">{data.description}</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-white !bg-white transition-all duration-200 hover:scale-110"
        style={{ 
          boxShadow: `0 0 0 2px ${color}`,
          bottom: -6
        }}
      />
    </div>
  );
}

// Nodo para actividades - Diseño moderno
function ActivityNode({ data }: { data: NodeData }) {
  const color = data.color || '#3B82F6';
  const textColor = data.textColor || '#1F2937';
  const size = data.size || 'medium';
  
  const sizeClasses = {
    small: 'min-w-[180px] p-3 text-sm',
    medium: 'min-w-[200px] p-4 text-base',
    large: 'min-w-[220px] p-5 text-lg',
    xlarge: 'min-w-[240px] p-6 text-xl'
  };
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 relative ${sizeClasses[size]} transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
      style={{ 
        borderLeftColor: color,
        borderLeftWidth: '4px',
        color: textColor,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 border-white transition-all duration-200 hover:scale-110"
        style={{ 
          backgroundColor: color, 
          boxShadow: `0 0 0 2px ${color}30`,
          top: -6
        }}
      />
      <div className="flex items-start gap-3">
        <div 
          className="w-8 h-8 flex items-center justify-center rounded-md mt-0.5"
          style={{ backgroundColor: `${color}15` }}
        >
          <svg className="w-4 h-4" style={{ color: color }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight">{data.label}</h4>
          {data.description && (
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{data.description}</p>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-white transition-all duration-200 hover:scale-110"
        style={{ 
          backgroundColor: color, 
          boxShadow: `0 0 0 2px ${color}30`,
          bottom: -6
        }}
      />
    </div>
  );
}

// Nodo para decisiones - Diseño moderno
function DecisionNode({ data }: { data: NodeData }) {
  const color = data.color || '#F59E0B';
  const textColor = data.textColor || '#FFFFFF';
  const size = data.size || 'medium';
  
  const sizeClasses = {
    small: 'w-[80px] h-[80px] p-3',
    medium: 'w-[100px] h-[100px] p-4',
    large: 'w-[120px] h-[120px] p-5',
    xlarge: 'w-[140px] h-[140px] p-6'
  };
  
  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xlarge: 'text-lg'
  };
  
  return (
    <div 
      className={`rotate-45 shadow-lg flex items-center justify-center relative ${sizeClasses[size]} transition-all duration-200 hover:shadow-xl hover:scale-105`}
      style={{ 
        background: color,
        color: textColor,
        boxShadow: `0 4px 12px ${color}40, 0 2px 6px ${color}30`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 border-white !bg-white transition-all duration-200 hover:scale-110"
        style={{ 
          boxShadow: `0 0 0 2px ${color}`,
          top: -6
        }}
      />
      <div className="text-center -rotate-45">
        <div className="w-6 h-6 mx-auto mb-2 flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <p className={`${textSizes[size]} font-semibold leading-tight px-1`}>{data.label}</p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-white !bg-white transition-all duration-200 hover:scale-110"
        style={{ 
          boxShadow: `0 0 0 2px ${color}`,
          bottom: -6
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white !bg-white transition-all duration-200 hover:scale-110"
        style={{ 
          boxShadow: `0 0 0 2px ${color}`,
          left: -6
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-white !bg-white transition-all duration-200 hover:scale-110"
        style={{ 
          boxShadow: `0 0 0 2px ${color}`,
          right: -6
        }}
      />
    </div>
  );
}

// Nodo para procesos - Diseño moderno
function ProcessNode({ data }: { data: NodeData }) {
  const color = data.color || '#10B981';
  const textColor = data.textColor || '#FFFFFF';
  const size = data.size || 'medium';
  
  const sizeClasses = {
    small: 'min-w-[180px] p-3 text-sm',
    medium: 'min-w-[200px] p-4 text-base',
    large: 'min-w-[220px] p-5 text-lg',
    xlarge: 'min-w-[240px] p-6 text-xl'
  };
  
  return (
    <div 
      className={`rounded-lg shadow-sm border border-gray-200 relative ${sizeClasses[size]} transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
      style={{ 
        borderLeftColor: color,
        borderLeftWidth: '4px',
        color: textColor,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 border-white transition-all duration-200 hover:scale-110"
        style={{ 
          backgroundColor: color, 
          boxShadow: `0 0 0 2px ${color}30`,
          top: -6
        }}
      />
      <div className="flex items-start gap-3">
        <div 
          className="w-8 h-8 flex items-center justify-center rounded-md mt-0.5"
          style={{ backgroundColor: `${color}15` }}
        >
          <svg className="w-4 h-4" style={{ color: color }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight">{data.label}</h4>
          {data.description && (
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{data.description}</p>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-white transition-all duration-200 hover:scale-110"
        style={{ 
          backgroundColor: color, 
          boxShadow: `0 0 0 2px ${color}30`,
          bottom: -6
        }}
      />
    </div>
  );
}

// Props para el componente interno
interface BPMSDiagramInnerProps {
  onDiagramChange?: (nodes: any[], edges: any[]) => void;
  initialNodes?: any[];
  initialEdges?: any[];
  saveStatus?: 'saved' | 'saving' | 'error' | 'unsaved';
  saveStatusText?: string;
  saveStatusColor?: string;
  isSaving?: boolean;
  onManualSave?: () => void;
  onExportJSON?: () => void;
  onLogout?: () => void;
  currentDiagramId?: string | null;
  diagramTitle?: string;
  onTitleChange?: (newTitle: string) => void;
}

// Componente interno para manejar la lógica del diagrama
function BPMSDiagramInner({ 
  onDiagramChange, 
  initialNodes, 
  initialEdges,
  diagramTitle: propDiagramTitle,
  onTitleChange,
  saveStatus,
  saveStatusText,
  saveStatusColor,
  isSaving,
  onManualSave,
  onExportJSON,
  onLogout,
  currentDiagramId
}: BPMSDiagramInnerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { deleteElements, getNodes, project } = useReactFlow();

  // Estados para el historial de undo/redo
  const [history, setHistory] = React.useState<{nodes: Node[], edges: Edge[]}[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(0);
  const [isUndoRedoOperation, setIsUndoRedoOperation] = React.useState(false);
  
  // Estado para el modo de herramienta actual
  const [toolMode, setToolMode] = React.useState<'select' | 'phase' | 'activity' | 'decision' | 'process' | 'delete'>('select');
  const [nodeIdCounter, setNodeIdCounter] = React.useState(1000);
  
  
  // Estado para edición de nodos
  const [editingNode, setEditingNode] = React.useState<Node | null>(null);
  const [editLabel, setEditLabel] = React.useState('');
  const [editDescription, setEditDescription] = React.useState('');
  const [editColor, setEditColor] = React.useState('#3B82F6');
  const [editTextColor, setEditTextColor] = React.useState('#FFFFFF');
  const [editSize, setEditSize] = React.useState<'small' | 'medium' | 'large' | 'xlarge'>('medium');
  
  // Estado para edición de conexiones
  const [editingEdge, setEditingEdge] = React.useState<Edge | null>(null);
  const [editEdgeLabel, setEditEdgeLabel] = React.useState('');
  const [editEdgeColor, setEditEdgeColor] = React.useState('#3B82F6');
  
  // Estado para clipboard (copy/paste)
  const [clipboard, setClipboard] = React.useState<Node[]>([]);
  
  // Estado para mostrar modal de templates
  const [showTemplates, setShowTemplates] = React.useState(false);
  
  // Estados para edición del título
  const [diagramTitle, setDiagramTitle] = React.useState(propDiagramTitle || 'Sin título');
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [tempTitle, setTempTitle] = React.useState('');

  // Actualizar título cuando cambie la prop
  React.useEffect(() => {
    if (propDiagramTitle) {
      setDiagramTitle(propDiagramTitle);
    }
  }, [propDiagramTitle]);

  // Función para guardar el estado actual en el historial
  const saveToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    if (isUndoRedoOperation) {
      setIsUndoRedoOperation(false);
      return; // No guardar durante operaciones de undo/redo
    }
    
    const newState = { nodes: [...newNodes], edges: [...newEdges] };
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      return newHistory.slice(-50); // Mantener solo los últimos 50 estados
    });
    
    setHistoryIndex(prev => {
      const newIndex = Math.min(prev + 1, 49);
      return newIndex;
    });
  }, [historyIndex, isUndoRedoOperation]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        style: { strokeWidth: 2, stroke: '#3B82F6' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      };
      const updatedEdges = addEdge(newEdge, edges);
      saveToHistory(nodes, updatedEdges);
      setEdges(updatedEdges);
    },
    [edges, nodes, setEdges, saveToHistory]
  );

  // Función para deshacer (Ctrl+Z)
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setIsUndoRedoOperation(true);
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => {
        const newIndex = prev - 1;
        return newIndex;
      });
    } else {
    }
  }, [historyIndex, history, setNodes, setEdges]);

  // Función para rehacer (Ctrl+Y)
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedoOperation(true);
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => {
        const newIndex = prev + 1;
        return newIndex;
      });
    } else {
    }
  }, [historyIndex, history, setNodes, setEdges]);

  // Función para eliminar elementos seleccionados
  const onDelete = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      // Guardar estado antes de eliminar
      saveToHistory(nodes, edges);
      deleteElements({ nodes: selectedNodes, edges: selectedEdges });
    }
  }, [deleteElements, nodes, edges, saveToHistory]);

  // Función para agregar un nuevo nodo
  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newId = `node-${nodeIdCounter}`;
    setNodeIdCounter(prev => prev + 1);
    
    let newNode: Node;
    
    switch (type) {
      case 'phase':
        newNode = {
          id: newId,
          type: 'phase',
          position,
          data: {
            label: 'Nueva Fase',
            description: 'Descripción de la fase',
            icon: null // No incluir iconos React directamente
          },
        };
        break;
      case 'activity':
        newNode = {
          id: newId,
          type: 'activity',
          position,
          data: {
            label: 'Nueva Actividad',
            description: 'Descripción de la actividad',
            icon: null // No incluir iconos React directamente
          },
        };
        break;
      case 'decision':
        newNode = {
          id: newId,
          type: 'decision',
          position,
          data: {
            label: '¿Decisión?',
            icon: null // No incluir iconos React directamente
          },
        };
        break;
      case 'process':
        newNode = {
          id: newId,
          type: 'process',
          position,
          data: {
            label: 'Nuevo Proceso',
            description: 'Descripción del proceso',
            icon: null // No incluir iconos React directamente
          },
        };
        break;
      default:
        return;
    }
    
    setNodes((nds) => [...nds, newNode]);
    saveToHistory([...nodes, newNode], edges);
    // NO cambiar el toolMode automáticamente - mantener el modo activo
  }, [nodeIdCounter, setNodes, nodes, edges, saveToHistory]);

  // Manejar clic en el canvas
  const onPaneClick = useCallback((event: React.MouseEvent | MouseEvent) => {
    // Solo agregar nodos si no estamos en modo selección o eliminación
    if (toolMode === 'select' || toolMode === 'delete') {
      return;
    }
    
    // Obtener las coordenadas del click
    let clientX: number, clientY: number;
    if ('clientX' in event && event.clientX !== undefined) {
      // Evento estándar
      clientX = event.clientX;
      clientY = event.clientY;
    } else if ('nativeEvent' in event && event.nativeEvent) {
      // Evento React
      clientX = event.nativeEvent.clientX;
      clientY = event.nativeEvent.clientY;
    } else {
      return;
    }
    
    const reactFlowBounds = (event.currentTarget as HTMLElement || document.querySelector('.react-flow__pane') as HTMLElement)?.getBoundingClientRect();
    if (!reactFlowBounds) {
      return;
    }
    
    const position = project({
      x: clientX - reactFlowBounds.left,
      y: clientY - reactFlowBounds.top,
    });
    
    addNode(toolMode, position);
  }, [toolMode, project, addNode]);


  // Manejar clic en nodos
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (toolMode === 'delete') {
      saveToHistory(nodes, edges);
      deleteElements({ nodes: [node], edges: [] });
    }
  }, [toolMode, deleteElements, nodes, edges, saveToHistory]);

  // Manejar doble clic en nodos para editar
  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (toolMode === 'select') {
      setEditingNode(node);
      setEditLabel(node.data.label || '');
      setEditDescription(node.data.description || '');
      
      // Usar colores por defecto específicos para cada tipo de nodo
      let defaultColor = '#3B82F6';
      let defaultTextColor = '#FFFFFF';
      
      switch (node.type) {
        case 'phase':
          defaultColor = '#3B82F6';
          defaultTextColor = '#FFFFFF';
          break;
        case 'activity':
          defaultColor = '#3B82F6';
          defaultTextColor = '#1F2937';
          break;
        case 'decision':
          defaultColor = '#F59E0B';
          defaultTextColor = '#FFFFFF';
          break;
        case 'process':
          defaultColor = '#10B981';
          defaultTextColor = '#FFFFFF';
          break;
      }
      
      setEditColor(node.data.color || defaultColor);
      setEditTextColor(node.data.textColor || defaultTextColor);
      setEditSize(node.data.size || 'medium');
    }
  }, [toolMode]);

  // Guardar cambios de edición
  const handleSaveEdit = useCallback(() => {
    if (!editingNode) return;

    const updatedNodes = nodes.map(node => {
      if (node.id === editingNode.id) {
        return {
          ...node,
          type: editingNode.type, // Mantener el tipo actualizado del editingNode
          data: {
            ...node.data,
            label: editLabel,
            description: editDescription,
            color: editColor,
            textColor: editTextColor,
            size: editSize,
          }
        };
      }
      return node;
    });

    saveToHistory(updatedNodes, edges);
    setNodes(updatedNodes);
    
    // Forzar re-renderizado de ReactFlow
    setTimeout(() => {
      setNodes([...updatedNodes]);
    }, 0);
    
    setEditingNode(null);
    setEditLabel('');
    setEditDescription('');
    setEditColor('#3B82F6');
    setEditTextColor('#FFFFFF');
    setEditSize('medium');
  }, [editingNode, editLabel, editDescription, editColor, editTextColor, editSize, nodes, edges, setNodes, saveToHistory]);

  // Cancelar edición
  const handleCancelEdit = useCallback(() => {
    setEditingNode(null);
    setEditLabel('');
    setEditDescription('');
    setEditColor('#3B82F6');
    setEditTextColor('#FFFFFF');
    setEditSize('medium');
  }, []);

  // Manejar doble click en conexiones para editar etiqueta
  const onEdgeDoubleClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    if (toolMode === 'select') {
      setEditingEdge(edge);
      setEditEdgeLabel(typeof edge.label === 'string' ? edge.label : '');
      // Extraer el color actual de la conexión o usar el por defecto
      const currentColor = edge.style?.stroke || '#3B82F6';
      setEditEdgeColor(currentColor);
    }
  }, [toolMode]);

  // Guardar cambios de edición de conexión
  const handleSaveEdgeEdit = useCallback(() => {
    if (!editingEdge) return;

    const updatedEdges = edges.map(edge => {
      if (edge.id === editingEdge.id) {
        return {
          ...edge,
          label: editEdgeLabel,
          labelStyle: editEdgeLabel ? { fill: '#6B7280', fontWeight: 600 } : undefined,
          style: {
            ...edge.style,
            stroke: editEdgeColor,
            strokeWidth: 2
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: editEdgeColor
          }
        };
      }
      return edge;
    });

    saveToHistory(nodes, updatedEdges);
    setEdges(updatedEdges);
    setEditingEdge(null);
    setEditEdgeLabel('');
    setEditEdgeColor('#3B82F6');
  }, [editingEdge, editEdgeLabel, editEdgeColor, edges, nodes, setEdges, saveToHistory]);

  // Cancelar edición de conexión
  const handleCancelEdgeEdit = useCallback(() => {
    setEditingEdge(null);
    setEditEdgeLabel('');
    setEditEdgeColor('#3B82F6');
  }, []);

  // Función para copiar nodos seleccionados
  const onCopy = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length > 0) {
      setClipboard(selectedNodes);
    }
  }, [nodes]);

  // Función para pegar nodos
  const onPaste = useCallback(() => {
    if (clipboard.length === 0) return;

    const newNodes = clipboard.map((node) => {
      const newId = `node-${nodeIdCounter + clipboard.indexOf(node)}`;
      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
        selected: false,
      };
    });

    setNodeIdCounter(prev => prev + clipboard.length);
    setNodes((nds) => [...nds, ...newNodes]);
    saveToHistory([...nodes, ...newNodes], edges);
  }, [clipboard, nodes, edges, nodeIdCounter, setNodes, saveToHistory]);

  // Función para duplicar nodos seleccionados
  const onDuplicate = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length === 0) return;

    const duplicatedNodes = selectedNodes.map((node, index) => {
      const newId = `node-${nodeIdCounter + index}`;
      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
        selected: true,
      };
    });

    setNodeIdCounter(prev => prev + selectedNodes.length);
    
    // Deseleccionar nodos originales y agregar los duplicados
    const updatedNodes = nodes.map(node => ({ ...node, selected: false }));
    setNodes([...updatedNodes, ...duplicatedNodes]);
    saveToHistory([...updatedNodes, ...duplicatedNodes], edges);
  }, [nodes, edges, nodeIdCounter, setNodes, saveToHistory]);

  // Función para limpiar nodos para exportación
  const cleanNodesForExport = useCallback((nodes: Node[]) => {
    return nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        ...node.data,
        icon: null, // Remover iconos React para evitar problemas de serialización
      },
      style: node.style,
      className: node.className,
      sourcePosition: node.sourcePosition,
      targetPosition: node.targetPosition,
      hidden: node.hidden,
      selected: false, // Siempre exportar como no seleccionado
      dragging: false, // Siempre exportar como no arrastrando
    }));
  }, []);

  // Función para limpiar edges para exportación
  const cleanEdgesForExport = useCallback((edges: Edge[]) => {
    return edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      style: edge.style,
      label: edge.label,
      labelStyle: edge.labelStyle,
      labelBgStyle: edge.labelBgStyle,
      labelBgPadding: edge.labelBgPadding,
      labelBgBorderRadius: edge.labelBgBorderRadius,
      markerEnd: edge.markerEnd,
      markerStart: edge.markerStart,
      hidden: edge.hidden,
      selected: false, // Siempre exportar como no seleccionado
    }));
  }, []);

  // Función de fallback para exportar como JSON (cuando no se pasa como prop)
  const defaultExportJSON = useCallback(() => {
    try {
      const now = new Date();
      const currentTitle = diagramTitle || 'Diagrama';
      
      const diagramData = {
        nodes: cleanNodesForExport(nodes),
        edges: cleanEdgesForExport(edges),
        metadata: {
          name: currentTitle,
          created: now.toISOString(),
          version: '1.0',
        },
      };

      const dataStr = JSON.stringify(diagramData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(dataBlob);
      
      // Crear nombre de archivo con título + fecha
      const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
      
      // Limpiar título para usar como nombre de archivo
      const cleanTitle = currentTitle
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remover caracteres especiales
        .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
        .toLowerCase();
      
      const link = document.createElement('a');
      const fileName = `${cleanTitle}_${formattedDate}_${formattedTime}.json`;
      link.download = fileName;
      link.href = url;
      link.style.display = 'none';
      
      // Agregar al DOM, hacer click y remover
      document.body.appendChild(link);
      
      // Usar setTimeout para asegurar que el DOM esté listo
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 0);
      
    } catch (error) {
      console.error('Error al exportar JSON:', error);
      alert('Error al exportar el diagrama. Intenta de nuevo.');
    }
  }, [nodes, edges, cleanNodesForExport, cleanEdgesForExport, diagramTitle]);

  // Usar la prop onExportJSON o la función de fallback
  const exportJSONFunction = onExportJSON || defaultExportJSON;

  // Función para reconstruir iconos basado en el tipo de nodo
  const getIconForNodeType = useCallback((type: string) => {
    switch (type) {
      case 'phase':
        return <Circle className="w-6 h-6" />;
      case 'activity':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'decision':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'process':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  }, []);

  // Función para validar nodos
  const validateNodes = useCallback((nodes: unknown[]): Node[] => {
    return nodes.filter((node: unknown): node is Node => {
      if (typeof node !== 'object' || node === null) return false;
      
      const nodeObj = node as Record<string, unknown>;
      return (
        'id' in nodeObj &&
        'type' in nodeObj &&
        'position' in nodeObj &&
        typeof nodeObj.id === 'string' &&
        typeof nodeObj.type === 'string' &&
        typeof nodeObj.position === 'object' &&
        nodeObj.position !== null &&
        typeof (nodeObj.position as Record<string, unknown>).x === 'number' &&
        typeof (nodeObj.position as Record<string, unknown>).y === 'number'
      );
    }).map(node => {
      const nodeObj = node as Node;
      return {
        ...nodeObj,
        data: {
          ...nodeObj.data,
          icon: nodeObj.data?.icon || getIconForNodeType(nodeObj.type || 'default'), // Reconstruir icono si no existe
        },
        selected: false, // Asegurar que no estén seleccionados
        dragging: false  // Asegurar que no estén en estado de arrastre
      };
    });
  }, [getIconForNodeType]);

  // Función para validar edges
  const validateEdges = useCallback((edges: unknown[]): Edge[] => {
    return edges.filter((edge: unknown): edge is Edge => {
      if (typeof edge !== 'object' || edge === null) return false;
      
      const edgeObj = edge as Record<string, unknown>;
      return (
        'id' in edgeObj &&
        'source' in edgeObj &&
        'target' in edgeObj &&
        typeof edgeObj.id === 'string' &&
        typeof edgeObj.source === 'string' &&
        typeof edgeObj.target === 'string'
      );
    }).map(edge => ({
      ...edge,
      selected: false // Asegurar que no estén seleccionados
    }));
  }, []);

  // Función para importar desde JSON
  const onImportJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          if (!content || content.trim() === '') {
            alert('❌ El archivo está vacío');
            return;
          }
          
          const diagramData = JSON.parse(content);
          
          // Validar que el archivo tenga la estructura correcta
          if (!diagramData || typeof diagramData !== 'object') {
            alert('❌ Formato de archivo inválido. No es un objeto JSON válido.');
            return;
          }
          
          if (!Array.isArray(diagramData.nodes)) {
            alert('❌ Formato de archivo inválido. La propiedad "nodes" debe ser un array.');
            return;
          }
          
          if (!Array.isArray(diagramData.edges)) {
            alert('❌ Formato de archivo inválido. La propiedad "edges" debe ser un array.');
            return;
          }
          
          // Validar y limpiar nodos y edges
          const validNodes = validateNodes(diagramData.nodes);
          const validEdges = validateEdges(diagramData.edges);
          
          
          if (validNodes.length === 0 && validEdges.length === 0) {
            alert('❌ No se encontraron nodos o conexiones válidos en el archivo.');
            return;
          }
          
          // Establecer los datos validados
          setNodes(validNodes);
          setEdges(validEdges);
          saveToHistory(validNodes, validEdges);
          
          const message = `✅ Diagrama importado exitosamente\nNodos: ${validNodes.length}\nConexiones: ${validEdges.length}`;
          alert(message);
          
        } catch (error) {
          console.error('Error al importar:', error);
          alert('❌ Error al importar el archivo. Verifica que sea un archivo JSON válido.');
        }
      };
      
      reader.onerror = () => {
        console.error('Error al leer archivo');
        alert('❌ Error al leer el archivo');
      };
      
      reader.readAsText(file);
    };
    
    // Agregar al DOM temporalmente
    document.body.appendChild(input);
    input.click();
    
    // Limpiar después de un tiempo
    setTimeout(() => {
      if (document.body.contains(input)) {
        document.body.removeChild(input);
      }
    }, 1000);
  }, [setNodes, setEdges, saveToHistory, validateNodes, validateEdges]);

  // Función para cargar plantilla
  const onLoadTemplate = useCallback((templateType: 'empty' | 'workflow' | 'decision') => {
    let templateNodes: Node[] = [];
    let templateEdges: Edge[] = [];

    switch (templateType) {
      case 'empty':
        templateNodes = [];
        templateEdges = [];
        break;
      
      case 'workflow':
        templateNodes = [
          {
            id: 'start',
            type: 'phase',
            position: { x: 250, y: 50 },
            data: {
              label: 'Inicio del Proceso',
              description: 'Punto de inicio del workflow',
              icon: <Circle className="w-6 h-6" />
            },
          },
          {
            id: 'step1',
            type: 'activity',
            position: { x: 250, y: 200 },
            data: {
              label: 'Actividad 1',
              description: 'Primera actividad del proceso',
              icon: <FileText className="w-5 h-5 text-blue-600" />
            },
          },
          {
            id: 'step2',
            type: 'activity',
            position: { x: 250, y: 350 },
            data: {
              label: 'Actividad 2',
              description: 'Segunda actividad del proceso',
              icon: <FileText className="w-5 h-5 text-blue-600" />
            },
          },
          {
            id: 'end',
            type: 'process',
            position: { x: 250, y: 500 },
            data: {
              label: 'Finalizar',
              description: 'Proceso completado',
              icon: <CheckCircle className="w-5 h-5 text-green-600" />
            },
          },
        ];
        
        templateEdges = [
          {
            id: 'e1',
            source: 'start',
            target: 'step1',
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
            style: { stroke: '#3B82F6', strokeWidth: 2 }
          },
          {
            id: 'e2',
            source: 'step1',
            target: 'step2',
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' },
            style: { stroke: '#6B7280', strokeWidth: 2 }
          },
          {
            id: 'e3',
            source: 'step2',
            target: 'end',
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
            style: { stroke: '#10B981', strokeWidth: 2 }
          },
        ];
        break;
      
      case 'decision':
        templateNodes = [
          {
            id: 'start',
            type: 'activity',
            position: { x: 250, y: 50 },
            data: {
              label: 'Inicio',
              description: 'Actividad inicial',
              icon: <FileText className="w-5 h-5 text-blue-600" />
            },
          },
          {
            id: 'decision',
            type: 'decision',
            position: { x: 280, y: 180 },
            data: {
              label: '¿Condición?',
              icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />
            },
          },
          {
            id: 'yes',
            type: 'process',
            position: { x: 100, y: 350 },
            data: {
              label: 'Opción Sí',
              description: 'Camino afirmativo',
              icon: <CheckCircle className="w-5 h-5 text-green-600" />
            },
          },
          {
            id: 'no',
            type: 'process',
            position: { x: 400, y: 350 },
            data: {
              label: 'Opción No',
              description: 'Camino negativo',
              icon: <X className="w-5 h-5 text-red-600" />
            },
          },
        ];
        
        templateEdges = [
          {
            id: 'e1',
            source: 'start',
            target: 'decision',
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' },
            style: { stroke: '#6B7280', strokeWidth: 2 }
          },
          {
            id: 'e2',
            source: 'decision',
            target: 'yes',
            type: 'smoothstep',
            label: 'Sí',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
            style: { stroke: '#10B981', strokeWidth: 2 },
            labelStyle: { fill: '#10B981', fontWeight: 600 }
          },
          {
            id: 'e3',
            source: 'decision',
            target: 'no',
            type: 'smoothstep',
            label: 'No',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
            style: { stroke: '#EF4444', strokeWidth: 2 },
            labelStyle: { fill: '#EF4444', fontWeight: 600 }
          },
        ];
        break;
    }

    setNodes(templateNodes);
    setEdges(templateEdges);
    saveToHistory(templateNodes, templateEdges);
    setShowTemplates(false);
    setNodeIdCounter(1000);
  }, [setNodes, setEdges, saveToHistory]);

  // Función para exportar el diagrama como PNG
  const onExportPNG = useCallback(() => {
    const reactFlowViewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    
    if (!reactFlowViewport) return;

    const nodesBounds = getNodesBounds(getNodes());
    const imageWidth = nodesBounds.width + 100;
    const imageHeight = nodesBounds.height + 100;

    toPng(reactFlowViewport, {
      backgroundColor: '#ffffff',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${-nodesBounds.x + 50}px, ${-nodesBounds.y + 50}px)`,
      },
      pixelRatio: 2,
    }).then((dataUrl) => {
      const now = new Date();
      const currentTitle = diagramTitle || 'Diagrama';
      
      // Crear nombre de archivo con título + fecha
      const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
      
      // Limpiar título para usar como nombre de archivo
      const cleanTitle = currentTitle
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remover caracteres especiales
        .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
        .toLowerCase();
      
      const link = document.createElement('a');
      link.download = `${cleanTitle}_${formattedDate}_${formattedTime}.png`;
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('Error al exportar PNG:', err);
    });
  }, [getNodes, diagramTitle]);

  // Función para exportar el diagrama como SVG
  const onExportSVG = useCallback(() => {
    const reactFlowViewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    
    if (!reactFlowViewport) return;

    const nodesBounds = getNodesBounds(getNodes());
    const imageWidth = nodesBounds.width + 100;
    const imageHeight = nodesBounds.height + 100;

    toSvg(reactFlowViewport, {
      backgroundColor: '#ffffff',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${-nodesBounds.x + 50}px, ${-nodesBounds.y + 50}px)`,
      },
    }).then((dataUrl) => {
      const now = new Date();
      const currentTitle = diagramTitle || 'Diagrama';
      
      // Crear nombre de archivo con título + fecha
      const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
      
      // Limpiar título para usar como nombre de archivo
      const cleanTitle = currentTitle
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remover caracteres especiales
        .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
        .toLowerCase();
      
      const link = document.createElement('a');
      link.download = `${cleanTitle}_${formattedDate}_${formattedTime}.svg`;
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('Error al exportar SVG:', err);
    });
  }, [getNodes, diagramTitle]);

  // Función para seleccionar todos los nodos
  const onSelectAll = useCallback(() => {
    const updatedNodes = nodes.map(node => ({
      ...node,
      selected: true,
    }));
    setNodes(updatedNodes);
  }, [nodes, setNodes]);

  // Función para manejar el pegado de JSON
  const handlePasteJSON = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      
      // Verificar si el texto parece ser JSON
      if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
        const jsonData = JSON.parse(text);
        
        // Verificar si tiene la estructura esperada
        if (jsonData.nodes && jsonData.edges) {
          // Validar y limpiar los nodos
          const validNodes = validateNodes(jsonData.nodes);
          const validEdges = validateEdges(jsonData.edges);
          
          if (validNodes.length > 0 || validEdges.length > 0) {
            // Guardar en el historial antes del cambio
            saveToHistory(nodes, edges);
            
            // Aplicar los datos
            setNodes(validNodes);
            setEdges(validEdges);
            
            // Mostrar notificación de éxito
            alert(`✅ JSON importado exitosamente: ${validNodes.length} nodos, ${validEdges.length} conexiones`);
          } else {
            alert('⚠️ El JSON no contiene nodos o conexiones válidos');
          }
        } else {
          alert('⚠️ El JSON no tiene la estructura correcta. Debe contener "nodes" y "edges"');
        }
      } else {
        alert('⚠️ El contenido del portapapeles no parece ser un JSON válido');
      }
    } catch (error) {
      console.error('Error al procesar JSON:', error);
      alert('❌ Error al procesar el JSON. Verifica que sea válido y tenga la estructura correcta');
    }
  }, [nodes, edges, setNodes, setEdges, saveToHistory, validateNodes, validateEdges]);

  // Manejar teclas de atajo
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Si el modal de edición de nodo está abierto, manejar sus teclas
    if (editingNode) {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleSaveEdit();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleCancelEdit();
      }
      return;
    }

    // Si el modal de edición de edge está abierto, manejar sus teclas
    if (editingEdge) {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleSaveEdgeEdit();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleCancelEdgeEdit();
      }
      return;
    }

    // Teclas de atajo normales
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      onSelectAll();
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo();
    } else if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
      event.preventDefault();
      redo();
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
      event.preventDefault();
      onCopy();
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
      event.preventDefault();
      // Intentar pegar JSON primero, si falla usar el pegado normal
      handlePasteJSON().catch(() => onPaste());
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
      event.preventDefault();
      onDuplicate();
    } else if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (onManualSave) {
        onManualSave();
      } else {
        exportJSONFunction();
      }
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      onDelete();
    } else if (event.key === 'Escape') {
      setToolMode('select');
    }
  }, [undo, redo, onDelete, editingNode, editingEdge, handleSaveEdit, handleCancelEdit, handleSaveEdgeEdit, handleCancelEdgeEdit, onCopy, onPaste, onDuplicate, exportJSONFunction, onSelectAll, handlePasteJSON]);

  // Función para ordenar nodos automáticamente con algoritmo inteligente
  const autoArrangeNodes = useCallback(() => {
    if (nodes.length === 0) return;

    // Guardar en el historial antes del cambio
    saveToHistory(nodes, edges);

    // 1. Análisis de conectividad y niveles
    const nodeMap = new Map(nodes.map(node => [node.id, { ...node, level: -1, incoming: 0, outgoing: 0, position: node.position || { x: 0, y: 0 } }]));
    
    // Algoritmo de layout jerárquico mejorado (inspirado en n8n)
    const layoutNodes = () => {
      
      // Calcular conexiones entrantes y salientes
      edges.forEach(edge => {
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
        if (sourceNode) sourceNode.outgoing++;
        if (targetNode) targetNode.incoming++;
      });

      // 2. Determinar niveles jerárquicos (BFS desde nodos sin entrada)
      const queue = Array.from(nodeMap.values()).filter(node => node.incoming === 0);
      let level = 0;
      
      while (queue.length > 0) {
        const currentLevel = queue.splice(0, queue.length);
        currentLevel.forEach(node => {
          node.level = level;
          
          // Agregar nodos conectados al siguiente nivel
          const connectedEdges = edges.filter(edge => edge.source === node.id);
          connectedEdges.forEach(edge => {
            const connectedNode = nodeMap.get(edge.target);
            if (connectedNode && connectedNode.level === -1 && !queue.includes(connectedNode)) {
              queue.push(connectedNode);
            }
          });
        });
        level++;
      }

      // 3. Asignar niveles a nodos no conectados
      Array.from(nodeMap.values()).forEach(node => {
        if (node.level === -1) {
          node.level = level++;
        }
      });

      // 4. Configuración de layout HORIZONTAL (izquierda a derecha)
      const levelWidth = 350;  // Espacio horizontal entre columnas
      const nodeHeight = 150;  // Espacio vertical entre nodos
      const startX = 100;

      // 5. Posicionamiento HORIZONTAL con centrado óptimo (izquierda → derecha)
      const updatedNodes = nodes.map(node => {
        const nodeData = nodeMap.get(node.id);
        if (!nodeData) return node;
        
        const level = nodeData.level;
        
        // Contar nodos en el mismo nivel (columna vertical)
        const nodesInLevel = Array.from(nodeMap.values()).filter(n => n.level === level);
        const nodeIndex = nodesInLevel.findIndex(n => n.id === node.id);
        const totalNodesInLevel = nodesInLevel.length;
        
        // Calcular posición X (columna según el nivel) - HORIZONTAL
        const levelCenterX = startX + (level * levelWidth);
        
        // Calcular centro del canvas vertical
        const canvasVerticalCenter = 400;
        
        // Calcular altura total del nivel para centrar verticalmente
        const totalHeight = (totalNodesInLevel - 1) * nodeHeight;
        const levelStartY = canvasVerticalCenter - (totalHeight / 2);
        
        let newPosition;
        
        // Intentar alinear hijos con sus padres para líneas más rectas HORIZONTAL
        const parentEdges = edges.filter(edge => edge.target === node.id);
        
        if (parentEdges.length === 1) {
          // Si tiene un solo padre, intentar alinearse con él verticalmente
          const parentNode = nodeMap.get(parentEdges[0].source);
          if (parentNode && parentNode.position) {
            newPosition = {
              x: levelCenterX,
              y: parentNode.position.y  // Misma altura Y que el padre
            };
          } else {
            // Centrado por defecto
            newPosition = {
              x: levelCenterX,
              y: levelStartY + (nodeIndex * nodeHeight)
            };
          }
        } else if (parentEdges.length > 1) {
          // Si tiene múltiples padres, posicionarse en el centro vertical de ellos
          const parentPositions = parentEdges
            .map(edge => nodeMap.get(edge.source))
            .filter(parent => parent && parent.position)
            .map(parent => parent!.position.y);  // Usar Y en lugar de X
          
          if (parentPositions.length > 0) {
            const avgParentY = parentPositions.reduce((a, b) => a + b, 0) / parentPositions.length;
            newPosition = {
              x: levelCenterX,
              y: avgParentY
            };
          } else {
            newPosition = {
              x: levelCenterX,
              y: levelStartY + (nodeIndex * nodeHeight)
            };
          }
        } else {
          // Sin padres, usar distribución centrada verticalmente
          newPosition = {
            x: levelCenterX,
            y: levelStartY + (nodeIndex * nodeHeight)
          };
        }

        // 6. Aplicar espaciado mínimo y evitar superposiciones VERTICAL
        const minDistance = 120;
        const finalPosition = { ...newPosition };
        
        // Verificar superposiciones con otros nodos del mismo nivel (columna)
        const nodesInLevelWithPositions = Array.from(nodeMap.values())
          .filter(n => n.id !== node.id && n.level === level && n.position);
        
        nodesInLevelWithPositions.forEach(nearby => {
          const distance = Math.sqrt(
            Math.pow(finalPosition.x - nearby.position.x, 2) + 
            Math.pow(finalPosition.y - nearby.position.y, 2)
          );
          
          if (distance < minDistance) {
            // Mover VERTICALMENTE para evitar superposición
            const direction = finalPosition.y >= nearby.position.y ? 1 : -1;
            finalPosition.y += direction * (minDistance - distance);
          }
        });
        
        // Actualizar posición en el mapa para siguientes iteraciones
        nodeData.position = finalPosition;

        return {
          ...node,
          position: finalPosition
        };
      });

      return updatedNodes;
    };

    // Aplicar el layout
    const arrangedNodes = layoutNodes();
    setNodes(arrangedNodes);
    
    // Mostrar notificación de éxito
    const maxLevel = Math.max(...Array.from(nodeMap.values()).map(n => n.level));
    alert(`✅ Nodos organizados automáticamente: ${nodes.length} nodos en ${maxLevel + 1} niveles`);
    
  }, [nodes, edges, setNodes, saveToHistory]);

  // Obtener el estilo del cursor según el modo de herramienta
  const getCursorStyle = () => {
    switch (toolMode) {
      case 'phase':
      case 'activity':
      case 'decision':
      case 'process':
        return 'crosshair';
      case 'delete':
        return 'not-allowed';
      case 'select':
      default:
        return 'default';
    }
  };

  // Usar nodos y edges iniciales de las props, o canvas en blanco
  const defaultInitialEdges: Edge[] = useMemo(() => initialEdges || [], [initialEdges]);

  // Inicializar nodos y edges usando useMemo para evitar bucles infinitos
  const cleanedInitialNodes = useMemo(() => {
    return (initialNodes || []).map(node => ({
      ...node,
      data: {
        ...node.data,
        icon: null, // Remover iconos React para evitar problemas de renderizado
      }
    }));
  }, [initialNodes]);

  const cleanedInitialEdges = useMemo(() => {
    return initialEdges || [];
  }, [initialEdges]);

  // Inicializar el estado solo una vez
  React.useEffect(() => {
    setNodes(cleanedInitialNodes);
    setEdges(cleanedInitialEdges);
    
    // Guardar estado inicial en el historial
    const initialState = { nodes: cleanedInitialNodes, edges: cleanedInitialEdges };
    setHistory([initialState]);
    setHistoryIndex(0);
    
    // Notificar al componente padre sobre los datos iniciales
    if (onDiagramChange) {
      onDiagramChange(cleanedInitialNodes, cleanedInitialEdges);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // SOLO al montar el componente

  // Función auxiliar para comparar nodos y edges sin referencias circulares
  const compareStates = useCallback((state1: Node[] | Edge[], state2: Node[] | Edge[]) => {
    if (state1.length !== state2.length) return false;
    
    return state1.every((item1, index) => {
      const item2 = state2[index];
      if (!item2) return false;
      
      // Comparar propiedades esenciales sin referencias circulares
      const keys1 = Object.keys(item1).filter(key => 
        key !== 'dragging' && 
        key !== 'selected' && 
        key !== 'data' && 
        key !== 'style' &&
        key !== 'markerEnd' &&
        key !== 'markerStart'
      );
      
      return keys1.every(key => {
        if (key === 'position' && 'position' in item1 && 'position' in item2) {
          return item1.position.x === item2.position.x && item1.position.y === item2.position.y;
        }
        if ((key === 'sourcePosition' || key === 'targetPosition') && 
            key in item1 && key in item2) {
          return (item1 as Record<string, unknown>)[key] === (item2 as Record<string, unknown>)[key];
        }
        return (item1 as Record<string, unknown>)[key] === (item2 as Record<string, unknown>)[key];
      });
    });
  }, []);

  // Notificar cambios al componente padre
  React.useEffect(() => {
    if (onDiagramChange) {
      onDiagramChange(nodes, edges);
    }
  }, [nodes, edges, onDiagramChange]);

  // Guardar estado en historial cuando cambian los nodos o edges (excepto en undo/redo)
  React.useEffect(() => {
    if (!isUndoRedoOperation && history.length > 0) {
      const currentState = history[historyIndex];
      const hasChanged = !currentState || 
        currentState.nodes.length !== nodes.length || 
        currentState.edges.length !== edges.length ||
        !compareStates(currentState.nodes, nodes) ||
        !compareStates(currentState.edges, edges);
      
      if (hasChanged) {
        const timeoutId = setTimeout(() => {
          saveToHistory(nodes, edges);
        }, 300); // Debounce para evitar guardar demasiado frecuentemente
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [nodes, edges, historyIndex, isUndoRedoOperation, history, saveToHistory, compareStates]);

  return (
    <div className="w-full h-screen">
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
              
              {/* Título editable del diagrama (donde antes estaba el ID) */}
              {isEditingTitle ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={() => {
                      if (tempTitle.trim() && onTitleChange) {
                        onTitleChange(tempTitle.trim());
                      } else {
                        setIsEditingTitle(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tempTitle.trim() && onTitleChange) {
                        onTitleChange(tempTitle.trim());
                      } else if (e.key === 'Escape') {
                        setIsEditingTitle(false);
                      }
                    }}
                    autoFocus
                    className="px-2 py-1 bg-white border-2 border-blue-500 rounded text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300 min-w-[200px]"
                    placeholder="Nombre del diagrama"
                  />
                  <button
                    onClick={() => setIsEditingTitle(false)}
                    className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Cancelar"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    if (onTitleChange) {
                      setTempTitle(diagramTitle);
                      setIsEditingTitle(true);
                    }
                  }}
                  className={`mt-1 group flex items-center gap-1 ${onTitleChange ? 'cursor-pointer' : ''}`}
                  title={onTitleChange ? "Click para editar" : ""}
                >
                  <p className="text-xs text-gray-400 font-mono">
                    {diagramTitle}
                  </p>
                  {onTitleChange && (
                    <svg className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
              )}
          </div>
        </div>
        
          {/* Elementos del lado derecho */}
          <div className="flex items-center space-x-4">
            {/* Atajo de teclado */}
            {onManualSave && (
              <div className="text-sm text-gray-600">
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">
                  {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+S
                </kbd>
                <span className="ml-2">para guardar</span>
              </div>
            )}

            {/* Estado de guardado */}
            {saveStatus && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  saveStatus === 'saving' ? 'bg-blue-500 animate-pulse' :
                  saveStatus === 'saved' ? 'bg-green-500' :
                  saveStatus === 'error' ? 'bg-red-500' :
                  'bg-orange-500'
                }`}></div>
                <span className={`text-sm font-medium ${saveStatusColor || 'text-gray-600'}`}>
                  {saveStatusText || 'Sin guardar'}
                </span>
              </div>
            )}

            {/* Botón Dashboard */}
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-lg shadow-sm border border-gray-200 transition-all flex items-center gap-2"
              title="Ver mis diagramas"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Mis Diagramas
            </button>

            {/* Botón Cerrar Sesión */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg shadow-sm border border-red-400 transition-all flex items-center gap-2"
                title="Cerrar sesión"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            )}

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
      <div 
        className="h-[calc(100vh-6rem)] relative" 
        onKeyDown={onKeyDown} 
        tabIndex={0}
        style={{ cursor: getCursorStyle() }}
        onClick={(event) => {
          // Solo procesar si el click es en el div contenedor, no en elementos hijos
          if (event.target === event.currentTarget) {
            onPaneClick(event);
          }
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={onPaneClick}
          onClick={(event) => {
            // Solo procesar si es un click en el canvas (no en nodos)
            if (event.target === event.currentTarget || (event.target as HTMLElement).classList.contains('react-flow__pane')) {
              onPaneClick(event);
            }
          }}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{
            type: 'smoothstep',
            markerEnd: { 
              type: MarkerType.ArrowClosed, 
              color: '#6B7280',
              width: 12,
              height: 12
            },
            style: { 
              strokeWidth: 2, 
              stroke: '#6B7280',
              strokeLinecap: 'round'
            },
            animated: false
          }}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          selectNodesOnDrag={false}
          panOnDrag={toolMode === 'select'}
          nodesFocusable={false}
          zoomOnScroll={true}
          panOnScroll={false}
          preventScrolling={false}
          minZoom={0.1}
          maxZoom={2}
          deleteKeyCode={null}
          multiSelectionKeyCode={['Meta', 'Control']}
          selectionKeyCode={null}
          selectionMode={SelectionMode.Partial}
        >
          <Controls 
            showInteractive={true}
            showFitView={true}
            showZoom={true}
            position="bottom-left"
            className="!shadow-2xl !rounded-xl !border-2 !border-gray-200/50 backdrop-blur-sm"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
          />
          
          {/* MiniMap - Posición inferior derecha */}
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case 'phase':
                  return '#3B82F6';
                case 'activity':
                  return '#8B5CF6';
                case 'decision':
                  return '#F59E0B';
                case 'process':
                  return '#10B981';
                default:
                  return '#6B7280';
              }
            }}
            nodeBorderRadius={8}
            position="bottom-right"
            className="!shadow-2xl !rounded-2xl !border-2 !border-gray-200/50 backdrop-blur-sm"
            style={{ 
              marginBottom: '12px', 
              marginRight: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
            maskColor="rgba(59, 130, 246, 0.05)"
          />
          
          {/* Panel de Herramientas - Izquierda */}
          <Panel position="top-left" className="bg-white rounded-lg shadow-lg p-3 space-y-2">
            <div className="text-xs text-gray-600 mb-2 font-medium text-center">Agregar Elementos</div>
            
            {/* Botón Templates */}
            <button
              onClick={() => setShowTemplates(true)}
              className="w-full px-3 py-2 rounded transition-colors text-sm font-medium flex items-center gap-2 bg-purple-100 text-purple-700 hover:bg-purple-200"
              title="Cargar Plantilla"
            >
              <FileText className="w-4 h-4" />
              📋 Plantillas
            </button>

            <div className="border-t border-gray-200 my-2"></div>

            {/* Botón Seleccionar/Mover */}
            <button
              onClick={() => setToolMode('select')}
              className={`w-full px-3 py-2 rounded transition-colors text-sm font-medium flex items-center gap-2 ${
                toolMode === 'select' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Seleccionar y Mover (Esc)"
            >
              <MousePointer className="w-4 h-4" />
              Seleccionar
            </button>


            <div className="border-t border-gray-200 my-2"></div>
            <div className="text-xs text-gray-500 mb-1">Tipos de Nodos:</div>

            {/* Botón Agregar Fase */}
            <button
              onClick={() => setToolMode('phase')}
              className={`w-full px-3 py-2 rounded transition-colors text-sm font-medium flex items-center gap-2 ${
                toolMode === 'phase' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
              title="Agregar Fase"
            >
              <Hexagon className="w-4 h-4" />
              Fase
            </button>

            {/* Botón Agregar Actividad */}
            <button
              onClick={() => setToolMode('activity')}
              className={`w-full px-3 py-2 rounded transition-colors text-sm font-medium flex items-center gap-2 ${
                toolMode === 'activity' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              title="Agregar Actividad"
            >
              <Square className="w-4 h-4" />
              Actividad
            </button>

            {/* Botón Agregar Decisión */}
            <button
              onClick={() => setToolMode('decision')}
              className={`w-full px-3 py-2 rounded transition-colors text-sm font-medium flex items-center gap-2 ${
                toolMode === 'decision' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
              title="Agregar Decisión"
            >
              <Diamond className="w-4 h-4" />
              Decisión
            </button>

            {/* Botón Agregar Proceso */}
            <button
              onClick={() => setToolMode('process')}
              className={`w-full px-3 py-2 rounded transition-colors text-sm font-medium flex items-center gap-2 ${
                toolMode === 'process' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
              title="Agregar Proceso"
            >
              <Circle className="w-4 h-4" />
              Proceso
            </button>

            <div className="border-t border-gray-200 my-2"></div>

            {/* Botón Ordenar */}
            <button
              onClick={autoArrangeNodes}
              className="w-full px-3 py-2 rounded transition-colors text-sm font-medium flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100"
              title="Ordenar nodos automáticamente (simétrico)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Ordenar
            </button>

            {/* Botón Eliminar */}
            <button
              onClick={() => setToolMode('delete')}
              className={`w-full px-3 py-2 rounded transition-colors text-sm font-medium flex items-center gap-2 ${
                toolMode === 'delete' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
              title="Modo Eliminar"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>

            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
              <div className="mb-1 font-medium">Instrucciones:</div>
              <div>• Selecciona herramienta</div>
              <div>• Click en canvas para crear</div>
              <div>• Ctrl/Cmd+Click: Multi-selección</div>
              <div>• Doble click para editar</div>
              <div>• Conecta nodos por handles</div>
              <div>• Esc para volver a selección</div>
            </div>
          </Panel>

          <Panel position="top-right" className="bg-white rounded-lg shadow-lg p-3 space-y-2">
            <div className="text-xs text-gray-600 mb-2 font-medium">Herramientas de Edición</div>
            <div className="text-xs text-gray-600 mb-2 font-medium">Archivo</div>

            {/* Botón de Guardar */}
            <button
              onClick={onManualSave || exportJSONFunction}
              disabled={isSaving}
              className={`w-full px-3 py-2 text-white rounded transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                isSaving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              title={onManualSave ? "Guardar diagrama en Supabase (Ctrl+S)" : "Guardar diagrama como JSON (Ctrl+S)"}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
              <Save className="w-4 h-4" />
              Guardar
                </>
              )}
            </button>

            <div className="border-t border-gray-200 my-2"></div>
            <div className="text-xs text-gray-600 mb-2 font-medium">Exportar/Importar</div>

            {/* Botón de Exportar PNG */}
            <button
              onClick={onExportPNG}
              className="w-full px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs font-medium flex items-center justify-center gap-2"
              title="Exportar como PNG"
            >
              <Download className="w-3 h-3" />
              PNG
            </button>

            {/* Botón de Exportar SVG */}
            <button
              onClick={onExportSVG}
              className="w-full px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs font-medium flex items-center justify-center gap-2"
              title="Exportar como SVG"
            >
              <Download className="w-3 h-3" />
              SVG
            </button>

            {/* Botones de JSON */}
            <div className="flex space-x-1">
              <button
                onClick={exportJSONFunction}
                className="flex-1 px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                title="Exportar JSON"
              >
                <FileJson className="w-3 h-3" />
                Exportar
              </button>
              <button
                onClick={onImportJSON}
                className="flex-1 px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                title="Importar JSON"
              >
                <Upload className="w-3 h-3" />
                Importar
              </button>
            </div>

            <div className="border-t border-gray-200 my-2"></div>
            <div className="text-xs text-gray-600 mb-2 font-medium">Edición</div>

            {/* Botones Copy/Paste/Duplicate */}
            <div className="flex space-x-1">
              <button
                onClick={onCopy}
                disabled={!nodes.some(node => node.selected)}
                className="flex-1 px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                title="Copiar (Ctrl+C)"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button
                onClick={onPaste}
                disabled={clipboard.length === 0}
                className="flex-1 px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                title="Pegar (Ctrl+V)"
              >
                📋
              </button>
              <button
                onClick={onDuplicate}
                disabled={!nodes.some(node => node.selected)}
                className="flex-1 px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                title="Duplicar (Ctrl+D)"
              >
                2x
              </button>
            </div>

            {/* Botón de Eliminar */}
            <button
              onClick={onDelete}
              className="w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!nodes.some(node => node.selected) && !edges.some(edge => edge.selected)}
            >
              🗑️ Eliminar
            </button>
            
            <div className="text-xs text-gray-500 mt-2">
              <div className="font-medium mb-1">Atajos de Teclado:</div>
              <div>• Ctrl+A: Seleccionar todo</div>
              <div>• Ctrl+S: Guardar JSON</div>
              <div>• Ctrl+C/V/D: Copy/Paste/Duplicar</div>
              <div>• Ctrl+Z/Y: Deshacer/Rehacer</div>
              <div>• Delete: Eliminar selección</div>
              <div>• Doble click: Editar texto</div>
              <div>• Esc: Modo selección</div>
            </div>
          </Panel>
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={24} 
            size={1}
            color="#E5E7EB"
            className="opacity-50"
          />
        </ReactFlow>

        {/* Modal de Plantillas */}
        {showTemplates && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📋 Selecciona una Plantilla
              </h2>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Plantilla Vacía */}
                <button
                  onClick={() => onLoadTemplate('empty')}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="text-4xl mb-3">📄</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Vacío</h3>
                  <p className="text-xs text-gray-600">Comenzar desde cero con un lienzo en blanco</p>
                </button>

                {/* Plantilla Workflow */}
                <button
                  onClick={() => onLoadTemplate('workflow')}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Workflow Básico</h3>
                  <p className="text-xs text-gray-600">Proceso lineal con inicio, actividades y fin</p>
                </button>

                {/* Plantilla Decisión */}
                <button
                  onClick={() => onLoadTemplate('decision')}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="text-4xl mb-3">🔀</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Árbol de Decisión</h3>
                  <p className="text-xs text-gray-600">Diagrama con punto de decisión y bifurcaciones</p>
                </button>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTemplates(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edición */}
        {editingNode && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Editar {editingNode.type === 'phase' ? 'Fase' : 
                        editingNode.type === 'activity' ? 'Actividad' :
                        editingNode.type === 'decision' ? 'Decisión' : 'Proceso'}
              </h2>
              
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Columna Izquierda - Contenido y Colores */}
                  <div className="space-y-6">
                    {/* Título y Descripción */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Título del nodo"
                    autoFocus
                  />
                </div>

                {editingNode.type !== 'decision' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Descripción del nodo"
                      rows={3}
                    />
                  </div>
                )}
              </div>

                    {/* Colores */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color del nodo
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={editColor}
                            onChange={(e) => setEditColor(e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={editColor}
                              onChange={(e) => setEditColor(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                              placeholder="#3B82F6"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color del texto
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={editTextColor}
                            onChange={(e) => setEditTextColor(e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={editTextColor}
                              onChange={(e) => setEditTextColor(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                              placeholder="#FFFFFF"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha - Tipo, Tamaño y Vista Previa */}
                  <div className="space-y-6">
                    {/* Tipo de nodo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tipo de nodo
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            if (editingNode) {
                              const newNode = { ...editingNode, type: 'phase' as const };
                              setEditingNode(newNode);
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            editingNode?.type === 'phase' 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-blue-500 rounded"></div>
                            <div>
                              <div className="font-medium text-sm">Fase</div>
                              <div className="text-xs opacity-75">Principal</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            if (editingNode) {
                              const newNode = { ...editingNode, type: 'activity' as const };
                              setEditingNode(newNode);
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            editingNode?.type === 'activity' 
                              ? 'border-gray-500 bg-gray-50 text-gray-700' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-gray-500 rounded"></div>
                            <div>
                              <div className="font-medium text-sm">Actividad</div>
                              <div className="text-xs opacity-75">Tarea</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            if (editingNode) {
                              const newNode = { ...editingNode, type: 'decision' as const };
                              setEditingNode(newNode);
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            editingNode?.type === 'decision' 
                              ? 'border-yellow-500 bg-yellow-50 text-yellow-700' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
                            <div>
                              <div className="font-medium text-sm">Decisión</div>
                              <div className="text-xs opacity-75">Bifurcación</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            if (editingNode) {
                              const newNode = { ...editingNode, type: 'process' as const };
                              setEditingNode(newNode);
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            editingNode?.type === 'process' 
                              ? 'border-green-500 bg-green-50 text-green-700' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-green-500 rounded"></div>
                            <div>
                              <div className="font-medium text-sm">Proceso</div>
                              <div className="text-xs opacity-75">Final</div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Tamaño del nodo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tamaño del nodo
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setEditSize('small')}
                          className={`p-2 rounded-lg border-2 transition-all text-left ${
                            editSize === 'small' 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-3 bg-gray-400 rounded"></div>
                            <div>
                              <div className="font-medium text-xs">Pequeño</div>
                              <div className="text-xs opacity-75">Compacto</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setEditSize('medium')}
                          className={`p-2 rounded-lg border-2 transition-all text-left ${
                            editSize === 'medium' 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-4 bg-gray-400 rounded"></div>
                            <div>
                              <div className="font-medium text-xs">Mediano</div>
                              <div className="text-xs opacity-75">Estándar</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setEditSize('large')}
                          className={`p-2 rounded-lg border-2 transition-all text-left ${
                            editSize === 'large' 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-5 bg-gray-400 rounded"></div>
                            <div>
                              <div className="font-medium text-xs">Grande</div>
                              <div className="text-xs opacity-75">Prominente</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setEditSize('xlarge')}
                          className={`p-2 rounded-lg border-2 transition-all text-left ${
                            editSize === 'xlarge' 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-6 bg-gray-400 rounded"></div>
                            <div>
                              <div className="font-medium text-xs">Extra Grande</div>
                              <div className="text-xs opacity-75">Destacado</div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Vista previa */}
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <div className="text-sm text-gray-600 mb-3 font-medium">Vista previa del nodo:</div>
                      
                      <div className="mb-4 flex justify-center">
                        <div 
                          className={`relative border-2 shadow-sm flex items-center justify-center ${
                            editingNode?.type === 'phase' ? 'rounded-xl' :
                            editingNode?.type === 'decision' ? 'rounded-full' :
                            'rounded-lg'
                          } ${
                            editSize === 'small' ? (
                              editingNode?.type === 'phase' ? 'min-w-[80px] h-12' :
                              editingNode?.type === 'decision' ? 'w-12 h-12' :
                              'min-w-[60px] h-10'
                            ) :
                            editSize === 'medium' ? (
                              editingNode?.type === 'phase' ? 'min-w-[100px] h-14' :
                              editingNode?.type === 'decision' ? 'w-14 h-14' :
                              'min-w-[80px] h-12'
                            ) :
                            editSize === 'large' ? (
                              editingNode?.type === 'phase' ? 'min-w-[120px] h-16' :
                              editingNode?.type === 'decision' ? 'w-16 h-16' :
                              'min-w-[100px] h-14'
                            ) :
                            editSize === 'xlarge' ? (
                              editingNode?.type === 'phase' ? 'min-w-[140px] h-18' :
                              editingNode?.type === 'decision' ? 'w-18 h-18' :
                              'min-w-[120px] h-16'
                            ) :
                            'min-w-[80px] h-12'
                          } p-2`}
                          style={{ 
                            backgroundColor: editColor,
                            borderColor: editColor,
                            color: editTextColor 
                          }}
                        >
                          <div className="text-center">
                            <div className={`font-bold ${
                              editSize === 'small' ? 'text-xs' :
                              editSize === 'medium' ? 'text-sm' :
                              editSize === 'large' ? 'text-base' :
                              editSize === 'xlarge' ? 'text-lg' :
                              'text-sm'
                            }`}>
                              {editingNode?.type === 'phase' && 'FASE'}
                              {editingNode?.type === 'activity' && 'ACT'}
                              {editingNode?.type === 'decision' && '?'}
                              {editingNode?.type === 'process' && '✓'}
                            </div>
                            {editingNode?.type === 'phase' && editSize !== 'small' && (
                              <div className="text-xs opacity-75">Principal</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-16 h-2 rounded-full"
                            style={{ backgroundColor: editColor }}
                          ></div>
                          <span className="text-xs text-gray-600">Color de fondo</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-16 h-2 rounded-full"
                            style={{ backgroundColor: editTextColor }}
                          ></div>
                          <span className="text-xs text-gray-600">Color de texto</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-4 text-center">
                    Presiona <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+Enter</kbd> para guardar o <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Esc</kbd> para cancelar
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCancelEdit}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                      Guardar Cambios
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edición de Conexión */}
        {editingEdge && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                ✏️ Editar Etiqueta de Conexión
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto de la etiqueta
                  </label>
                  <input
                    type="text"
                    value={editEdgeLabel}
                    onChange={(e) => setEditEdgeLabel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Sí, No, Siguiente, etc."
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Deja vacío para no mostrar etiqueta
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de la conexión
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editEdgeColor}
                      onChange={(e) => setEditEdgeColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={editEdgeColor}
                        onChange={(e) => setEditEdgeColor(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selecciona o escribe un color hexadecimal
                  </p>
                </div>

                {/* Preview del color */}
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600 mb-2">Vista previa:</div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-16 h-1 rounded-full"
                      style={{ backgroundColor: editEdgeColor }}
                    ></div>
                    <span className="text-xs text-gray-600">Color seleccionado</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs text-gray-500 mb-3 text-center">
                  Presiona <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+Enter</kbd> para guardar o <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Esc</kbd> para cancelar
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCancelEdgeEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdgeEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Props para el componente BPMSDiagram
interface BPMSDiagramProps {
  onDiagramChange?: (nodes: any[], edges: any[]) => void;
  initialNodes?: any[];
  initialEdges?: any[];
  saveStatus?: 'saved' | 'saving' | 'error' | 'unsaved';
  saveStatusText?: string;
  saveStatusColor?: string;
  isSaving?: boolean;
  onManualSave?: () => void;
  onExportJSON?: () => void;
  onLogout?: () => void;
  currentDiagramId?: string | null;
  diagramTitle?: string;
  onTitleChange?: (newTitle: string) => void;
}

// Componente principal que envuelve con ReactFlowProvider
export default function BPMSDiagram({ 
  onDiagramChange, 
  initialNodes, 
  initialEdges, 
  saveStatus,
  saveStatusText,
  saveStatusColor,
  isSaving,
  onManualSave,
  onExportJSON,
  onLogout,
  currentDiagramId,
  diagramTitle,
  onTitleChange
}: BPMSDiagramProps = {}) {
  return (
    <ReactFlowProvider>
      <BPMSDiagramInner 
        onDiagramChange={onDiagramChange}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        saveStatus={saveStatus}
        saveStatusText={saveStatusText}
        saveStatusColor={saveStatusColor}
        isSaving={isSaving}
        onManualSave={onManualSave}
        onExportJSON={onExportJSON}
        onLogout={onLogout}
        currentDiagramId={currentDiagramId}
        diagramTitle={diagramTitle}
        onTitleChange={onTitleChange}
      />
    </ReactFlowProvider>
  );
}
