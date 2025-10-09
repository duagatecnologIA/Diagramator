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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toPng, toSvg } from 'html-to-image';
import { 
  Ship, 
  FileText, 
  Shield, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Truck,
  Lock,
  Camera,
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
}

// Definir tipos de nodos personalizados
const nodeTypes: NodeTypes = {
  phase: PhaseNode,
  activity: ActivityNode,
  decision: DecisionNode,
  process: ProcessNode,
};

// Nodo para las fases principales
function PhaseNode({ data }: { data: NodeData }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-xl border-4 border-blue-300 min-w-[400px] text-center relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-300 border-2 border-white"
      />
      <div className="flex items-center justify-center gap-3 mb-3">
        {data.icon}
        <h3 className="text-xl font-bold">{data.label}</h3>
      </div>
      <p className="text-sm text-blue-100">{data.description}</p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-300 border-2 border-white"
      />
    </div>
  );
}

// Nodo para actividades
function ActivityNode({ data }: { data: NodeData }) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-3 shadow-md min-w-[250px] relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <div className="flex items-center gap-2 mb-1">
        {data.icon}
        <h4 className="font-semibold text-gray-800">{data.label}</h4>
      </div>
      <p className="text-sm text-gray-600">{data.description}</p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
}

// Nodo para decisiones
function DecisionNode({ data }: { data: NodeData }) {
  return (
    <div className="bg-yellow-100 border-2 border-yellow-400 rounded-full p-4 shadow-md min-w-[120px] min-h-[120px] flex items-center justify-center relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
      <div className="text-center">
        {data.icon}
        <p className="text-sm font-semibold text-yellow-800 mt-1">{data.label}</p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
    </div>
  );
}

// Nodo para procesos
function ProcessNode({ data }: { data: NodeData }) {
  return (
    <div className="bg-green-100 border-2 border-green-400 rounded-lg p-3 shadow-md min-w-[200px] relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      <div className="flex items-center gap-2 mb-1">
        {data.icon}
        <h4 className="font-semibold text-green-800">{data.label}</h4>
      </div>
      <p className="text-sm text-green-700">{data.description}</p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  );
}

// Componente interno para manejar la lógica del diagrama
function BPMSDiagramInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { deleteElements, getNodes, project } = useReactFlow();

  // Estados para el historial de undo/redo
  const [history, setHistory] = React.useState<{nodes: Node[], edges: Edge[]}[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  
  // Estado para el modo de herramienta actual
  const [toolMode, setToolMode] = React.useState<'select' | 'phase' | 'activity' | 'decision' | 'process' | 'delete'>('select');
  const [nodeIdCounter, setNodeIdCounter] = React.useState(1000);
  
  // Estado para herramientas de conexión - simplificado
  const [connectionType, setConnectionType] = React.useState<'straight' | 'smoothstep' | 'step' | 'bezier'>('smoothstep');
  const [connectionStyle, setConnectionStyle] = React.useState<'default' | 'dashed' | 'dotted' | 'thick'>('default');
  
  // Estado para edición de nodos
  const [editingNode, setEditingNode] = React.useState<Node | null>(null);
  const [editLabel, setEditLabel] = React.useState('');
  const [editDescription, setEditDescription] = React.useState('');
  
  // Estado para edición de conexiones
  const [editingEdge, setEditingEdge] = React.useState<Edge | null>(null);
  const [editEdgeLabel, setEditEdgeLabel] = React.useState('');
  const [editEdgeColor, setEditEdgeColor] = React.useState('#3B82F6');
  
  // Estado para clipboard (copy/paste)
  const [clipboard, setClipboard] = React.useState<Node[]>([]);
  
  // Estado para mostrar modal de templates
  const [showTemplates, setShowTemplates] = React.useState(false);


  // Función para guardar el estado actual en el historial
  const saveToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    const newState = { nodes: [...newNodes], edges: [...newEdges] };
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      return newHistory.slice(-50); // Mantener solo los últimos 50 estados
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

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
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  // Función para rehacer (Ctrl+Y)
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
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
            icon: <Ship className="w-6 h-6" />
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
            icon: <FileText className="w-5 h-5 text-blue-600" />
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
            icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />
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
            icon: <CheckCircle className="w-5 h-5 text-green-600" />
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
  const onPaneClick = useCallback((event: any) => {
    // Solo agregar nodos si no estamos en modo selección o eliminación
    if (toolMode === 'select' || toolMode === 'delete') {
      return;
    }
    
    // Obtener las coordenadas del click
    let clientX, clientY;
    if (event.clientX !== undefined) {
      // Evento estándar
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event.nativeEvent) {
      // Evento React
      clientX = event.nativeEvent.clientX;
      clientY = event.nativeEvent.clientY;
    } else {
      return;
    }
    
    const reactFlowBounds = (event.currentTarget || document.querySelector('.react-flow__pane'))?.getBoundingClientRect();
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
    }
  }, [toolMode]);

  // Guardar cambios de edición
  const handleSaveEdit = useCallback(() => {
    if (!editingNode) return;

    const updatedNodes = nodes.map(node => {
      if (node.id === editingNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            label: editLabel,
            description: editDescription,
          }
        };
      }
      return node;
    });

    saveToHistory(nodes, edges);
    setNodes(updatedNodes);
    setEditingNode(null);
    setEditLabel('');
    setEditDescription('');
  }, [editingNode, editLabel, editDescription, nodes, edges, setNodes, saveToHistory]);

  // Cancelar edición
  const handleCancelEdit = useCallback(() => {
    setEditingNode(null);
    setEditLabel('');
    setEditDescription('');
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

  // Función para guardar diagrama en localStorage
  const onSaveToLocal = useCallback(() => {
    const diagramData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('bpmn-diagram', JSON.stringify(diagramData));
    alert('✅ Diagrama guardado en el navegador');
  }, [nodes, edges]);

  // Función para cargar diagrama desde localStorage
  const onLoadFromLocal = useCallback(() => {
    const saved = localStorage.getItem('bpmn-diagram');
    if (saved) {
      const diagramData = JSON.parse(saved);
      setNodes(diagramData.nodes);
      setEdges(diagramData.edges);
      saveToHistory(diagramData.nodes, diagramData.edges);
      alert('✅ Diagrama cargado desde el navegador');
    } else {
      alert('❌ No hay diagrama guardado');
    }
  }, [setNodes, setEdges, saveToHistory]);

  // Función para exportar como JSON
  const onExportJSON = useCallback(() => {
    const diagramData = {
      nodes,
      edges,
      metadata: {
        name: 'BPMN Diagram',
        created: new Date().toISOString(),
        version: '1.0',
      },
    };

    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = `diagrama-bpmn-${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  // Función para importar desde JSON
  const onImportJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const diagramData = JSON.parse(content);
          
          if (diagramData.nodes && diagramData.edges) {
            setNodes(diagramData.nodes);
            setEdges(diagramData.edges);
            saveToHistory(diagramData.nodes, diagramData.edges);
            alert('✅ Diagrama importado exitosamente');
          } else {
            alert('❌ Formato de archivo inválido');
          }
        } catch (error) {
          alert('❌ Error al importar el archivo');
          console.error('Import error:', error);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }, [setNodes, setEdges, saveToHistory]);

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
              icon: <Ship className="w-6 h-6" />
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
              icon: <Shield className="w-5 h-5 text-blue-600" />
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
      const link = document.createElement('a');
      link.download = `diagrama-bpmn-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('Error al exportar PNG:', err);
    });
  }, [getNodes]);

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
      const link = document.createElement('a');
      link.download = `diagrama-bpmn-${new Date().toISOString().split('T')[0]}.svg`;
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('Error al exportar SVG:', err);
    });
  }, [getNodes]);

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
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
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
      onPaste();
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
      event.preventDefault();
      onDuplicate();
    } else if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      onSaveToLocal();
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      onDelete();
    } else if (event.key === 'Escape') {
      setToolMode('select');
    }
  }, [undo, redo, onDelete, editingNode, editingEdge, handleSaveEdit, handleCancelEdit, handleSaveEdgeEdit, handleCancelEdgeEdit, onCopy, onPaste, onDuplicate, onSaveToLocal]);

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

  // Definir los nodos del diagrama organizados por fases
  const initialNodes: Node[] = useMemo(() => [
    // ========== FASE 1: PRE-ARRIBO ==========
    {
      id: 'phase1',
      type: 'phase',
      position: { x: 400, y: 50 },
      data: {
        label: 'FASE 1: PRE-ARRIBO',
        description: 'Orquestación de declaraciones y validaciones previas',
        icon: <Ship className="w-6 h-6" />
      },
    },
    {
      id: 'activity1-1',
      type: 'activity',
      position: { x: 200, y: 150 },
      data: {
        label: 'Orquestación de la declaración anticipada',
        description: 'PPU recibe y valida declaraciones anticipadas, cruza con manifiestos y listas de carga',
        icon: <FileText className="w-5 h-5 text-blue-600" />
      },
    },
    {
      id: 'activity1-2',
      type: 'activity',
      position: { x: 600, y: 150 },
      data: {
        label: 'Condicionalidad por vistos buenos',
        description: 'Consulta VUCE en tiempo real, aplica reglas de control previo',
        icon: <Shield className="w-5 h-5 text-blue-600" />
      },
    },
    {
      id: 'decision1',
      type: 'decision',
      position: { x: 400, y: 250 },
      data: {
        label: '¿Aprobaciones OK?',
        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />
      },
    },
    {
      id: 'result1',
      type: 'process',
      position: { x: 200, y: 350 },
      data: {
        label: 'Rechazar',
        description: 'No se cumple condicionalidad',
        icon: <X className="w-5 h-5 text-red-600" />
      },
    },
    {
      id: 'result2',
      type: 'process',
      position: { x: 600, y: 350 },
      data: {
        label: 'Continuar',
        description: 'Proceder a fase de arribo',
        icon: <CheckCircle className="w-5 h-5 text-green-600" />
      },
    },

    // ========== FASE 2: ARRIBO ==========
    {
      id: 'phase2',
      type: 'phase',
      position: { x: 400, y: 500 },
      data: {
        label: 'FASE 2: ARRIBO',
        description: 'Selectividad, inspección y verificación de integridad física',
        icon: <Eye className="w-6 h-6" />
      },
    },
    {
      id: 'activity2-1',
      type: 'activity',
      position: { x: 200, y: 600 },
      data: {
        label: 'Selectividad e inspección en muelle',
        description: 'Inspección no intrusiva, registro audiovisual y rayos X',
        icon: <Camera className="w-5 h-5 text-blue-600" />
      },
    },
    {
      id: 'activity2-2',
      type: 'activity',
      position: { x: 600, y: 600 },
      data: {
        label: 'Integridad física de unidades',
        description: 'Lectura de sellos, verificación de dispositivos de seguridad',
        icon: <Lock className="w-5 h-5 text-blue-600" />
      },
    },

    // ========== FASE 3: POST-SELECTIVIDAD ==========
    {
      id: 'phase3',
      type: 'phase',
      position: { x: 400, y: 800 },
      data: {
        label: 'FASE 3: POST-SELECTIVIDAD',
        description: 'Pago, levante, retiro y tránsito aduanero',
        icon: <CheckCircle className="w-6 h-6" />
      },
    },
    {
      id: 'activity3-1',
      type: 'activity',
      position: { x: 200, y: 900 },
      data: {
        label: 'Pago posterior y levante',
        description: 'Habilitación de pagos, consolidación de vistos buenos, emisión de levante',
        icon: <DollarSign className="w-5 h-5 text-blue-600" />
      },
    },
    {
      id: 'activity3-2',
      type: 'activity',
      position: { x: 600, y: 900 },
      data: {
        label: 'Tránsito aduanero',
        description: 'Autorización con número de sello, monitoreo de operación',
        icon: <Truck className="w-5 h-5 text-blue-600" />
      },
    },
  ], []);

  // Definir las conexiones entre nodos organizadas por fases con flechas direccionales
  const initialEdges: Edge[] = useMemo(() => [
    // ========== CONEXIONES FASE 1: PRE-ARRIBO ==========
    { 
      id: 'e1-1', 
      source: 'phase1', 
      target: 'activity1-1', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },
    { 
      id: 'e1-2', 
      source: 'phase1', 
      target: 'activity1-2', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },
    { 
      id: 'e1-3', 
      source: 'activity1-1', 
      target: 'decision1', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' },
      style: { stroke: '#6B7280', strokeWidth: 2 }
    },
    { 
      id: 'e1-4', 
      source: 'activity1-2', 
      target: 'decision1', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' },
      style: { stroke: '#6B7280', strokeWidth: 2 }
    },
    { 
      id: 'e1-5', 
      source: 'decision1', 
      target: 'result1', 
      type: 'smoothstep', 
      label: 'No',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
      style: { stroke: '#EF4444', strokeWidth: 2 },
      labelStyle: { fill: '#EF4444', fontWeight: 600 }
    },
    { 
      id: 'e1-6', 
      source: 'decision1', 
      target: 'result2', 
      type: 'smoothstep', 
      label: 'Sí',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
      style: { stroke: '#10B981', strokeWidth: 2 },
      labelStyle: { fill: '#10B981', fontWeight: 600 }
    },

    // ========== CONEXIONES ENTRE FASES ==========
    { 
      id: 'e2-1', 
      source: 'result2', 
      target: 'phase2', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 3 }
    },

    // ========== CONEXIONES FASE 2: ARRIBO ==========
    { 
      id: 'e2-2', 
      source: 'phase2', 
      target: 'activity2-1', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },
    { 
      id: 'e2-3', 
      source: 'phase2', 
      target: 'activity2-2', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },

    // ========== CONEXIONES ENTRE FASES ==========
    { 
      id: 'e3-1', 
      source: 'activity2-1', 
      target: 'phase3', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' },
      style: { stroke: '#6B7280', strokeWidth: 2 }
    },
    { 
      id: 'e3-2', 
      source: 'activity2-2', 
      target: 'phase3', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' },
      style: { stroke: '#6B7280', strokeWidth: 2 }
    },

    // ========== CONEXIONES FASE 3: POST-SELECTIVIDAD ==========
    { 
      id: 'e3-3', 
      source: 'phase3', 
      target: 'activity3-1', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },
    { 
      id: 'e3-4', 
      source: 'phase3', 
      target: 'activity3-2', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },
  ], []);

  // Inicializar nodos y edges
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    // Guardar estado inicial en el historial
    setHistory([{ nodes: initialNodes, edges: initialEdges }]);
    setHistoryIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar estado en historial cuando cambian los nodos o edges (excepto en undo/redo)
  React.useEffect(() => {
    if (historyIndex === -1 || (history.length > 0 && history[historyIndex]?.nodes !== nodes)) {
      // Solo guardar si no es una operación de undo/redo
      const timeoutId = setTimeout(() => {
        saveToHistory(nodes, edges);
      }, 100); // Debounce para evitar guardar demasiado frecuentemente
      
      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, historyIndex, history, saveToHistory]);

  return (
    <div className="w-full h-screen">
      <div className="h-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-between px-8 shadow-lg border-b border-blue-700/30">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Ship className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
              Diagrama BPMS
            </h1>
            <p className="text-xs text-blue-200 font-medium">
              Proceso Portuario y Aduanero
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1 bg-black/20 px-3 py-2 rounded-lg backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-200 font-medium">Conectado</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              <span className="text-blue-100">Editar</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span className="text-blue-100">Conectar</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span className="text-blue-100">Deshacer</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              <span className="text-blue-100">Zoom</span>
            </div>
          </div>
        </div>
      </div>
      <div 
        className="h-[calc(100vh-5rem)] relative" 
        onKeyDown={onKeyDown} 
        tabIndex={0}
        style={{ cursor: getCursorStyle() }}
        onClick={(event) => {
          // Solo procesar si el click es en el div contenedor, no en elementos hijos
          if (event.target === event.currentTarget) {
            onPaneClick(event as any);
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
              onPaneClick(event as any);
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
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
            style: { strokeWidth: 2, stroke: '#3B82F6' }
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
          multiSelectionKeyCode={['Meta', 'Ctrl']}
          selectionKeyCode={['Meta', 'Ctrl']}
        >
          <Controls 
            showInteractive={true}
            showFitView={true}
            showZoom={true}
          />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case 'phase':
                  return '#2563EB';
                case 'activity':
                  return '#6B7280';
                case 'decision':
                  return '#EAB308';
                case 'process':
                  return '#10B981';
                default:
                  return '#6B7280';
              }
            }}
            nodeBorderRadius={2}
            position="bottom-right"
            className="bg-white border-2 border-gray-300 rounded-lg"
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

            {/* Botón Eliminar */}
            <button
              onClick={() => setToolMode('delete')}
              className={`w-full px-3 py-2 rounded transition-colors text-sm font-medium flex items-center gap-2 ${
                toolMode === 'delete' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
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
              <div>• Doble click para editar</div>
              <div>• Conecta nodos por handles</div>
              <div>• Esc para volver a selección</div>
            </div>
          </Panel>

          <Panel position="top-right" className="bg-white rounded-lg shadow-lg p-3 space-y-2">
            <div className="text-xs text-gray-600 mb-2 font-medium">Herramientas de Edición</div>
            
            {/* Botones de Undo/Redo */}
            <div className="flex space-x-1">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                title="Deshacer (Ctrl+Z)"
              >
                ↶
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                title="Rehacer (Ctrl+Y)"
              >
                ↷
              </button>
            </div>

            <div className="border-t border-gray-200 my-2"></div>
            <div className="text-xs text-gray-600 mb-2 font-medium">Archivo</div>

            {/* Botones de Guardar/Cargar */}
            <div className="flex space-x-1">
              <button
                onClick={onSaveToLocal}
                className="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                title="Guardar en navegador (Ctrl+S)"
              >
                <Save className="w-3 h-3" />
                Guardar
              </button>
              <button
                onClick={onLoadFromLocal}
                className="flex-1 px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                title="Cargar desde navegador"
              >
                <Upload className="w-3 h-3" />
                Cargar
              </button>
            </div>

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
                onClick={onExportJSON}
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
              <div>• Ctrl+S: Guardar</div>
              <div>• Ctrl+C/V/D: Copy/Paste/Duplicar</div>
              <div>• Ctrl+Z/Y: Deshacer/Rehacer</div>
              <div>• Delete: Eliminar selección</div>
              <div>• Doble click: Editar texto</div>
              <div>• Esc: Modo selección</div>
            </div>
          </Panel>
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>

        {/* Modal de Plantillas */}
        {showTemplates && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Editar {editingNode.type === 'phase' ? 'Fase' : 
                        editingNode.type === 'activity' ? 'Actividad' :
                        editingNode.type === 'decision' ? 'Decisión' : 'Proceso'}
              </h2>
              
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

              <div className="mt-6">
                <div className="text-xs text-gray-500 mb-3 text-center">
                  Presiona <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+Enter</kbd> para guardar o <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Esc</kbd> para cancelar
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edición de Conexión */}
        {editingEdge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

// Componente principal que envuelve con ReactFlowProvider
export default function BPMSDiagram() {
  return (
    <ReactFlowProvider>
      <BPMSDiagramInner />
    </ReactFlowProvider>
  );
}
